// Vesu Pool Detail Card Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  DollarSign,
  AlertTriangle,
  Activity
} from 'lucide-react';
import type { VesuPool } from '@/types/VesuPools';
import { formatApy, formatUtilization, calculateRiskLevel } from '@/lib/vesu-config';

interface VesuPoolDetailCardProps {
  pool: VesuPool;
}

export function VesuPoolDetailCard({ pool }: VesuPoolDetailCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <Shield className="h-4 w-4" />;
      case 'Medium': return <AlertTriangle className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  // Only show real data - no calculations with mock data
  const hasRealData = pool.assets.some(asset => asset.apy > 0 || asset.currentUtilization > 0);

  return (
    <Card className="bg-gradient-to-br from-white/90 via-blue-50/30 to-purple-50/30 dark:from-gray-900/90 dark:via-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl border-2 border-blue-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              {pool.name}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Pool ID: {pool.id.slice(0, 8)}...
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Vesu Pool
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics - Only Real Data */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gradient-to-br from-green-100/50 via-green-200/30 to-green-100/50 dark:from-green-900/30 dark:via-green-800/20 dark:to-green-900/20 rounded-lg border border-green-200/40 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-medium text-sm">APY Status</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hasRealData ? 'Live' : 'N/A'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {hasRealData ? 'Real-time data' : 'No live data'}
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-blue-100/50 via-blue-200/30 to-blue-100/50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-900/20 rounded-lg border border-blue-200/40 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-sm">Data Source</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              API
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Vesu Protocol
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-purple-100/50 via-purple-200/30 to-purple-100/50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-900/20 rounded-lg border border-purple-200/40 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-sm">Assets</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {pool.assets.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Supported assets
            </p>
          </div>
        </div>

        {/* Pool Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Pool Information</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pool Address</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {pool.address.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Status</span>
                <Badge className={`${hasRealData ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} flex items-center gap-1`}>
                  {hasRealData ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  {hasRealData ? 'Live Data' : 'No Live Data'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Vesu Protocol
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pool ID</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {pool.id.slice(0, 12)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Security</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Audited</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Supported Assets</h4>
          <div className="space-y-3">
            {pool.assets.map((asset, index) => {
              const hasAssetData = asset.apy > 0 || asset.currentUtilization > 0;
              return (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-purple-900/20 rounded-lg border border-gray-200/40 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {asset.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-medium">{asset.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{asset.symbol}</p>
                      </div>
                    </div>
                    <Badge className={`${hasAssetData ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} flex items-center gap-1`}>
                      {hasAssetData ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      {hasAssetData ? 'Live' : 'No Data'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {hasAssetData ? formatApy(asset.apy) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">APY</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {hasAssetData ? formatUtilization(asset.currentUtilization) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Utilization</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {hasAssetData ? formatApy(asset.defiSpringApy) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Rewards APY</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                        {asset.decimals}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Decimals</p>
                    </div>
                  </div>
                  
                  {/* Real Configuration Data */}
                  <div className="mt-3 pt-3 border-t border-gray-200/40">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">
                          {asset.address.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">vToken:</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">
                          {asset.vTokenAddress.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
