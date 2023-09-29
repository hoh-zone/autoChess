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
exports.PACKAGE_ID =  "0xf3b173d3b68eeca25eae023f06db4ecf57dc04945e4d331140494b1a057029bb",
exports.ROLE_GLOBAL =  "0x60a53b6aed04a62201bb7fd25f7b682ea570298fdfca78a4fcb51f28b9535017",
exports.LINEUP_GLOBAL =  "0x1603d76bd594073ea6e95941502dd5caacb4d37a84dbbd1ef496ce6b56f678af",
exports.CHESS_GLOBAL =  "0xdab8ea3c483896c227ed8c95cbf4e7fff2e3ead5841fb7a379fcbe526a583a3d"