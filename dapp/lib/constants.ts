export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0x4e179ab30c192809c8afe182f1be51a4e9c6638d878ff48559351171d2e1439d"
export const ROLE_GLOBAL =  "0xb75cb496a7aea145164ebcc3d52e57f568de929728c0de1f62f70c2c52167534"
export const LINEUP_GLOBAL =  "0x3adccfb3aef2afb2af03f40f08a49139a42b2db2e3f079d33b9d9d0f8c9e9eda"
export const CHESS_GLOBAL =  "0x579058dede7503d327e5092b18da60a2c898630e7339ec605b5e21587316b828"
export const CHALLENGE_GLOBAL = "0xe1ce8042b2a8c266207fb3c5e78c18a357768e54a24587c89c4117685e2ebb4d"