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
exports.PACKAGE_ID =  "0xe10b2f7cfd2c03c1ed6f4c19f9b7ec582ca0cba34d6f83105514c9888237535b"
exports.ROLE_GLOBAL =  "0x76213acc15c9982dc54754faa43fa4241a7a9e03ad7bff3446d1e771e1f83e54"
exports.LINEUP_GLOBAL =  "0x596cdfd1ca218680fb2e0ae53b8336df60188e9cdbd50c8a2f23791b4bce0668"
exports.CHESS_GLOBAL =  "0xe2a2e1e9b44b1d53d96e3e4534caca35b397b8b7bf9239547679ed02ca98c3c3"
exports.CHALLENGE_GLOBAL = "0xedd8a7ca00651340d7b1b8a0997b735238f6cc2f494e18e96079568d6d32f6a6"