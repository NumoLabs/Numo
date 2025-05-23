/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
	ARGENT_WEBWALLET_URL,
	getProvider,
	getChainId,
	getNodeUrl,
} from '@/constants';
import { walletStarknetkitLatestAtom } from '@/app/state/connectedWallet';
import { useAtom } from 'jotai';
import { connect, disconnect } from 'starknetkit';
import { Button } from './button';

export default function WalletConnector() {
	const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);

	const handleConnect = async () => {
		try {
			const chainId = getChainId();
			const nodeUrl = getNodeUrl();
			const provider = getProvider(nodeUrl !== undefined ? nodeUrl : '');
			const { wallet: connectedWallet } = await connect({
				modalMode: 'alwaysAsk',
				webWalletUrl: ARGENT_WEBWALLET_URL,
				argentMobileOptions: {
					dappName: 'PayStark',
					url: window.location.hostname,
					chainId,
					icons: [],
				},
			});
			setWallet(connectedWallet);
		} catch (e) {
			console.error(e);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			alert((e as any).message);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleDisconnect = async (event: any) => {
		event.preventDefault();
		try {
			await disconnect();
			setWallet(undefined);
		} catch (error) {
			console.error('Failed to disconnect wallet:', error);
		}
	};

	return (
		<div className="flex items-center gap-4">
			{wallet ? (
				<div className="flex items-center gap-4">
					<span className="text-sm font-medium text-gray-200">
						{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
					</span>
					<Button 
						onClick={handleDisconnect} 
						variant="outline"
						className="border-gray-600 hover:bg-gray-800 hover:text-white transition-colors"
					>
						Disconnect
					</Button>
				</div>
			) : (
				<Button 
					onClick={handleConnect} 
					variant="default"
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
				>
					Connect Wallet
				</Button>
			)}
		</div>
	);
}