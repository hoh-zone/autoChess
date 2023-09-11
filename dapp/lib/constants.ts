export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0x0e879b8c29370900d422d463f160686fb8325c5b84a763b2c132a137de3b2733"
export const ROLE_GLOBAL = "0xf677db298b52cccd789deaabf1759309b18bf7f8a441a4ca7ced6857da66d3ac"
export const LINEUP_GLOBAL = "0xc193c4285b359be0952b2b3ba27f212b219be1d5fb24dd7923b56867c4f61ec6"
export const CHESS_GLOBAL = "0x0e68018be6f94665b8574320db0d289f3436842f255800716ac3312925194589"