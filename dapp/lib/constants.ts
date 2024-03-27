export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// auto_chess_vars
export const ISMAINNET = true
export const SENDER = "0xb2a79beac8a092b336f560ba27f278382bcab2da831c64e546d7e0e087acc4fe"
export const ROLE_PACKAGE_ID = "0x4ef7d22f731621fcde258cc376f716127caf61d8dfa4c3fb96074643300097e9"
export const LINEUP_PACKAGE_ID = "0x82b36157bea705ea46329400615d2c4e3540e498643475d7c7fa7fe47a308deb"
export const CHESS_CHALLENGE_PACKAGE = "0x81028857c94206813c541ba305da607f1d7be2896392d9ea1e65f753e9e67687"
export const CHESS_CHALLENGE_PACKAGE2 = "0xeb7f5d6ee983ebed34f7f37c2c13e144baa2aea41db7a99fb7dc0865b7548fa4"
export const CHESS_CHALLENGE_PACKAGE1 = "0xf05d825505db7c2ade4beb1a6cc4581e2f5014f0099aeb5568994530822b4ab1"

export const ROLE_GLOBAL = "0xec6f4e9406f2eb59870dddff293aea330974c667646fedbda7e60ae80457a664"
export const LINEUP_GLOBAL = "0x488cf923eacf64b3358a95fd4ed310a1486c19245a0e23c64df412d60a50c0d9"
export const CHESS_GLOBAL = "0xd9068c52aee5e62829b1cb7643864a34f053846490a07ec150b66b4fd62db4cf"
export const CHALLENGE_GLOBAL = "0x1ad1735ca22bc791aef72b0fbc059702e2c46173c7f46da76f97dbb33dbc504a"
export const META_GLOBAL = "0x43968ab0be2fcfc2a2bd615892fb52c8267b5f2801cab4a638c842e06abde769"
