export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0xf5e0f3bfaea04cd751d2e0c22685e31587602f5e07f4214457cdbb9d0282965b"
export const ROLE_GLOBAL =  "0x76b5c453f8b99ab92699a7b2e858e7a24d96ecfd4f92e5887a93342c2006b8bd"
export const LINEUP_GLOBAL =  "0x58221b2b43fcd7876970aaf3829a614c2fafe4d368dc2de45ed84eda0d2fa6c6"
export const CHESS_GLOBAL =  "0xdee1ae408b31d3b48eb86c6401a8cfd10f1cd14a7ccff198615ac5ec97d6d667"