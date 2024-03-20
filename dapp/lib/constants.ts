export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const ISMAINNET = false
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const ROLE_PACKAGE_ID ="0xa95b96b87e6775411b9702b3f82426c7dd2f57900e1cf710afab30ed5e54a5d7"
export const LINEUP_PACKAGE_ID = "0xd4ac4db16620586df0aff093efd3aaa4c69794b65ff2284ad898d22dc9350f15"
export const CHESS_CHALLENGE_PACKAGE = "0x2bf0424851ef517e4c891ae023922daf5538554e7f334448e1a4db8ac2f28695"


export const ROLE_GLOBAL =  "0x2fa5e360f6a97548a504d70ddb7615ba69320e04a3b9d3ea5d92cedebe2db882"
export const LINEUP_GLOBAL =  "0x8b2aec0359b6ceb24fb6e5649ffb439f8598e8bb7739ac7535e6f60cd82641f9"
export const CHESS_GLOBAL =  "0x6cdfd07cbeaad301eaad2c12d772787fed0bea4f59088637bf5b39748f3613f2"
export const CHALLENGE_GLOBAL = "0x8e11aebf7c2705ae29f0ad2a014a26672a4f2fbd4d9bb561cd7931be7e807efd"
export const META_GLOBAL = "0x0cdd03561f92866943df770bad0a174bc90d19abbb6494df85ed9c3099b81c24"