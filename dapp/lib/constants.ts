export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0xe34b4a03455dbfe6506c3d4ea94d476e148d4a06e6757175babe68019642031c"
export const ROLE_GLOBAL =  "0x92ef16a3add26eb35d4394953f2e50165e059a2c8e139c9b4a1bfc18b014ace6"
export const LINEUP_GLOBAL =  "0xc020c52e3277cd4c547c09c8d89d822fd77da50a476b17f664a7c7fd78e8f8b3"
export const CHESS_GLOBAL =  "0xcb706f41c1bae2aba0ff264e896c71365fd708012ef4f6d44fce43570a1ff13e"