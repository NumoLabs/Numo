import { NextRequest, NextResponse } from 'next/server';
import { RpcProvider, Contract } from 'starknet';

// wBTC contract address on Starknet Mainnet
const WBTC_ADDRESS = '0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC';
const WBTC_DECIMALS = 8;

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Build Alchemy RPC URL from API key
const getAlchemyRpcUrl = (): string | null => {
  if (!ALCHEMY_API_KEY) return null;
  
  return `https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/${ALCHEMY_API_KEY}`;
};

// Simple ERC20 ABI for balanceOf - kept for future use
// const ERC20_ABI = [
//   {
//     name: 'balanceOf',
//     type: 'function',
//     inputs: [
//       {
//         name: 'account',
//         type: 'felt'
//       }
//     ],
//     outputs: [
//       {
//         name: 'balance',
//         type: 'Uint256'
//       }
//     ],
//     stateMutability: 'view'
//   }
// ];

/**
 * GET /api/wallet/wbtc-balance
 * Get wBTC balance for a wallet address
 * Requires x-wallet-address header with wallet address
 */
export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress || walletAddress.trim().length === 0) {
      return NextResponse.json(
        { error: 'Wallet address is required. Please provide x-wallet-address header.' },
        { status: 400 }
      );
    }

    // Validate wallet address format (basic validation)
    if (!/^0x[0-9a-fA-F]{63,64}$/.test(walletAddress.trim())) {
      return NextResponse.json(
        { error: 'Invalid wallet address format.' },
        { status: 400 }
      );
    }

    let balance = 0;
    let balanceWei = BigInt(0);
    let source = 'rpc';

    const alchemyRpcUrl = getAlchemyRpcUrl();
    const rpcUrl = alchemyRpcUrl || 
      process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 
      'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';

    source = alchemyRpcUrl ? 'alchemy-rpc' : 'public-rpc';

    try {
      // Create RPC provider
      const provider = new RpcProvider({
        nodeUrl: rpcUrl
      });

      // Create contract instance with proper ABI
      const contract = new Contract([
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [{"name": "account", "type": "core::starknet::contract_address::ContractAddress"}],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        }
      ], WBTC_ADDRESS, provider);

      const result = await contract.call('balanceOf', [walletAddress.trim()], { blockIdentifier: 'latest' });
      
      // Calculate 2^128 as a constant (340282366920938463463374607431768211456)
      const TWO_TO_128 = BigInt('340282366920938463463374607431768211456');
      
      // Handle different result formats
      if (typeof result === 'bigint' || typeof result === 'number') {
        // Direct bigint or number
        balanceWei = BigInt(result.toString());
      } else if (result && typeof result === 'object') {
        // Uint256 object with low and high
        if ('low' in result && 'high' in result) {
          const low = typeof result.low === 'string' ? BigInt(result.low) : BigInt(result.low?.toString() || '0');
          const high = typeof result.high === 'string' ? BigInt(result.high) : BigInt(result.high?.toString() || '0');
          // Calculate full balance: low + (high * 2^128)
          balanceWei = low + (high * TWO_TO_128);
        } else if ('balance' in result) {
          // Nested balance object
          const balanceObj = result.balance;
          if (typeof balanceObj === 'bigint' || typeof balanceObj === 'number') {
            balanceWei = BigInt(balanceObj.toString());
          } else if (balanceObj && typeof balanceObj === 'object' && 'low' in balanceObj) {
            const low = typeof balanceObj.low === 'string' ? BigInt(balanceObj.low) : BigInt(balanceObj.low?.toString() || '0');
            const high = typeof balanceObj.high === 'string' ? BigInt(balanceObj.high || '0') : BigInt(balanceObj.high?.toString() || '0');
            balanceWei = low + (high * TWO_TO_128);
          } else {
            throw new Error('Unexpected balance format');
          }
        } else {
          // Try to convert object to string and then to BigInt
          balanceWei = BigInt(result.toString());
        }
      } else {
        // String or other type
        balanceWei = BigInt(result?.toString() || '0');
      }
      
      // Convert to human readable format
      balance = Number(balanceWei) / Math.pow(10, WBTC_DECIMALS);
      
      console.log('wBTC Balance fetched:', {
        walletAddress: walletAddress.trim(),
        balanceWei: balanceWei.toString(),
        balance,
        source,
        resultType: typeof result,
        resultKeys: result && typeof result === 'object' ? Object.keys(result) : 'N/A',
      });
    } catch (rpcError) {
      console.error('Error fetching balance via RPC:', rpcError);
      throw new Error(`Failed to fetch wBTC balance from RPC: ${rpcError instanceof Error ? rpcError.message : 'Unknown error'}`);
    }

    // Fetch BTC price in USD (using CoinGecko API as fallback)
    // You can replace this with Alchemy or another price API if needed
    let btcPriceUSD = 0;
    try {
      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        {
          next: { revalidate: 300 } // Cache for 5 minutes
        }
      );
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        btcPriceUSD = priceData.bitcoin?.usd || 0;
      }
    } catch (error) {
      // Silently fail price fetch - balance is more important
      console.warn('Failed to fetch BTC price:', error);
    }

    const balanceUSD = balance * btcPriceUSD;

    return NextResponse.json({
      balance,
      balanceWei: balanceWei.toString(),
      balanceUSD,
      btcPriceUSD,
      decimals: WBTC_DECIMALS,
      tokenAddress: WBTC_ADDRESS,
      walletAddress: walletAddress.trim(),
      source,
    });
  } catch (error) {
    console.error('Error fetching wBTC balance:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch wBTC balance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

