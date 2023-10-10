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
    fun test_virtual_fight() {
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
            role::init_charactors1(&mut roleGlobal);
            role::init_charactors2(&mut roleGlobal);
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
            let lineupGlobal = take_shared<lineup::Global>(test);

            // priest1:10:3' (namex_y:attack:life)
            let lineup1_str_vec = vector::empty<String>();
            vector::push_back(&mut lineup1_str_vec, utf8(b"fighter2:12:12"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"fighter2:12:12"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"wizard2_1:10:12"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"wizard1:5:6"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"wizard1:5:6"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"fighter1:4:6"));

            let lineup2_str_vec = vector::empty<String>();
            vector::push_back(&mut lineup2_str_vec, utf8(b"shinobi3:16:40"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"kunoichi2_1:12:12"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"kunoichi1_1:6:6"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"priest1:3:8"));
            vector::push_back(&mut lineup2_str_vec, utf8(b""));
            vector::push_back(&mut lineup2_str_vec, utf8(b"slime2:10:20"));


            let my_lineup = lineup::parse_lineup_str_vec(utf8(b"1"), &roleGlobal, lineup1_str_vec, ctx(test));
            let enemy_lineup = lineup::parse_lineup_str_vec(utf8(b"2"), &roleGlobal, lineup2_str_vec, ctx(test));
            let res = chess::test_fight(my_lineup, enemy_lineup);

            return_shared(chessGlobal);
            return_shared(roleGlobal);
            return_shared(lineupGlobal);
        };
        end(scenario);
        
    }

    //sui move test test_operate_and_play --skip-fetch-latest-git-deps
    // #[test]
    fun test_operate_and_play() {
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
            role::init_charactors1(&mut roleGlobal);
            role::init_charactors2(&mut roleGlobal);
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
            let lineupGlobal = take_shared<lineup::Global>(test);
            
            print_my_cards_pool(&chess_nft);

            let operations = vector::empty<String>();

            // buy operation
            vector::push_back(&mut operations, utf8(b"refresh"));
            vector::push_back(&mut operations, utf8(b"buy:3-0"));
            vector::push_back(&mut operations, utf8(b"buy:4-1"));
            // vector::push_back(&mut operations, utf8(b"buy:1-1"));
            // vector::push_back(&mut operations, utf8(b"buy:2-2"));
            // vector::push_back(&mut operations, utf8(b"refresh"));
            // vector::push_back(&mut operations, utf8(b"upgrade:0-1"));

            // swap operation
            // vector::push_back(&mut operations, utf8(b"swap:0-1"));
            // vector::push_back(&mut operations, utf8(b"swap:1-3"));

            // sell operation
            // vector::push_back(&mut operations, utf8(b"sell:5"));

            // refresh operation
            // vector::push_back(&mut operations, utf8(b"refresh"));
            
            // upgrade operation
            // vector::push_back(&mut operations, utf8(b"upgrad:3-1"));

            let left_gold = 2;
            let lineup_str_vec = vector::empty<String>();
            vector::push_back(&mut lineup_str_vec, utf8(b"priest1:3:8"));
            vector::push_back(&mut lineup_str_vec, utf8(b"tree1:5:7"));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            print(&utf8(b"operate my chess"));

            chess::operate_and_match(&mut chessGlobal, &roleGlobal, &mut lineupGlobal, &mut chess_nft, operations, left_gold, lineup_str_vec, ctx(test));
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
        print(&utf8(b"my lineup:"));
        print(chess::get_lineup(chess));
    }

    fun print_my_cards_pool (chess: &chess::Chess) {
        print(&utf8(b"my card pools:"));
        print(chess::get_cards_pool(chess));
    }
}