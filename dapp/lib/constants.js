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
exports.PACKAGE_ID =  "0x583e14062a58faf5be773df7a490d18b644387fae9a380be190ad98ad0c2e8ad"
exports.ROLE_GLOBAL =  "0xc9f7b7d585465ae0fc8834af083a6a5332ae98dfa04e1c2759bc60e86ffe9bfb"
exports.LINEUP_GLOBAL =  "0x80fb8907ab3f48ab03689adf018523944f98c8c0433c5b4eeb254ce39dc29fa8"
exports.CHESS_GLOBAL =  "0xa4990aa0997751c5299a773fdfff9e0f2a593bf6bf23ba6fb39c4798da3f177a"
exports.CHALLENGE_GLOBAL = "0xf39dea737a10599c5dab1dc24b6c7160afeb5e12d2b33f1d55e3d11a113a2657"