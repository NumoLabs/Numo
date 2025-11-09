// Pragma price feed ABI - minimal view functions
export const PRAGMA_FEED_ABI = [
  {
    "name": "latest_round_data",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "round_id",
        "type": "core::integer::u256"
      },
      {
        "name": "answer",
        "type": "core::integer::u256"
      },
      {
        "name": "started_at",
        "type": "core::integer::u256"
      },
      {
        "name": "updated_at",
        "type": "core::integer::u256"
      },
      {
        "name": "answered_in_round",
        "type": "core::integer::u256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "get_round_data",
    "type": "function",
    "inputs": [
      {
        "name": "round_id",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "name": "round_id",
        "type": "core::integer::u256"
      },
      {
        "name": "answer",
        "type": "core::integer::u256"
      },
      {
        "name": "started_at",
        "type": "core::integer::u256"
      },
      {
        "name": "updated_at",
        "type": "core::integer::u256"
      },
      {
        "name": "answered_in_round",
        "type": "core::integer::u256"
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
    "name": "description",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "description",
        "type": "core::felt252"
      }
    ],
    "stateMutability": "view"
  }
] as const;
