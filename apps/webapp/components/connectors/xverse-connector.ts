import { Connector, type ConnectArgs } from '@starknet-react/core';
import { request as satsRequest, AddressPurpose, RpcErrorCode, BitcoinNetworkType } from 'sats-connect';
import type { AccountInterface, ProviderInterface, ProviderOptions } from 'starknet';
import { constants } from 'starknet';
import type { RequestFnCall, RpcMessage, RpcTypeToMessageMap } from '@starknet-io/types-js';

type ConnectorData = {
  account?: string;
  chainId?: bigint;
};

interface XverseConnectorOptions {
  id: string;
  name: string;
  icon?: string | { dark: string; light: string };
}

export class XverseConnector extends Connector {
  private _account?: AccountInterface;
  private _address?: string;
  private readonly _options: XverseConnectorOptions;

  constructor({ options }: { options: XverseConnectorOptions }) {
    super();
    this._options = options;
  }

  get id(): string {
    return this._options.id;
  }

  get name(): string {
    return this._options.name;
  }

  get icon(): string | { dark: string; light: string } {
    return this._options.icon || { dark: 'https://wallet.xverse.app/favicon.ico', light: 'https://wallet.xverse.app/favicon.ico' };
  }

  available(): boolean {
    // Check if Xverse wallet is available via sats-connect
    // sats-connect works by checking if the wallet extension is installed
    // We can't directly check, but we can try to use it
    return typeof window !== 'undefined';
  }

  async ready(): Promise<boolean> {
    return this.available();
  }

  async connect(_args?: ConnectArgs): Promise<ConnectorData> {
    try {
      // Request connection to Xverse wallet with Starknet address
      const response = await satsRequest('wallet_connect', {
        addresses: [AddressPurpose.Starknet],
        network: BitcoinNetworkType.Mainnet,
        message: 'Connect to Numo',
      });

      if (response.status === 'success') {
        // Find the Starknet address from the response
        const addresses = response.result?.addresses || [];
        const starknetAddressItem = addresses.find(
          (address: { purpose: string }) => 
            address.purpose === AddressPurpose.Starknet || 
            address.purpose === 'starknet' ||
            address.purpose === 'Starknet'
        );

        if (!starknetAddressItem || !starknetAddressItem.address) {
          throw new Error('No Starknet address found in Xverse wallet. Please make sure you have a Starknet account in your Xverse wallet.');
        }

        this._address = starknetAddressItem.address;

        const chainId = await this.chainId();

        return {
          account: this._address,
          chainId,
        };
      } else {
        if (response.error?.code === RpcErrorCode.USER_REJECTION) {
          throw new Error('User rejected the connection request');
        }
        const errorMessage = response.error?.message || 'Failed to connect to Xverse wallet';
        console.error('Xverse connection failed:', errorMessage, response.error);
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Xverse connection error:', error);
      
      // Handle different error types
      const err = error as { error?: { code?: number | RpcErrorCode }; message?: string; toString?: () => string };
      if (err?.error?.code === RpcErrorCode.USER_REJECTION) {
        throw new Error('User rejected the connection request');
      }
      
      if (err?.message) {
        throw error;
      }
      
      // Check if it's a network/connection error
      const errorString = err?.toString?.() || '';
      if (errorString.includes('xverse') || errorString.includes('Xverse')) {
        throw new Error('Xverse wallet not found. Please make sure Xverse wallet extension is installed and unlocked.');
      }
      
      throw new Error(errorString || 'Failed to connect to Xverse wallet. Please make sure Xverse wallet is installed and unlocked.');
    }
  }

  async disconnect(): Promise<void> {
    this._account = undefined;
    this._address = undefined;
  }

  async account(_provider: ProviderOptions | ProviderInterface): Promise<AccountInterface> {
    if (!this._address) {
      throw new Error('Not connected');
    }

    // Xverse wallet uses sats-connect for Starknet transactions
    // We need to create an AccountInterface that uses sats-connect's request method
    // For now, we'll create a minimal implementation
    // Note: Full AccountInterface implementation would require more methods from sats-connect
    const account = {
      address: this._address,
      signMessage: async (_messages: unknown[]): Promise<unknown> => {
        try {
          // Note: This would need to use the correct sats-connect method for Starknet
          // The exact method name may vary - this is a placeholder
          throw new Error('signMessage not yet implemented for Xverse Starknet. Please use execute for transactions.');
        } catch (error: unknown) {
          console.error('Xverse signMessage error:', error);
          throw error;
        }
      },
      execute: async (_calls: unknown[]): Promise<unknown> => {
        try {
          // Note: This would need to use the correct sats-connect method for Starknet
          // The exact method name may vary - this is a placeholder
          throw new Error('execute not yet fully implemented for Xverse Starknet. Full integration requires sats-connect Starknet methods.');
        } catch (error: unknown) {
          console.error('Xverse execute error:', error);
          throw error;
        }
      },
    } as unknown as AccountInterface;

    return account;
  }

  async request<T extends RpcMessage['type']>(_call: RequestFnCall<T>): Promise<RpcTypeToMessageMap[T]['result']> {
    // Implement the request method required by Connector
    // This would need to map Starknet RPC calls to sats-connect requests
    throw new Error('Request method not yet implemented for Xverse connector');
  }

  async chainId(): Promise<bigint> {
    return BigInt(constants.StarknetChainId.SN_MAIN);
  }

  protected onAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.disconnect();
    } else if (accounts[0] !== this._address) {
      this._address = accounts[0];
    }
  }
}

export function xverse(): XverseConnector {
  return new XverseConnector({
    options: {
      id: 'xverse',
      name: 'Xverse',
      icon: {
        dark: 'https://wallet.xverse.app/favicon.ico',
        light: 'https://wallet.xverse.app/favicon.ico',
      } as { dark: string; light: string },
    },
  });
}

