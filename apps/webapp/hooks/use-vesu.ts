// Vesu Integration Hook for Testnet Support
import { useState, useEffect, useCallback } from 'react';
import { getVesuConfig, getVesuConfigByChainId, type VesuConfig } from '@/lib/vesu-config';
import { getCurrentChainId, isTestnet } from '@/lib/utils';
import { getVesuPools, getVesuV2EarnPositions as getEarnPositions, getVesuTokens } from '@/app/api/vesuApi';
import type { VesuPool } from '@/types/VesuPools';
import type { VesuEarnPosition } from '@/types/VesuPositions';

export interface VesuHookState {
	config: VesuConfig;
	pools: VesuPool[];
	positions: VesuEarnPosition[];
	tokens: any[];
	loading: boolean;
	error: string | null;
	isTestnetMode: boolean;
}

export interface VesuHookActions {
	refreshPools: () => Promise<void>;
	refreshPositions: (address: string) => Promise<void>;
	refreshTokens: () => Promise<void>;
	switchNetwork: (chainId: string) => void;
}

export function useVesu(): VesuHookState & VesuHookActions {
	const [state, setState] = useState<VesuHookState>({
		config: getVesuConfig(),
		pools: [],
		positions: [],
		tokens: [],
		loading: false,
		error: null,
		isTestnetMode: isTestnet(),
	});

	// Update configuration when chain changes
	useEffect(() => {
		const currentChainId = getCurrentChainId();
		const newConfig = getVesuConfigByChainId(currentChainId);
		const isTestnetMode = currentChainId === 'SN_SEPOLIA';
		
		setState(prev => ({
			...prev,
			config: newConfig,
			isTestnetMode,
		}));
	}, []);

	// Refresh pools
	const refreshPools = useCallback(async () => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		
		try {
			const pools = await getVesuPools();
			setState(prev => ({ ...prev, pools, loading: false }));
		} catch (error) {
			setState(prev => ({ 
				...prev, 
				loading: false, 
				error: error instanceof Error ? error.message : 'Failed to fetch pools' 
			}));
		}
	}, []);

	// Refresh positions
	const refreshPositions = useCallback(async (address: string) => {
		if (!address) return;
		
		setState(prev => ({ ...prev, loading: true, error: null }));
		
		try {
			const positions = await getEarnPositions(address);
			setState(prev => ({ ...prev, positions, loading: false }));
		} catch (error) {
			setState(prev => ({ 
				...prev, 
				loading: false, 
				error: error instanceof Error ? error.message : 'Failed to fetch positions' 
			}));
		}
	}, []);

	// Refresh tokens
	const refreshTokens = useCallback(async () => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		
		try {
			const tokens = await getVesuTokens();
			setState(prev => ({ ...prev, tokens, loading: false }));
		} catch (error) {
			setState(prev => ({ 
				...prev, 
				loading: false, 
				error: error instanceof Error ? error.message : 'Failed to fetch tokens' 
			}));
		}
	}, []);

	// Switch network
	const switchNetwork = useCallback((chainId: string) => {
		const newConfig = getVesuConfigByChainId(chainId);
		const isTestnetMode = chainId === 'SN_SEPOLIA';
		
		setState(prev => ({
			...prev,
			config: newConfig,
			isTestnetMode,
			pools: [], // Clear pools when switching networks
			positions: [], // Clear positions when switching networks
		}));
	}, []);

	// Auto-refresh pools on mount
	useEffect(() => {
		refreshPools();
	}, [refreshPools]);

	return {
		...state,
		refreshPools,
		refreshPositions,
		refreshTokens,
		switchNetwork,
	};
}

// Hook for Vesu pool management
export function useVesuPools() {
	const { pools, loading, error, refreshPools } = useVesu();
	
	return {
		pools,
		loading,
		error,
		refreshPools,
	};
}

// Hook for Vesu positions
export function useVesuPositions(address?: string) {
	const { positions, loading, error, refreshPositions } = useVesu();
	
	useEffect(() => {
		if (address) {
			refreshPositions(address);
		}
	}, [address, refreshPositions]);
	
	return {
		positions,
		loading,
		error,
		refreshPositions,
	};
}

// Hook for Vesu configuration
export function useVesuConfig() {
	const { config, isTestnetMode } = useVesu();
	
	return {
		config,
		isTestnetMode,
	};
}
