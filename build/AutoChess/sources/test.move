// Copyright 2023 ComingChat Authors. Licensed under Apache-2.0 License.
#[test_only]
module auto_chess::test {
    use std::vector;
    use std::string::{utf8};
    use std::debug::print;
    use sui::test_scenario::{
        Scenario, next_tx, begin, end, ctx, take_shared, return_shared, take_from_sender,return_to_sender,take_from_address,
        next_epoch
    };
    use sui::tx_context::{TxContext};
    use sui::object::{Self};
    use auto_chess::chess;

    fun scenario(): Scenario { begin(@account) }

    fun init_module(ctx: &mut TxContext) {
        chess::init_for_test(ctx);
    }

    #[test]
    fun test_play_chess() {
        let scenario = scenario();
        let test = &mut scenario;
        let admin = @account;

        next_tx(test, admin);
        {
            init_module(ctx(test));
            next_epoch(test, admin);

            let chessGlobal = take_shared<chess::Global>(test);
            chess::mint_chess(&mut chessGlobal, ctx(test));
            print(&utf8(b"total_chesses:"));
            print(&chess::get_total_chesses(&chessGlobal));
            next_epoch(test, admin);

            let chess_nft = take_from_sender<chess::Chess>(test);
            chess::match(&mut chessGlobal, &mut chess_nft, ctx(test));
            print(&utf8(b"total_matches:"));
            print(&chess::get_total_matches(&chessGlobal));
            return_to_sender(test, chess_nft);
            return_shared(chessGlobal);
        };
        end(scenario);
    }
}