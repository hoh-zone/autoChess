export const NETWORK: "devnet" | "testnet" | undefined = (process.env.NETWORK ||
  process.env.NEXT_PUBLIC_NETWORK) as "devnet" | "testnet" | undefined;
export const SENDER =
  "0xb2a79beac8a092b336f560ba27f278382bcab2da831c64e546d7e0e087acc4fe";
export const ISMAINNET = true;

export const ROLE_PACKAGE_ID =
  "0x386c8cd21b7ba319b8e18eedcb32b119ec966940236bab0e2e037806089568a9";
export const LINEUP_PACKAGE_ID =
  "0xa54718d01b0389f1d2cc05241efd0df098b4bf4ae4d26d3f306e0447da4ba87f";

export const CHESS_PACKAGE_ID =
  "0xcd53b9b1f6bec17a3a2643eaf9bd60577e13341f4cfc50f029f3fe51bf493ade";

export const CHALLENGE_PACKAGE_ID =
  "0x255cafab94384ff817450535c39d55c65007fcce9cbef1b1f53fec14f67f3dd4";

export const ROLE_GLOBAL =
  "0x299f6a2c1f2aabf86ccffc39cda8a44c62779f0d154b521fc96a8b537367986b";
export const LINEUP_GLOBAL =
  "0xbb9e8f3807505c448f4bee455de66af2ef81747261239fa7174fec4c79894f0d";
export const CHESS_GLOBAL =
  "0x7d7fde5e508631133d137a4b7227d4866979afdb312c482d260358633ad0b8bd";
export const CHALLENGE_GLOBAL =
  "0x38a6263ac807f60a2b017160bde8b346bdebf8dfc1a4f546165bd91b735c08f8";
