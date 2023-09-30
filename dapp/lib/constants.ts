export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0x4ca40c51e83e0d78de45ed04fb4cad2994117677bba79f81b743b4b1e9148984"
export const ROLE_GLOBAL =  "0x273acc79250918b1c8356966886871dca90cf90ffc40161747d58fc8618197cf"
export const LINEUP_GLOBAL =  "0xa68be53da56b2196c393c7b480133121bed9f14e79d7c108991e385af86cc152"
export const CHESS_GLOBAL =  "0xb55cde68fd37ca47035b889dc2daf47a8dd6e0e9e426885256291cfb7f9b9ced"