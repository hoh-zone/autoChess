export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0x6c5fd3226af68f679dfaa00e56b81bd85c9813acf2c4645b5c4f6481c4e19e58"
export const ROLE_GLOBAL = "0x61fb559058338f9f5fdad8338ea7e97bd46ebc7a8828623bf9f621a09e4edb8f"
export const LINEUP_GLOBAL = "0x23939cca27350c2aecab83336f557cb74d9779df62ac359532e423b5249764a5"
export const CHESS_GLOBAL = "0x3b2e8a5b500bc5cd96a2a4c7a77518bed45c328107fe952afea11476c50c57ee"
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"