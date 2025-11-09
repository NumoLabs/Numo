// Vault contract ABI - minimal view functions
// This ABI contains only the view functions that might be available
// If a function doesn't exist on the actual contract, it will be handled gracefully
export const VAULT_VIEWS_ABI = [
  {
    "name": "totalAssets",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "total",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "totalAssetsUsd",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "total",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "asset",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "asset_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "underlying",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "underlying_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "decimals",
        "type": "core::integer::u8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "pricePerShare",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "price",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "lastRebalance",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "timestamp",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "rebalanceInterval",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "interval",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getPositions",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "positions",
        "type": "core::array::Array::<core::tuple::(core::starknet::contract_address::ContractAddress, core::integer::u256)>"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getWeights",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "weights",
        "type": "core::array::Array::<core::integer::u256>"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "managementFee",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "fee",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "performanceFee",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "fee",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  }
] as const;
