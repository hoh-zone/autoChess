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
exports.PACKAGE_ID =  "0x6a722cb86e93190276339881f3ed2e4039aacb109d64f6d559d25d13bca3ffe0",
exports.ROLE_GLOBAL =  "0x8d85bd4445e75c27e9c65449b52d67fc2b95efb965bf79beecfbb07243376e30",
exports.LINEUP_GLOBAL =  "0x004475d1f0bbe4ac6b31494a9bca80fefced4c4cd151dcaee275320aba769569",
exports.CHESS_GLOBAL =  "0x8131c002636334b664f38810beb87bbf05824470e851553a552114e07f4ee673",
exports.CHALLENGE_GLOBAL = "0x4657e7075de4da0b2552991cc6b313053ac60041d9a445e3a7e718916b4ad1ce"
