// Vesu Pools Testnet Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVesuPools, useVesuConfig } from '@/hooks/use-vesu';
import { VesuTestnetBanner } from './vesu-testnet-banner';
import { VesuWalletConnect } from './vesu-wallet-connect';
import { formatApy, formatUtilization, calculateRiskLevel } from '@/lib/vesu-config';
import { getVesuAssets, convertVesuAssetToPoolAsset } from '@/lib/vesu-real-data';
import { useWalletStatus } from '@/hooks/use-wallet';
import { 
	TrendingUp, 
	Users, 
	Shield, 
	AlertTriangle, 
	ExternalLink 
} from 'lucide-react';

interface VesuPoolsTestnetProps {
	onPoolSelect?: (pool: any) => void;
	showTestnetBanner?: boolean;
}

export function VesuPoolsTestnet({ onPoolSelect, showTestnetBanner = true }: VesuPoolsTestnetProps) {
  const { pools, loading, error } = useVesuPools();
  const { isTestnetMode } = useVesuConfig();
  const { isConnected } = useWalletStatus();
  const [selectedPool, setSelectedPool] = useState<any>(null);

  // Only use real pools from API - no fallback to mock data
  const displayPools = pools;

	const handlePoolSelect = (pool: any) => {
		setSelectedPool(pool);
		onPoolSelect?.(pool);
	};

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case 'Low': return 'bg-green-500 text-white border-green-600';
			case 'Medium': return 'bg-yellow-500 text-white border-yellow-600';
			case 'High': return 'bg-red-500 text-white border-red-600';
			case 'Critical': return 'bg-red-600 text-white border-red-700';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getRiskIcon = (risk: string) => {
		switch (risk) {
			case 'Low': return <Shield className="h-3 w-3" />;
			case 'Medium': return <AlertTriangle className="h-3 w-3" />;
			case 'High': return <AlertTriangle className="h-3 w-3" />;
			case 'Critical': return <AlertTriangle className="h-3 w-3" />;
			default: return <Shield className="h-3 w-3" />;
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				{showTestnetBanner && <VesuTestnetBanner isTestnet={isTestnetMode} />}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-8 w-full" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-4">
				{showTestnetBanner && <VesuTestnetBanner isTestnet={isTestnetMode} />}
				<Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-red-600" />
							<span className="text-red-800 dark:text-red-200">
								Error loading Vesu pools: {error}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{showTestnetBanner && <VesuTestnetBanner isTestnet={isTestnetMode} />}
			
			{/* Wallet Connection */}
			<VesuWalletConnect />
			
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					Vesu Pools {isTestnetMode && '(Testnet)'}
				</h2>
				<p className="text-muted-foreground">
					{isTestnetMode 
						? 'Explore and interact with Vesu testnet pools for development and testing'
						: 'Discover and participate in Vesu lending pools'
					}
				</p>
			</div>

			{displayPools.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center py-8">
							<Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No Real Pool Data Available</h3>
							<p className="text-muted-foreground">
								{isTestnetMode 
									? 'Unable to fetch real Vesu testnet pool data from the API. Please check your connection and try again.'
									: 'Unable to fetch real Vesu mainnet pool data from the API. Please check your connection and try again.'
								}
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{displayPools.map((pool) => {
						// Add null safety checks for pool properties
						const poolName = pool?.name ?? 'Unknown Pool';
						const poolId = pool?.id ?? 'unknown';
						const assets = pool?.assets ?? [];
						
						return (
							<Card 
								key={poolId} 
								className={`cursor-pointer transition-all hover:shadow-md border-2 border-yellow-400 dark:border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.3)] hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black ${
									selectedPool?.id === poolId ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-[0_0_25px_rgba(250,204,21,0.6)]' : ''
								}`}
								style={{
									background: 'linear-gradient(135deg, #000000 0%, #2d2800 20%, #3d3500 40%, #2d2800 60%, #1a1500 80%, #000000 100%)',
									backgroundImage: 'radial-gradient(ellipse at center, rgba(250, 204, 21, 0.35) 0%, rgba(250, 204, 21, 0.2) 30%, rgba(250, 204, 21, 0.1) 60%, rgba(250, 204, 21, 0.05) 80%, transparent 100%)'
								}}
								onClick={() => handlePoolSelect(pool)}
							>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg">{poolName}</CardTitle>
										<Badge variant="outline" className="text-xs">
											{assets.length} assets
										</Badge>
									</div>
									<CardDescription>
										Pool ID: {poolId.slice(0, 8)}...
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{assets.map((asset: any, index: number) => {
										// Add null safety checks for asset properties
										const currentUtilization = asset?.currentUtilization ?? 0;
										const apy = asset?.apy ?? 0;
										const defiSpringApy = asset?.defiSpringApy ?? 0;
										const symbol = asset?.symbol ?? 'Unknown';
										
										const risk = calculateRiskLevel(currentUtilization);
										return (
											<div key={index} className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="font-medium">{symbol}</span>
													<Badge 
														variant="outline" 
														className={`text-xs ${getRiskColor(risk)}`}
													>
														{getRiskIcon(risk)}
														<span className="ml-1">{risk}</span>
													</Badge>
												</div>
												<div className="grid grid-cols-2 gap-2 text-sm">
													<div>
														<span className="text-muted-foreground">APY:</span>
														<span className="ml-1 font-medium text-green-600">
															{formatApy(apy)}
														</span>
													</div>
													<div>
														<span className="text-muted-foreground">Utilization:</span>
														<span className="ml-1 font-medium">
															{formatUtilization(currentUtilization)}
														</span>
													</div>
												</div>
												{defiSpringApy > 0 && (
													<div className="text-sm">
														<span className="text-muted-foreground">Rewards APY:</span>
														<span className="ml-1 font-medium text-blue-600">
															{formatApy(defiSpringApy)}
														</span>
													</div>
												)}
											</div>
										);
										})}
										<Button 
											className="w-full" 
											variant={selectedPool?.id === poolId ? "default" : "outline"}
										>
											{selectedPool?.id === poolId ? 'Selected' : 'Select Pool'}
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
