"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.SENDER =
  exports.CHESS_GLOBAL =
  exports.LINEUP_GLOBAL =
  exports.ROLE_GLOBAL =
  exports.PACKAGE_ID =
  exports.ETHOS_COIN_TYPE =
  exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP =
  exports.ETHOS_EXAMPLE_CONTRACT =
  exports.FAUCET =
  exports.NETWORK =
    void 0
exports.NETWORK = process.env.NETWORK || process.env.NEXT_PUBLIC_NETWORK
exports.FAUCET = process.env.FAUCET || process.env.NEXT_PUBLIC_FAUCET
exports.ETHOS_EXAMPLE_CONTRACT = "0x77bec6ae4929a0d6e3c3a52ca78c9a1dfaed36ee150e8badb68a5c8d8580ac8a"
exports.ETHOS_EXAMPLE_COIN_TREASURY_CAP = "0xc4038ad78c21d473c946ca4c1b50eced5f11804dd70954d47d8b3332ef278b55"
exports.ETHOS_COIN_TYPE = "".concat(exports.ETHOS_EXAMPLE_CONTRACT, "::ethos_example_coin::ETHOS_EXAMPLE_COIN")

// v1.0版本包
exports.ISMAINNET = true
exports.SENDER = "0xb2a79beac8a092b336f560ba27f278382bcab2da831c64e546d7e0e087acc4fe"

exports.CHESS_PACKAGE = "0x8572ff8c709a3d28723b665ba6d35aacc0040486349285515521b63d18f770c1"
exports.CHALLENGE_PACKAGE = "0x403402d86e16ff3dc413de207ee246a2af8b01fe04ed04584d945457c0653041"
exports.ROLE_PACKAGE_ID = "0xab24d35c986902708f36fe77aed5647e3715307a32375aadda3c792378c08906"
exports.LINEUP_PACKAGE_ID = "0xc45255eabb91fbc3ce0617ce59128f0ef18539b7ea7768d6451fca646f3f7268"
exports.ITEM_PACKAGE_ID = "0x35d64a33293caff0697d14a38aeb373f9d725d6a542212e75e1091e71f5f5422"

exports.ROLE_GLOBAL = "0xe1aab5f4445e7efe771fb0edb338cd1249c6df5079c8bb571ce50004b3bba368"
exports.LINEUP_GLOBAL = "0x1072e36f9e4606d191211df0994bd95adacd7cd61b0b0dfd10cda3a181727846"
exports.CHESS_GLOBAL = "0x9e1983e489b0d02a931e714ca9195e36cdf1ba0c4c77eb517f893ad4f84815ba"
exports.CHALLENGE_GLOBAL = "0xaadfd12dfeaa829fb065cc2730c8d3b941e7b3ecc0e0e78a763434f4e4e452c8"
exports.META_INFO_GLOBAL = "0xb057160c6848ced6b5a8015335170f77b3600634758688b744fd9c83e2b6eda5"
exports.META_REWARDS_GLOBAL = "0x855ed0cc725e14e172d29bc9f0cc485d3988c845469a88a1d528379c733466fa"
exports.ITEM_GLOBAL = "0xfb9a6e64ff3741ec3dd11afee383d864b1c366b7cb023ca8f2a6235813114077"
