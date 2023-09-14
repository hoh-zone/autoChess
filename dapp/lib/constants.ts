export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0xb19e6e35b3b6c4cb2f5e48930960ec996af4e63d0a3a6835898ade72c6691ac4"
export const ROLE_GLOBAL = "0xe50a1d26810c0005be9f69723611820872ff1647b5a94889bc89455c4e34b45e"
export const LINEUP_GLOBAL = "0x2869bfd2d7bbfb5f85f6e918550ebe71fe5f1364ffcb6b1302f8e7ee883430d9"
export const CHESS_GLOBAL =  "0xd0820cef13723f7db46a62d6df6e2f1ba5e632ec65f515facd097659b0b84779"
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"




