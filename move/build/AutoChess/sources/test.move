// Copyright 2023 ComingChat Authors. Licensed under Apache-2.0 License.
#[test_only]
module auto_chess::test {
    use std::string::{utf8, String};
    use sui::test_scenario::{
        Scenario, next_tx, begin, end, ctx, take_shared, return_shared, take_from_sender,return_to_sender,
        next_epoch
    };
    use std::vector;
    use std::debug::print;
    use auto_chess::chess;
    use auto_chess::role;
    use auto_chess::lineup;
    use auto_chess::utils;


    fun scenario(): Scenario { begin(@account) }

    #[test]
    fun test_play_chess() {
        let scenario = scenario();
        let test = &mut scenario;
        let admin = @account;

        next_tx(test, admin);
        {
            // init modules
            role::init_for_test(ctx(test));
            lineup::init_for_test(ctx(test));
            next_epoch(test, admin);

            let roleGlobal = take_shared<role::Global>(test);
            role::init_charactos1(&mut roleGlobal);
            role::init_charactos2(&mut roleGlobal);
            next_epoch(test, admin);

            let lineupGlobal = take_shared<lineup::Global>(test);
            lineup::init_lineup_pools(&mut lineupGlobal, &roleGlobal, ctx(test));
            return_shared(roleGlobal);
            return_shared(lineupGlobal);
            next_epoch(test, admin);

            chess::init_for_test(ctx(test));
            next_epoch(test, admin);

            let roleGlobal = take_shared<role::Global>(test);
            let chessGlobal = take_shared<chess::Global>(test);
            chess::mint_chess(&roleGlobal, &mut chessGlobal, utf8(b"sean"), ctx(test));
            next_epoch(test, admin);

            let chess_nft = take_from_sender<chess::Chess>(test);
            // print(&utf8(b"my lineup:"));
            // print(chess::get_lineup(&chess_nft));
            // print(&utf8(b"my card_pools:"));
            // print(chess::get_cards_pool(&chess_nft));
            let lineupGlobal = take_shared<lineup::Global>(test);
            let gold = 3;
            let str_vec = vector::empty<String>();
            vector::push_back(&mut str_vec, utf8(b"priest1"));
            vector::push_back(&mut str_vec, utf8(b"priest1"));
            vector::push_back(&mut str_vec, utf8(b"priest1"));
            print(&utf8(b"operate my chess"));
            chess::operate_and_match(&mut chessGlobal, &roleGlobal, &lineupGlobal, gold, str_vec, &mut chess_nft, ctx(test));
            print_my_lineup(&chess_nft);
            next_epoch(test, admin);

            // // second round
            // let str_vec = vector::empty<String>();
            // vector::push_back(&mut str_vec, utf8(b"mega1"));
            // vector::push_back(&mut str_vec, utf8(b"mega1_1"));
            // print(&utf8(b"operate my chess"));
            // chess::operate_and_match(&mut chessGlobal, &roleGlobal, &lineupGlobal, 1, str_vec, &mut chess_nft, ctx(test));

            // next_epoch(test, admin);

            // print(&chess_nft);
            // utils::print2(utf8(b"total_matches:"), utils::u64_to_string(chess::get_total_matches(&chessGlobal)));
            return_to_sender(test, chess_nft);
            return_shared(chessGlobal);
            return_shared(roleGlobal);
            return_shared(lineupGlobal);
        };
        end(scenario);
    }

    fun print_my_lineup (chess: &chess::Chess) {
        print(&utf8(b"my card pools:"));
        print(chess::get_lineup(chess));
    }

    fun print_my_cards_pool (chess: &chess::Chess) {
        print(&utf8(b"my card pools:"));
        print(chess::get_cards_pool(chess));
    }
}