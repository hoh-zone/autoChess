export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0x13dd2ede98d7c69a7b1fd0380a87815409ecb474d6591a23b60ebae8a892c5f6"
export const ROLE_GLOBAL = "0xb52406e4746a380ca68fe3750cdae208ee641a9c98ba977b4975797921e85e01"
export const LINEUP_GLOBAL = "0x8af0b578c6448f7419255848355e6785893b84f9e6de65c5876d6e9a48ec40ad"
export const CHESS_GLOBAL =  "0x7de2594ef50e844db8e0865061524a3607be0a35d7cc16f1e18845c17798cc7a"
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"




