'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function StarknetWalletConnect() {
  const { address, connect, connectors, isConnecting, isDisconnecting } = useWallet();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const isConnected = !!address;

  const handleConnect = async (connectorId: string) => {
    setSelectedConnector(connectorId);
    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setSelectedConnector(null);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect StarkNet Wallet
        </CardTitle>
        <CardDescription>
          Connect your StarkNet wallet to interact with the Vesu Vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        {isConnected ? (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-200">
              <div className="space-y-1">
                <p className="font-medium">Wallet Connected</p>
                <p className="text-sm font-mono">{formatAddress(address!)}</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              No wallet connected. Please connect to continue.
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Options */}
        {!isConnected && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Available Wallets</h4>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isConnecting || isDisconnecting || selectedConnector === connector.id}
                  className="w-full justify-start"
                  variant="outline"
                >
                  {selectedConnector === connector.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      {connector.name}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Supported wallets: Argent, Braavos</p>
          <p>• Make sure you're on StarkNet Mainnet</p>
          <p>• You'll need wBTC to make deposits</p>
        </div>
      </CardContent>
    </Card>
  );
}
