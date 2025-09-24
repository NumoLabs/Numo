// Vesu Testnet Banner Component
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TestTube, Network } from 'lucide-react';

interface VesuTestnetBannerProps {
	isTestnet: boolean;
	onSwitchNetwork?: () => void;
}

export function VesuTestnetBanner({ isTestnet, onSwitchNetwork }: VesuTestnetBannerProps) {
	if (!isTestnet) return null;

	return (
		<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
			<TestTube className="h-4 w-4 text-orange-600" />
			<AlertDescription className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="border-orange-300 text-orange-700">
						<Network className="h-3 w-3 mr-1" />
						Testnet Mode
					</Badge>
					<span className="text-orange-800 dark:text-orange-200">
						You are currently using real Vesu testnet pools from the official Sepolia deployment. These are for testing purposes only.
					</span>
				</div>
				{onSwitchNetwork && (
					<button
						onClick={onSwitchNetwork}
						className="text-sm text-orange-600 hover:text-orange-800 underline"
					>
						Switch to Mainnet
					</button>
				)}
			</AlertDescription>
		</Alert>
	);
}
