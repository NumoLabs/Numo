// Vesu Wallet Connect Component
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Badge is available but not currently used in this component
import { 
  Wallet, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Copy,
  LogOut
} from 'lucide-react';
import { useWallet, useWalletStatus } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import type { Connector } from '@starknet-react/core';

interface VesuWalletConnectProps {
  onWalletConnect?: (address: string) => void;
  onWalletDisconnect?: () => void;
}

export function VesuWalletConnect({ onWalletConnect, onWalletDisconnect }: VesuWalletConnectProps) {
  const { address, connect, disconnect, connectors, isConnecting, isDisconnecting } = useWallet();
  const { isConnected } = useWalletStatus();
  const { toast } = useToast();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const handleConnect = async (connector: Connector) => {
    setIsConnectingWallet(true);
    try {
      await connect({ connector });
      onWalletConnect?.(address || '');
      toast({
        title: "Wallet Connected",
        description: "StarkNet wallet connected successfully for Vesu pools",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet. Please try again.";
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onWalletDisconnect?.();
      toast({
        title: "Wallet Disconnected",
        description: "StarkNet wallet disconnected successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to disconnect wallet.";
      toast({
        title: "Disconnect Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Card className="bg-gradient-to-br from-green-50/50 via-green-100/30 to-green-50/50 dark:from-green-900/20 dark:via-green-800/10 dark:to-green-900/20 border-2 border-green-200/40 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Ready to interact with Vesu pools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200/40">
            <div className="flex items-center gap-3">
              <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-sm text-green-800 dark:text-green-200">
                  {formatAddress(address)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  StarkNet Sepolia
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-800/30"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="h-8 w-8 p-0 text-green-600 hover:text-red-600 hover:bg-red-100 dark:text-green-400 dark:hover:text-red-400 dark:hover:bg-red-800/30"
              >
                {isDisconnecting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <LogOut className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            <span>Ready for Vesu pool transactions</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-purple-50/50 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-purple-900/20 border-2 border-blue-200/40 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Connect your StarkNet wallet to interact with Vesu pools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={isConnecting || isConnectingWallet}
              className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-400 hover:via-blue-500 hover:to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isConnecting || isConnectingWallet ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{connector.name}</span>
                <span className="text-xs opacity-80">
                  {connector.id === 'braavos' ? 'Braavos Wallet' : 'Argent Wallet'}
                </span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
          <AlertTriangle className="h-3 w-3" />
          <span>Make sure you&apos;re on StarkNet Sepolia testnet</span>
        </div>
        
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-800/30"
            onClick={() => window.open('https://starknet.io/ecosystem/wallets/', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Get a StarkNet Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
