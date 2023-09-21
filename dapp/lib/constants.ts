export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0x4b6c9abc265b538fe4eb8b01c00f43694babaea4fcd46ce46ae36cdaf043dc60"
export const ROLE_GLOBAL = "0x414511fd01f9ece59c77d6d676fd036bcd36bc95c7192ac93b5b9979a26538a8"
export const LINEUP_GLOBAL = "0x995da9149a70524a7a35c144b1bfc49a9f31025310db93ec3828303a0cccabbe"
export const CHESS_GLOBAL =  "0xea220459eb8e2b9b2eed0bf49bc8edbc3af12a12ed8844a9f8732cc2834ed5c6"
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"



