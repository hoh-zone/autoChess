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
exports.PACKAGE_ID =  "0x7da94d6d94188d84ef88956850216609c458e38a6e843459b64426d19282ba82";
exports.ROLE_GLOBAL =  "0xe077394bac29e16aa177631889ec3f33a6b61fb84c9a2ad29894da604c18c154";
exports.LINEUP_GLOBAL =  "0xb460b3aea5aed268fc9537713b8db9107444663a4be3806e7d461a534bcc5b47";
exports.CHESS_GLOBAL =  "0xfaeb38ad676ccca098b1cd381ba0684d2788d8b89db899966ecaad30b80e5225";
exports.CHALLENGE_GLOBAL = "0x4937375fba9de57a13658118cc932ac2e25b12aa172af34232f7730b81bc670b";