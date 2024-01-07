"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENDER = exports.CHESS_GLOBAL = exports.LINEUP_GLOBAL = exports.ROLE_GLOBAL = exports.PACKAGE_ID = exports.ETHOS_COIN_TYPE = exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = exports.ETHOS_EXAMPLE_CONTRACT = exports.FAUCET = exports.NETWORK = void 0;
exports.NETWORK = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK);
exports.FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET;
exports.ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a";
exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55";
exports.ETHOS_COIN_TYPE = "".concat(exports.ETHOS_EXAMPLE_CONTRACT, "::ethos_example_coin::ETHOS_EXAMPLE_COIN");
// auto_chess_vars
exports.SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"
exports.PACKAGE_ID =  "0x779de068d3390df407bfba9b62ac6603cfc9e7fdec6e1e08db517243dc1573a5"
exports.ROLE_GLOBAL =  "0x6758d8ed77a521aaa966b035ff20af457a0ddad482535b0acdc6ec082e15ce28"
exports.LINEUP_GLOBAL =  "0xfb04bd82ac14884bef9050d95cf26ed8d7f8662c5d467d9d6893e483a617a992"
exports.CHESS_GLOBAL =  "0xa0312e3f0f7b3719292b49ff69310de0a33cc73a73eaf3eb6ca4e25ee26539a6"
exports.CHALLENGE_GLOBAL = "0x9671de523a9ee4ec843a17a5bc5f505a8e76d561e43ac12e747a1c7621b554f2"
