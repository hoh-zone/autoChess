export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const ISMAINNET = false
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const ROLE_PACKAGE_ID = "0xa426d13e718c4a3e5a40e0eef246d52f1f9dbc773bc352e13fbba68d901606f9"
export const LINEUP_PACKAGE_ID = "0x1a90b2b03d2fcc761854081cbb308793e5590f8847a720f1efd5c570521f928b"
export const CHESS_PACKAGE = "0x830c485a5963411f50ba3cb250556d4ef10dab5b09933a85bc5be31a429edae3"
export const CHALLANGE_PACKAGE = "0x2a94fe9ca377136a9a82407749aa5cb43cd0611319688a9d4ff6fa5cf1f953d1"
export const META_PACKAGE = ""

export const ROLE_GLOBAL = "0xa6eefebc7a19117fdbb0e2bc3183668163eae6860e31649523468e72ab9607a1"
export const LINEUP_GLOBAL = "0x0684a92833bb3c605a426d792ecc1904438b7bf6a5eda8153da779681096fa59"
export const CHESS_GLOBAL = "0xba55ed3eae9ba46e6b5952d0d5ae781eafa16e22a5a1979aa7ea01e7c8116c76"
export const CHALLENGE_GLOBAL = "0xbcbc4aa125cf26f0ed39a908b37fd9de4c4af4a70b02b2b923e23147fde18df0"
export const META_GLOBAL = ""
export const META_REWARDS_GLOBAL = ""
