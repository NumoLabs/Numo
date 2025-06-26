/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { StarknetkitConnector, useStarknetkitConnectModal } from 'starknetkit';
import { Connector } from '@starknet-react/core';
import { Button } from "./button"

export default function WalletConnector() {
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  async function connectWallet() {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connect({ connector: connector as Connector });
  }

  if (!address) {
    return (
      <div className="flex items-center gap-4">
        <Button
          onClick={connectWallet}
          variant="default"
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          onClick={() => disconnect()}
          variant="default"
          className="bg-gradient-to-r from-white via-gray-50 to-white hover:from-gray-50 hover:via-gray-100 hover:to-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
}
