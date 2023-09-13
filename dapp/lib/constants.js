"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENDER = exports.CHESS_GLOBAL = exports.LINEUP_GLOBAL = exports.ROLE_GLOBAL = exports.PACKAGE_ID = exports.ETHOS_COIN_TYPE = exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = exports.ETHOS_EXAMPLE_CONTRACT = exports.FAUCET = exports.NETWORK = void 0;
exports.NETWORK = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK);
exports.FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET;
exports.ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a";
exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55";
exports.ETHOS_COIN_TYPE = "".concat(exports.ETHOS_EXAMPLE_CONTRACT, "::ethos_example_coin::ETHOS_EXAMPLE_COIN");
// auto_chess_vars
exports.SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18";
exports.PACKAGE_ID = "0x82fabf32a3e5d7cb38e28ab0034703f0a79156d607ebb75c8d4640d14c3f3fbd";
exports.ROLE_GLOBAL = "0x55ba3c45004d7a799a5c6ec7149e50c4eb585303586c8d5bd9270eb93d813d7d";
exports.LINEUP_GLOBAL = "0x2d876ee8ffb39723e9b325ddc46e28f63eb419872810a0ea8014d6ce9d8a7dd3";
exports.CHESS_GLOBAL = "0xe11615c6058bab103a3ec7dd078638907dcb30627545b64aa40e8382d5cdba82";
