export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// v1.0版本包
export const ISMAINNET = true
export const SENDER = "0xb2a79beac8a092b336f560ba27f278382bcab2da831c64e546d7e0e087acc4fe"
export const ROLE_PACKAGE_ID = "0x4ef7d22f731621fcde258cc376f716127caf61d8dfa4c3fb96074643300097e9"
export const LINEUP_PACKAGE_ID = "0x82b36157bea705ea46329400615d2c4e3540e498643475d7c7fa7fe47a308deb"
export const CHESS_CHALLENGE_PACKAGE = "0x81028857c94206813c541ba305da607f1d7be2896392d9ea1e65f753e9e67687"
export const CHESS_CHALLENGE_PACKAGE2 = "0xeb7f5d6ee983ebed34f7f37c2c13e144baa2aea41db7a99fb7dc0865b7548fa4"
export const CHESS_CHALLENGE_PACKAGE1 = "0xf05d825505db7c2ade4beb1a6cc4581e2f5014f0099aeb5568994530822b4ab1"
export const CHESS_CHALLENGE_PACKAGE3 = "0xd4451a9a2cc0de9478e8b0f47ea6a52b6cabc33ed6dd1f2ff4fbea655043ccac"
export const CHESS_CHALLENGE_PACKAGE4 = "0x2430b9c0c106b7aa6689d581bf1c76bcb3b9baf9784c8e4a726440085f250268"
export const CHESS_CHALLENGE_PACKAGE5 = "0xc6771aebae85d27ea3176be5a31c0b15927e4c5efa0add413b6cbbe0730fbdeb"
export const CHESS_CHALLENGE_PACKAGE6 = "0xfc6685d0e80993537afebb3f1a535948603d3402b4e4712933d8088e51f06232"

export const ROLE_GLOBAL = "0xec6f4e9406f2eb59870dddff293aea330974c667646fedbda7e60ae80457a664"
export const LINEUP_GLOBAL = "0x488cf923eacf64b3358a95fd4ed310a1486c19245a0e23c64df412d60a50c0d9"
export const CHESS_GLOBAL = "0xd9068c52aee5e62829b1cb7643864a34f053846490a07ec150b66b4fd62db4cf"
export const CHALLENGE_GLOBAL = "0x1ad1735ca22bc791aef72b0fbc059702e2c46173c7f46da76f97dbb33dbc504a"
export const META_GLOBAL = "0x43968ab0be2fcfc2a2bd615892fb52c8267b5f2801cab4a638c842e06abde769"
export const META_REWARDS_GLOBAL = "0x9c15e42a730677f5d391f4ad72548d2d87261cbe19a1ee91b16101b4138d7954"

// v2.0版本包（速度版本）
export const CHESS_PACKAGE_V2 = "0xcd53b9b1f6bec17a3a2643eaf9bd60577e13341f4cfc50f029f3fe51bf493ade"
export const CHESS_PACKAGE_V2_2 = "0x09e7eb6201b69b5512d804c1938af02745690f156e0e45e3999ba3e1f0590804"
export const CHESS_GLOBAL_V2 = "0x7d7fde5e508631133d137a4b7227d4866979afdb312c482d260358633ad0b8bd"
export const METAINFO_GLOBAL_V2 = "0x7ba944b770472c8d73e56dbc992c399789b347c48d7ca332d47bd9f29c53db57"
export const META_REWARDS_GLOBAL_V2 = "0x7660d06ee3a9db7a40a75ce482be0f63666eccd48898d72964554dd9a22d168d"
export const ROLE_GLOBAL_V2 = "0x299f6a2c1f2aabf86ccffc39cda8a44c62779f0d154b521fc96a8b537367986b"
export const LINEUP_GLOBAL_V2 = "0xbb9e8f3807505c448f4bee455de66af2ef81747261239fa7174fec4c79894f0d"
export const CHALLENGE_GLOBAL_V2 = "0x38a6263ac807f60a2b017160bde8b346bdebf8dfc1a4f546165bd91b735c08f8"