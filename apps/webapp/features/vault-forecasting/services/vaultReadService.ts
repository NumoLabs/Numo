// Vault read service - only view functions, no transactions
import { Contract, RpcProvider } from 'starknet';
import { VAULT_VIEWS_ABI } from '../lib/abi/vaultViews';
import type { VaultReadResult } from '../types';
import { scaleByDecimals } from '../lib/math';

export class VaultReadService {
  private contract: Contract;
  private provider: RpcProvider;

  constructor(vaultAddress: string, rpcUrl: string) {
    this.provider = new RpcProvider({ nodeUrl: rpcUrl });
    this.contract = new Contract(VAULT_VIEWS_ABI, vaultAddress, this.provider);
  }

  async getSnapshot(): Promise<VaultReadResult> {
    const result: VaultReadResult = {};

    try {
      // Try to read all available view functions
      const promises = [
        this.tryCall('totalAssets'),
        this.tryCall('totalAssetsUsd'),
        this.tryCall('asset'),
        this.tryCall('underlying'),
        this.tryCall('decimals'),
        this.tryCall('pricePerShare'),
        this.tryCall('lastRebalance'),
        this.tryCall('rebalanceInterval'),
        this.tryCall('getPositions'),
        this.tryCall('getWeights'),
        this.tryCall('managementFee'),
        this.tryCall('performanceFee')
      ];

      const [
        totalAssets,
        totalAssetsUsd,
        asset,
        underlying,
        decimals,
        pricePerShare,
        lastRebalance,
        rebalanceInterval,
        positions,
        weights,
        managementFee,
        performanceFee
      ] = await Promise.allSettled(promises);

      // Process results safely
      if (totalAssets.status === 'fulfilled' && totalAssets.value) {
        result.totalAssets = totalAssets.value as bigint;
      }

      if (totalAssetsUsd.status === 'fulfilled' && totalAssetsUsd.value) {
        result.totalAssetsUsd = totalAssetsUsd.value as bigint;
      }

      if (asset.status === 'fulfilled' && asset.value) {
        result.asset = asset.value as string;
      }

      if (underlying.status === 'fulfilled' && underlying.value) {
        result.underlying = underlying.value as string;
      }

      if (decimals.status === 'fulfilled' && decimals.value) {
        result.decimals = Number(decimals.value);
      }

      if (pricePerShare.status === 'fulfilled' && pricePerShare.value) {
        result.pricePerShare = pricePerShare.value as bigint;
      }

      if (lastRebalance.status === 'fulfilled' && lastRebalance.value) {
        result.lastRebalance = lastRebalance.value as bigint;
      }

      if (rebalanceInterval.status === 'fulfilled' && rebalanceInterval.value) {
        result.rebalanceInterval = rebalanceInterval.value as bigint;
      }

      if (positions.status === 'fulfilled' && positions.value) {
        result.positions = positions.value as Array<{ pool: string; weight: bigint }>;
      }

      if (weights.status === 'fulfilled' && weights.value) {
        // If we have weights but no positions, create positions from weights
        if (!result.positions && Array.isArray(weights.value)) {
          result.positions = weights.value.map((weight: bigint, index: number) => ({
            pool: `pool_${index}`,
            weight
          }));
        }
      }

      if (managementFee.status === 'fulfilled' && managementFee.value) {
        result.managementFee = managementFee.value as bigint;
      }

      if (performanceFee.status === 'fulfilled' && performanceFee.value) {
        result.performanceFee = performanceFee.value as bigint;
      }

    } catch (error) {
      console.warn('Error reading vault contract:', error);
      throw new Error('Failed to read vault data');
    }

    return result;
  }

  private async tryCall(functionName: string): Promise<any> {
    try {
      if (this.contract[functionName]) {
        return await this.contract[functionName]();
      }
      return null;
    } catch (error) {
      // Function doesn't exist or failed - this is expected for some contracts
      return null;
    }
  }

  async getHistoricalSnapshots(
    fromTimestamp: number,
    toTimestamp: number,
    intervalMs: number = 24 * 60 * 60 * 1000 // 24 hours
  ): Promise<Array<{ pricePerShare: number; updatedAt: number }>> {
    // Note: This is a placeholder for historical data
    // Real implementation would need to query historical state or events
    // For now, we'll return empty array and handle this in the UI
    console.warn('Historical snapshots not implemented - requires event indexing');
    return [];
  }
}
