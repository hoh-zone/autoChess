export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const PACKAGE_ID = "0x985c7213dcf110e0d6e5f501e1af4680db5837c9aa3e3d7cebc6facc695700ef"
export const ROLE_GLOBAL = "0xc753f0e3aa758f47817ad2af70a425a4f0d25b352cbabcc99fa7b6f4aac6beb0"
export const LINEUP_GLOBAL = "0x9b7b357c1f1a1ba902599ab67ab0d69ca4d016e8b7ad88994871be1a319be9a0"
export const CHESS_GLOBAL = "0x424aa8ddf27f67715313115f8df9004d7ffa0af25d586dd6f4695923c93361f7"