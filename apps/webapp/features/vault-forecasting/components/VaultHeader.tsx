// Vault header component
import { ExternalLink, AlertCircle } from 'lucide-react';
import type { VaultSnapshot } from '../types';

interface VaultHeaderProps {
  vaultAddress: string;
  snapshot?: VaultSnapshot;
  isLoading: boolean;
  error?: Error | null;
}

export function VaultHeader({ vaultAddress, snapshot, isLoading, error }: VaultHeaderProps) {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';
  const voyagerUrl = `https://voyager.online/${network}/contract/${vaultAddress}`;

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Error loading vault data</span>
        </div>
        <p className="text-red-300 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vault Forecasting</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time on-chain data analysis • No simulated data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 capitalize">{network}</span>
          <a
            href={voyagerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            View on Voyager
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Vault Address</div>
          <div className="font-mono text-sm text-white break-all">
            {vaultAddress.slice(0, 10)}...{vaultAddress.slice(-8)}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-6 bg-gray-600 rounded"></div>
            </div>
          </div>
        ) : snapshot ? (
          <>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Total Value Locked</div>
              <div className="text-lg font-semibold text-white">
                ${snapshot.tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Price Per Share</div>
              <div className="text-lg font-semibold text-white">
                ${snapshot.pricePerShare.toFixed(6)}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {snapshot && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            Last updated: {new Date(snapshot.updatedAt).toLocaleString()}
            {snapshot.lastRebalance && (
              <span className="ml-4">
                Last rebalance: {new Date(snapshot.lastRebalance).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
