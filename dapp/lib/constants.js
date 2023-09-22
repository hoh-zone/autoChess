"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENDER = exports.CHESS_GLOBAL = exports.LINEUP_GLOBAL = exports.ROLE_GLOBAL = exports.PACKAGE_ID = exports.ETHOS_COIN_TYPE = exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = exports.ETHOS_EXAMPLE_CONTRACT = exports.FAUCET = exports.NETWORK = void 0;
exports.NETWORK = (process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK);
exports.FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET;
exports.ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a";
exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55";
exports.ETHOS_COIN_TYPE = "".concat(exports.ETHOS_EXAMPLE_CONTRACT, "::ethos_example_coin::ETHOS_EXAMPLE_COIN");
// auto_chess_vars
exports.PACKAGE_ID = "0xbec3218fc79bfe61f0669e332f8fbca039e58d8d8b7b56b94d2f19be9010a5b3"
exports.ROLE_GLOBAL = "0x01b5ae5d3ba64d83943f73ec4a438053be8d63a6b8e1c75252be0820925c87ea"
exports.LINEUP_GLOBAL = "0x4c7273301b75108627803c3ee36fada71eaec03add86929a04c0cc4c3492a610"
exports.CHESS_GLOBAL =  "0x20d5c1b82ec26ca2a3ffd425434b2850d5a443fd24936d49e39431ef05e53d62"
exports.SENDER = "0xbe379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18"