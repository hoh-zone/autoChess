export const NETWORK: 'devnet' | 'testnet' | undefined = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK) as ('devnet' | 'testnet' | undefined)
export const FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
export const ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
export const ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
export const ETHOS_COIN_TYPE = `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::ETHOS_EXAMPLE_COIN`

// v3.0版本包
export const ISMAINNET = true
export const SENDER = "0xb2a79beac8a092b336f560ba27f278382bcab2da831c64e546d7e0e087acc4fe"

export const CHESS_PACKAGE = "0x0746423a750af6faaa93c7f12e2820d7a0c284859f44fee9a94756fd43671253"
export const CHALLENGE_PACKAGE = "0xc882cb8808dc7fc6a0713f5caccbbc75478c7c4b8ac5e10bec1574dde6c07e38"
export const ROLE_PACKAGE_ID = "0xf414aef464471ff6b58c2297351455bb6c16986a8fb277f6ebe5dfb44daeacc2"
export const LINEUP_PACKAGE_ID = "0x1eae700ac761695a775ef83e5ab18d260ab279075ba4915857ea2687710838ff"
export const ITEM_PACKAGE_ID = "0x23fec4ac6238fe1bec69689ce93508cc7d80705e3ba786da72a10cef3b51671e"

export const ROLE_GLOBAL = "0x24f3a1d28cfb5e4540f4b3a66b8578d65363a110985e866648f5f153ac689cba"
export const LINEUP_GLOBAL = "0xe10c2b2c44d146daeee239639b40a6007adad85f1cf7ce8886da7e15380e79f5"
export const CHESS_GLOBAL = "0xcaa91594f5b9fd2ed1487374e6ee3a6e08a42d69c8857e2e52130450883d385b"
export const CHALLENGE_GLOBAL = "0x5579545f2e2562b389762be64e593fdf094206f3b1085045011a5df1af1f10f7"
export const META_INFO_GLOBAL = "0x5c9604847e6eddb52ff906618a335a08a2a8723a6b1c5f0ff0b88904a67464a6"
export const META_REWARDS_GLOBAL = "0x689340890f203d907e6845bc99ecdef5d9fdae853de17c8c88fb10f6b5df66be"
export const ITEM_GLOBAL = "0x57970fa6f8103d525f6d1fffb0e70356272fc808bf7eeb0147e8851e7a5c2a51"
