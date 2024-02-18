// Copyright 2023 ComingChat Authors. Licensed under Apache-2.0 License.
#[test_only]
module auto_chess::test {
    use std::string::{utf8, String};
    use sui::clock::{Self};
    use sui::test_scenario::{
        Scenario, next_tx, begin, end, ctx, take_shared, return_shared, take_from_sender,return_to_sender,
        next_epoch
    };
    use std::vector;
    use std::debug::print;
    use auto_chess::chess;
    use auto_chess::role;
    use auto_chess::lineup;
    use auto_chess::challenge;

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
            // 
            let lineup1_str_vec = vector::empty<String>();
            vector::push_back(&mut lineup1_str_vec, utf8(b""));
            vector::push_back(&mut lineup1_str_vec, utf8(b"golem2-3:8:16"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"golem2-3:8:16"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"ani2-3:8:16"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"firemega1-1:6:5"));
            vector::push_back(&mut lineup1_str_vec, utf8(b"firemega1-1:6:5"));

            let lineup2_str_vec = vector::empty<String>();
            vector::push_back(&mut lineup2_str_vec, utf8(b"priest2-3:6:16"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"mega2-3:8:22"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"priest1_1-2:3:8"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"mega1-1:4:7"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"mega1-1:4:7"));
            vector::push_back(&mut lineup2_str_vec, utf8(b"slime1-1:6:6"));

            let my_lineup = lineup::parse_lineup_str_vec(utf8(b"1"), &roleGlobal, lineup1_str_vec, 0, ctx(test));
            let enemy_lineup = lineup::parse_lineup_str_vec(utf8(b"2"), &roleGlobal, lineup2_str_vec, 0, ctx(test));
            // chess::test_fight(my_lineup, enemy_lineup);
            return_shared(chessGlobal);
            return_shared(roleGlobal);
            return_shared(lineupGlobal);
        };
        end(scenario);
    }

    //sui move test test_operate_and_play --skip-fetch-latest-git-deps
    #[test]
    fun test_operate_and_play() {
        let scenario = scenario();
        let test = &mut scenario;
        let admin = @account;
        let clock = clock::create_for_testing(ctx(test));

        next_tx(test, admin);
        {
            // init modules
            role::init_for_test(ctx(test));
            lineup::init_for_test(ctx(test));
            challenge::init_for_test(ctx(test));
            next_epoch(test, admin);

            let roleGlobal = take_shared<role::Global>(test);
            role::init_charactors1(&mut roleGlobal);
            role::init_charactors2(&mut roleGlobal);
            next_epoch(test, admin);

            let lineupGlobal = take_shared<lineup::Global>(test);
            lineup::init_lineup_pools(&mut lineupGlobal, &roleGlobal, ctx(test));
            next_epoch(test, admin);
            
            let challengeGlobal = take_shared<challenge::Global>(test);
            challenge::init_rank_20(&mut challengeGlobal, &roleGlobal, &clock, ctx(test));
            print(&challenge::query_rank_20(&challengeGlobal));
            next_epoch(test, admin);

            return_shared(roleGlobal);
            return_shared(lineupGlobal);

            chess::init_for_test(ctx(test));
            next_epoch(test, admin);

            let roleGlobal = take_shared<role::Global>(test);
            let chessGlobal = take_shared<chess::Global>(test);
            chess::mint_chess(&roleGlobal, &mut chessGlobal, utf8(b"sean"), ctx(test));
            next_epoch(test, admin);

            let chess_nft = take_from_sender<chess::Chess>(test);
            let lineupGlobal = take_shared<lineup::Global>(test);
            
            print_my_cards_pool(&chess_nft);
            // fighter1,cler1,firemega1,ani1,tank1, mega1, tank2

            let operations = vector::empty<String>();

            // buy operation
            vector::push_back(&mut operations, utf8(b"buy"));
            vector::push_back(&mut operations, utf8(b"0-0"));
            // vector::push_back(&mut operations, utf8(b"refresh"));
            // vector::push_back(&mut operations, utf8(b"buy:4-1"));
            // vector::push_back(&mut operations, utf8(b"buy:1-1"));
            // vector::push_back(&mut operations, utf8(b"buy:2-2"));
            // vector::push_back(&mut operations, utf8(b"refresh"));
            // swap operation
            // vector::push_back(&mut operations, utf8(b"swap:0-1"));
            // vector::push_back(&mut operations, utf8(b"swap:1-3"));

            // sell operation
            // vector::push_back(&mut operations, utf8(b"sell:5"));

            // refresh operation
            // vector::push_back(&mut operations, utf8(b"refresh"));
            
            // upgrade operation
            // vector::push_back(&mut operations, utf8(b"upgrad:3-1"));

            let left_gold = 7;
            let lineup_str_vec = vector::empty<String>();
            vector::push_back(&mut lineup_str_vec, utf8(b"tank1-1:3:12"));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            vector::push_back(&mut lineup_str_vec, utf8(b""));
            print(&utf8(b"operate my chess"));
            chess::operate_and_match(&mut chessGlobal, &roleGlobal, &mut lineupGlobal, &mut challengeGlobal, &mut chess_nft, operations, left_gold, lineup_str_vec, ctx(test));
            print_my_lineup(&chess_nft);
            next_epoch(test, admin);
            return_to_sender(test, chess_nft);
            return_shared(chessGlobal);
            return_shared(roleGlobal);
            return_shared(lineupGlobal);
            return_shared(challengeGlobal);
            clock::destroy_for_testing(clock);
        };
        end(scenario);
    }

    #[test_only]
    fun print_my_lineup (chess: &chess::Chess) {
        print(&utf8(b"my lineup:"));
        print(chess::get_lineup(chess));
    }

    #[test_only]
    fun print_my_cards_pool (chess: &chess::Chess) {
        print(&utf8(b"my card pools:"));
        print(chess::get_cards_pool(chess));
    }
}