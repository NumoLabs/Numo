"use client"

// Vesu Pools Testnet Component
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVesuPools, useVesuConfig } from '@/hooks/use-vesu';
import { VesuTestnetBanner } from './vesu-testnet-banner';
import { VesuWalletConnect } from './vesu-wallet-connect';
import type { VesuPool } from '@/types/VesuPools';
import { AlertTriangle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VesuPoolsTestnetProps {
	onPoolSelect?: (pool: VesuPool) => void;
	showTestnetBanner?: boolean;
}

export function VesuPoolsTestnet({ onPoolSelect, showTestnetBanner = true }: VesuPoolsTestnetProps) {
  const { pools, loading, error } = useVesuPools();
  const { isTestnetMode } = useVesuConfig();

  // Only use real pools from API - no fallback to mock data
  const displayPools = pools;

	const handlePoolSelect = (pool: VesuPool) => {
		onPoolSelect?.(pool);
	};

	const getRiskColor = (risk: string) => {
		switch (risk?.toLowerCase()) {
			case 'low': return 'bg-green-500 text-white dark:bg-green-600 dark:text-white border-green-600';
			case 'medium': return 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white border-yellow-600';
			case 'high': return 'bg-red-500 text-white dark:bg-red-600 dark:text-white border-red-600';
			case 'critical': return 'bg-red-600 text-white dark:bg-red-700 dark:text-white border-red-700';
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				{showTestnetBanner && <VesuTestnetBanner isTestnet={isTestnetMode} />}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<Card key={i} className="animate-pulse">
							<CardHeader>
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-3 w-full mb-2" />
								<Skeleton className="h-3 w-2/3" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				{showTestnetBanner && <VesuTestnetBanner isTestnet={isTestnetMode} />}
				<Card className="border-red-200 dark:border-red-800">
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<AlertTriangle className="h-5 w-5 text-red-600" />
							<div>
								<h3 className="font-medium text-red-600">Error Loading Pools</h3>
								<p className="text-sm text-muted-foreground">{error}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{showTestnetBanner && <VesuTestnetBanner isTestnet={isTestnetMode} />}
			<VesuWalletConnect />
			
			{displayPools.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center space-y-3">
							<AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
							<div>
								<h3 className="font-medium">No Pools Available</h3>
								<p className="text-sm text-muted-foreground">
									No Vesu pools are currently available. Please check back later.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{displayPools.map((pool) => (
						<Card key={pool.id}>
							<CardHeader>
								<div className="flex justify-between items-start">
									<CardTitle className="text-lg">{pool.name}</CardTitle>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<Info className="h-4 w-4" />
													<span className="sr-only">Information</span>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">
													Click on &quot;View Details&quot; to get more information about this pool, including risks, strategies
													and historical performance.
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<CardDescription>
									{pool.assets.map(a => a.symbol).join('/')} liquidity pool on Vesu with automatic rebalancing
								</CardDescription>
							</CardHeader>

							<CardContent>
								<div className="grid grid-cols-2 gap-2 mb-4">
									<div className="space-y-1">
										<p className="text-sm text-muted-foreground">APY</p>
										<p className="text-lg font-semibold">
											{pool.assets.length > 0 
												? `${(pool.assets.reduce((sum, asset) => sum + asset.apy, 0) / pool.assets.length).toFixed(2)}%`
												: 'N/A'}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-sm text-muted-foreground">TVL</p>
										<p className="text-lg font-semibold">N/A</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">Vesu</Badge>
									{(() => {
										const firstAsset = pool.assets[0];
										const riskLevel = firstAsset && 'riskLevel' in firstAsset ? (firstAsset as { riskLevel?: string }).riskLevel : undefined;
										return riskLevel ? (
											<Badge key="risk" className={getRiskColor(riskLevel)}>
												{riskLevel}
											</Badge>
										) : null;
									})()}
									{pool.assets.slice(0, 2).map((asset, index) => (
										<Badge key={index} variant="outline">
											{asset.symbol}
										</Badge>
									))}
									{pool.assets.length > 2 && (
										<Badge variant="outline">
											+{pool.assets.length - 2}
										</Badge>
									)}
								</div>
							</CardContent>

							<CardFooter className="flex justify-between">
								<Button 
									onClick={() => handlePoolSelect(pool)}
									variant="outline"
									size="sm"
								>
									View Details
								</Button>
								<Button 
									onClick={() => handlePoolSelect(pool)}
									size="sm"
								>
									Add to Vault
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
