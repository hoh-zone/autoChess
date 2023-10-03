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
exports.PACKAGE_ID =  "0x4ab28a6102ae1321588bc308b97e7349f05d9c18d5750f84f576966058a56834",
exports.ROLE_GLOBAL =  "0xc799c866ce6148fcef5f366946c2458dccd77699006528c9fc057d1efc7b7087",
exports.LINEUP_GLOBAL =  "0x39988c824a9ec5dff8ca03d529bb33d6d09ac50b353320b2764c8d11474be045",
exports.CHESS_GLOBAL =  "0x8ed53e7d83737ad2829d1a42d642f2e33dbbfbaacd27c150725759ec7287e0e5"