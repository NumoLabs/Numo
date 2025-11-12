// Vesu Vault Types
// Types for VesuRebalance contract interactions

// Rebalance feature enum
export enum Feature {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

// Rebalance action
export interface Action {
  pool_id: string; // ContractAddress - pool address (V2: pool_id is now ContractAddress)
  feature: Feature; // DEPOSIT or WITHDRAW
  token: string; // ContractAddress - asset token address
  amount: string; // u256 - amount as string (bigint)
}

// Claim for harvest/rewards
export interface Claim {
  id: string; // u64 - claim ID
  claimee: string; // ContractAddress - claimee address (matches ABI field name)
  amount: string; // u128 - claim amount as string (bigint)
}

// Swap route
export interface Route {
  token_from: string; // ContractAddress
  token_to: string; // ContractAddress
  exchange_address: string; // ContractAddress
  percent: string; // u128 - percentage as string (bigint)
  additional_swap_params: string[]; // Array<felt252>
}

// Avnu multi-route swap configuration
export interface AvnuMultiRouteSwap {
  token_from_address: string; // ContractAddress
  token_from_amount: string; // u256
  token_to_address: string; // ContractAddress
  token_to_amount: string; // u256
  token_to_min_amount: string; // u256
  beneficiary: string; // ContractAddress
  integrator_fee_amount_bps: string; // u128
  integrator_fee_recipient: string; // ContractAddress
  routes: Route[]; // Array<Route>
}

// Yield information from compute_yield
export interface YieldInfo {
  yield: string; // u256 - weighted average yield
  totalAmount: string; // u256 - total amount across pools
}

