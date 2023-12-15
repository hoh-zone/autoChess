export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0x6a722cb86e93190276339881f3ed2e4039aacb109d64f6d559d25d13bca3ffe0"
export const ROLE_GLOBAL =  "0x8d85bd4445e75c27e9c65449b52d67fc2b95efb965bf79beecfbb07243376e30"
export const LINEUP_GLOBAL =  "0x004475d1f0bbe4ac6b31494a9bca80fefced4c4cd151dcaee275320aba769569"
export const CHESS_GLOBAL =  "0x8131c002636334b664f38810beb87bbf05824470e851553a552114e07f4ee673"
export const CHALLENGE_GLOBAL = "0x4657e7075de4da0b2552991cc6b313053ac60041d9a445e3a7e718916b4ad1ce"






