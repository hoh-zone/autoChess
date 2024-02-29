export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0x43781cdf8ab80d27724041a8b34df02fbcdc5367bd180499408f61efaa086b4c"
export const ROLE_GLOBAL =  "0x692aea5cfaa32f7dcf3943a7038e1dfb6d13c4e6acdfa4dfff909f07c45e217c"
export const LINEUP_GLOBAL =  "0xd24a81cf3fc363a1d8b6ef2d10dc86181b882ea728025a53979514a212c39c26"
export const CHESS_GLOBAL =  "0xab2dae4e5e3106529b16f5f5a569a4e52ce86219fd9fa4b88171da65c21cdc9b"
export const CHALLENGE_GLOBAL = "0xdd72c66c042d13d6996398bfc4aba9a57ec5ae6f7d4fd46edda29a1f986a9bc7"







