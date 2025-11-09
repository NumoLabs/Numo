// Vault Forecasting Feature Exports
export { VaultHeader } from './components/VaultHeader';
export { ForecastChart } from './components/ForecastChart';
export { ParamsPanel } from './components/ParamsPanel';
export { SummaryTable } from './components/SummaryTable';

export { useVaultSnapshot } from './hooks/useVaultSnapshot';
export { usePragmaPrice } from './hooks/usePragmaPrice';
export { usePragmaHistory } from './hooks/usePragmaHistory';

export { VaultReadService } from './services/vaultReadService';
export { PragmaService } from './services/pragmaService';

export { 
  movingAverageForecast, 
  emaForecast, 
  volAdjustedProjection,
  portfolioApyProjection 
} from './lib/models';

export { 
  scaleByDecimals, 
  safeDiv, 
  stdev, 
  annualize, 
  calculateVolatility, 
  calculateReturns 
} from './lib/math';

export type {
  PricePoint,
  VaultSnapshot,
  ForecastParams,
  ForecastResult,
  PragmaPrice,
  VaultReadResult,
  ForecastModel
} from './types';
