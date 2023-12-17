export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)

export const SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
export const PACKAGE_ID =  "0xe10b2f7cfd2c03c1ed6f4c19f9b7ec582ca0cba34d6f83105514c9888237535b"
export const ROLE_GLOBAL =  "0x76213acc15c9982dc54754faa43fa4241a7a9e03ad7bff3446d1e771e1f83e54"
export const LINEUP_GLOBAL =  "0x596cdfd1ca218680fb2e0ae53b8336df60188e9cdbd50c8a2f23791b4bce0668"
export const CHESS_GLOBAL =  "0xe2a2e1e9b44b1d53d96e3e4534caca35b397b8b7bf9239547679ed02ca98c3c3"
export const CHALLENGE_GLOBAL = "0xedd8a7ca00651340d7b1b8a0997b735238f6cc2f494e18e96079568d6d32f6a6"