export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const ROLE_PACKAGE_ID ="0x1c69f07380653053fcc86e2677b74845fa37478fe6a80b56a80dc19f38c13af2"
export const LINEUP_PACKAGE_ID = "0x0a17a2364118a774e140b522f6c9c6bbceb90daadced455a5111b77046ac4688"
export const CHESS_PACKAGE_ID = "0x414579c433a436024e10785daf8ed58b2a3469de39d36a635912a1c9579f8ea3"
export const CHALLENGE_PACKAGE_ID = "0x8c6a7073a82504ee4e011a0c1f35ba50417ea1a596bac140652a5f023632a33e"


export const ROLE_GLOBAL =  "0x5bbce40846c0e21bf265219697d071b14ab2083234168c7c581cce8ac5cb653b"
export const LINEUP_GLOBAL =  "0x857f0e48d2045f5d6bcc13c41ddb68b473d2a6915386ff0557e75374b058bfce"
export const CHESS_GLOBAL =  "0x409245609a9b44ced22d3709c1193e0333b817344bff01fc56768b5a47e000f0"
export const CHALLENGE_GLOBAL = "0xd27d3119d747b3f89e65dba22849f676b774f7da80bad1c4fafd9f29dbc4305b"







