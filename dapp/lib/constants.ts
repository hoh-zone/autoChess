export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const ISMAINNET = false
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const ROLE_PACKAGE_ID = "0xa811b2ec66e2a0daddd76724ad73907ee92db44970ed917137009c7b21c26378"
export const LINEUP_PACKAGE_ID = "0x25b1ee25cb1070b4173cf81ce3bf1f3485d9852837455ee5d059c6ff451233af"
export const CHESS_CHALLENGE_PACKAGE = "0x0d7a78fcff5301bcc973092ca8334c9d2d7fe6e9cef3983f3b7d64340bfe722a"

export const ROLE_GLOBAL = "0x576934f28312e0e541fd7b0e4b20314bce3edfd79fe109d54d9520ea5ac9a915"
export const LINEUP_GLOBAL = "0x6d7c2c39130d83c0221fe77ba79ab7d52908459e9465519f7fe0445650c6d388"
export const CHESS_GLOBAL = "0x7e729f89367ffa5a6608778eea992e5cf38e884e1cce9eb857e926cf5236c5be"
export const CHALLENGE_GLOBAL = "0x58fb4de20b81b5263be39a44de3b873197f2e14ba702a40fc0a7c6e2a0efc1d3"
export const META_GLOBAL = "0xd711b31c6b263b0a1821dc751e33ee115e73a62f983d0fb9e9bf874c59f24f9d"
