// Pragma price service - real price data only
import { Contract, RpcProvider } from 'starknet';
import { PRAGMA_FEED_ABI } from '../lib/abi/pragmaFeed';
import type { PragmaPrice, PricePoint } from '../types';
import { scaleByDecimals } from '../lib/math';

export class PragmaService {
  private contract: Contract;
  private provider: RpcProvider;
  private feedAddress: string;

  constructor(feedAddress: string, rpcUrl: string) {
    this.feedAddress = feedAddress;
    this.provider = new RpcProvider({ nodeUrl: rpcUrl });
    this.contract = new Contract(PRAGMA_FEED_ABI, feedAddress, this.provider);
  }

  async getLatestPrice(): Promise<PragmaPrice> {
    try {
      const [roundId, answer, startedAt, updatedAt, answeredInRound] = await this.contract.latest_round_data();
      const decimals = await this.contract.decimals();
      
      return {
        price: scaleByDecimals(answer as bigint, Number(decimals)),
        updatedAt: Number(updatedAt as bigint) * 1000, // Convert to milliseconds
        decimals: Number(decimals),
        feed: this.feedAddress
      };
    } catch (error) {
      console.error('Error fetching latest price from Pragma:', error);
      
      // Check if it's a contract not found error
      if (error instanceof Error && error.message.includes('Contract not found')) {
        throw new Error(`Pragma feed contract not found at address ${this.feedAddress}. Please verify the contract address is correct for the current network.`);
      }
      
      throw new Error('Failed to fetch latest price from Pragma feed');
    }
  }

  async getHistoricalPrices(
    fromTimestamp: number,
    toTimestamp: number,
    intervalSec: number = 3600 // 1 hour
  ): Promise<PricePoint[]> {
    try {
      // Get current round data first
      const [currentRoundId] = await this.contract.latest_round_data();
      const currentRound = Number(currentRoundId as bigint);
      
      // Calculate how many rounds we need to go back
      const timeDiff = toTimestamp - fromTimestamp;
      const roundsNeeded = Math.floor(timeDiff / (intervalSec * 1000));
      
      const prices: PricePoint[] = [];
      
      // Fetch historical rounds (limited to avoid too many calls)
      const maxRounds = Math.min(roundsNeeded, 100); // Limit to 100 rounds max
      
      for (let i = 0; i < maxRounds; i++) {
        try {
          const roundId = currentRound - i;
          if (roundId <= 0) break;
          
          const [, answer, , updatedAt] = await this.contract.get_round_data(roundId);
          const decimals = await this.contract.decimals();
          
          const timestamp = Number(updatedAt as bigint) * 1000;
          if (timestamp >= fromTimestamp && timestamp <= toTimestamp) {
            prices.push({
              timestamp,
              price: scaleByDecimals(answer as bigint, Number(decimals))
            });
          }
        } catch (roundError) {
          // Skip rounds that don't exist or fail
          console.warn(`Failed to fetch round ${currentRound - i}:`, roundError);
          continue;
        }
      }
      
      // Sort by timestamp (oldest first)
      return prices.sort((a, b) => a.timestamp - b.timestamp);
      
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw new Error('Failed to fetch historical price data');
    }
  }

  async getPriceAtTimestamp(timestamp: number): Promise<number | null> {
    try {
      // This is a simplified implementation
      // Real implementation would need to find the closest round to the timestamp
      const [roundId, answer] = await this.contract.latest_round_data();
      const decimals = await this.contract.decimals();
      
      return scaleByDecimals(answer as bigint, Number(decimals));
    } catch (error) {
      console.error('Error fetching price at timestamp:', error);
      return null;
    }
  }
}
