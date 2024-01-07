export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0x4ac91ed67c310ab3757a84347cf8c7d87ea1e85b4c689516bc901ebe09f36052"
export const ROLE_GLOBAL =  "0xd129b7e31cfb15b6e3daac5751f62172cdf63e4e46b6f32aac24f3bf79b33c5b"
export const LINEUP_GLOBAL =  "0xf3c3d587978cdf2105ec1807bd4d8ed551cb3aac4d27523b523987525287bb60"
export const CHESS_GLOBAL =  "0xc096340e50cf8ef540b58e68f95754dce624ec38a545161124aa8d9c676f2f8f"
export const CHALLENGE_GLOBAL = "0xdc5fa8ad6cc089fc9fde21019101d18b3e23c5ec9997190d141df27413e67658"







