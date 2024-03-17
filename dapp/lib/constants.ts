export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const ROLE_PACKAGE_ID ="0xd3cab2e96dfe5fa64f5d2738fac8f004406878ed04adc35bf76c979289c2ebe8"
export const LINEUP_PACKAGE_ID = "0x7af142ead12929375ed708a7ad61b4244f472f60f94e8907bd94cc48cf0a107c"
export const CHESS_CHALLENGE_PACKAGE = "0xc7a9498a073a3e75c45601ecf60c93d1855ab7cadca02c5339d0254a660065da"


export const ROLE_GLOBAL =  "0x3272b63d2905a7361f9a231b92bd3d46b6102d61ca1d712e9361e8f79966361a"
export const LINEUP_GLOBAL =  "0x342f791aec5728a9ee96583aaba483903dd03065244de201f99371d8b7bf10dc"
export const CHESS_GLOBAL =  "0x7a02878d52ea055c65b751b7c07c9431b94aacc10f7215bf31629d93cb3452f7"
export const CHALLENGE_GLOBAL = "0x2fdb4e142de57444da54ee80469f4a682157f7d7cb1df4451c08b8a9f9a0d81a"