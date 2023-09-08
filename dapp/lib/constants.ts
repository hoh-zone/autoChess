export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0xc6efb7833ec6301d6e86b78b563591ea767e491e91c8749f59a600c0291cc37a"
export const ROLE_GLOBAL = "0xdc17c6ef788d539706b648bf416adcaf654263ab481be31fc01f24a355c83b02"
export const LINEUP_GLOBAL = "0x2426ceceff921e45eb63a5828ff770e4696ffb9392c8d906f2441411718c6265"
export const CHESS_GLOBAL = "0x8865df1dfe92c98ceaa1a0d92f53ee2e288e91080a160aba38a1527c12241f3c"