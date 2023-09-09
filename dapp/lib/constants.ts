export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08"
export const ROLE_GLOBAL = "0xa71c3603cd6ab083da2b6cff2138cce660f27c644aa2018a4658edfc627c0cb9"
export const LINEUP_GLOBAL = "0xe99af06077de34950749e897fdba17aa712abf8ebf4954fc91cf36af2e6028e4"
export const CHESS_GLOBAL = "0x41e01bdcb4a156f1b3dbf298b8ba7d94d18ddead3bf3b4996d3a3765855bb5b4"