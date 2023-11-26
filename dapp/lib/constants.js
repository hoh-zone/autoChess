"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENDER = exports.CHESS_GLOBAL = exports.LINEUP_GLOBAL = exports.ROLE_GLOBAL = exports.PACKAGE_ID = exports.ETHOS_COIN_TYPE = exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = exports.ETHOS_EXAMPLE_CONTRACT = exports.FAUCET = exports.NETWORK = void 0;
exports.NETWORK = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK);
exports.FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET;
exports.ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a";
exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55";
exports.ETHOS_COIN_TYPE = "".concat(exports.ETHOS_EXAMPLE_CONTRACT, "::ethos_example_coin::ETHOS_EXAMPLE_COIN");
// auto_chess_vars
exports.SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18",
exports.PACKAGE_ID =  "0x4e179ab30c192809c8afe182f1be51a4e9c6638d878ff48559351171d2e1439d",
exports.ROLE_GLOBAL =  "0xb75cb496a7aea145164ebcc3d52e57f568de929728c0de1f62f70c2c52167534",
exports.LINEUP_GLOBAL =  "0x3adccfb3aef2afb2af03f40f08a49139a42b2db2e3f079d33b9d9d0f8c9e9eda",
exports.CHESS_GLOBAL =  "0x579058dede7503d327e5092b18da60a2c898630e7339ec605b5e21587316b828",
exports.CHALLENGE_GLOBAL = "0xe1ce8042b2a8c266207fb3c5e78c18a357768e54a24587c89c4117685e2ebb4d"