"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENDER = exports.CHESS_GLOBAL = exports.LINEUP_GLOBAL = exports.ROLE_GLOBAL = exports.PACKAGE_ID = exports.ETHOS_COIN_TYPE = exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = exports.ETHOS_EXAMPLE_CONTRACT = exports.FAUCET = exports.NETWORK = void 0;
exports.NETWORK = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK);
exports.FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET;
exports.ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a";
exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55";
exports.ETHOS_COIN_TYPE = "".concat(exports.ETHOS_EXAMPLE_CONTRACT, "::ethos_example_coin::ETHOS_EXAMPLE_COIN");
// auto_chess_vars
exports.PACKAGE_ID = "0x9b8c17229949099535a43d4a0d985f9e7c8b7ab7bf4292fe1ae1a3fba01b2e09";
exports.ROLE_GLOBAL = "0x7283308451ec81e33825c80f6a25aae91a8425ce38cb29e7d74c283f0dd6d944";
exports.LINEUP_GLOBAL = "0x877c1c0d95c4aa0f2db7f85aea8bbcba58c60cb2200b65977ad762bed44d87f8";
exports.CHESS_GLOBAL = "0x11fe73a036aa256d1846f3ad7d6b06c6aff461e1b992d2667a00a6b4ed3352e4";
exports.SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18";
