// this module is used for the challenge mode, every player who has won more than 10 chesses can attend the challenge mode to win more sui
// every season we extract partial sui from our reward pool for the first 20 players in the challenge mode.
// you can review your rank in web : https://home.autochess.app/
module challenge_package::challenge {
    use std::string::{utf8, String, Self};
    use std::vector;
    use std::ascii;
    use std::debug::print;

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};  
    use sui::balance::{Self, Balance};
    use sui::coin::{Self};
    use sui::clock::{Self, Clock};
    use sui::address;  
    use sui::sui::SUI;

    use role_package::role;
    use lineup_package::lineup::{Self, LineUp};
    use util_package::utils;

    const ERR_CHALLENGE_NOT_END:u64 = 0x01;
    const ERR_NO_PERMISSION:u64 = 0x02;
    const DAY_IN_MS: u64 = 86_400_000;
    const ERR_REWARD_HAS_BEEN_LOCKED: u64 = 0x03;
    const ERR_ALREADY_INIT: u64 = 0x04;
    const ERR_EXCEED_VEC_LENGTH: u64 = 0x05;
    const CURRENT_VERSION: u64 = 1;

    // challenge admin, keeps the uptodate data with time stamp, updated every season (14-30 days)
    // rank_20 is the first 20 players identified by the lineup (when is it generated: mannually initiallized in ts script)
    // reward_20 is the rewarding SUI for the top 20 players in rank20 (where is the generation: in chess::lock_reward)
    // balance_SUI records the balance of SUI in the rewards pool
    struct Global has key {
        id: UID,
        balance_SUI: Balance<SUI>,
        rank_20: vector<LineUp>,
        reward_20: vector<u64>,
        publish_time: u64,
        lock:bool,
        version: u64,
        manager: address
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            balance_SUI: balance::zero(),
            rank_20: vector::empty<LineUp>(),
            reward_20: vector::empty<u64>(),
            publish_time: 0,
            lock: false,
            version: CURRENT_VERSION,
            manager: @manager
        };
        transfer::share_object(global);
    }

    //problem::::::::not rank but index passed in
    public fun get_lineup_by_rank(global: &Global, rank:u8): &LineUp {
        assert!(vector::length(&global.rank_20) >= (rank as u64), ERR_EXCEED_VEC_LENGTH);
        vector::borrow(&global.rank_20, (rank as u64)-1)
    }

    // when the player wins, swap the ranking of the player with the previous one who was 1 rank ahead
    //problem........what about the lineup being replaced?
    //???????????
    public fun rank_forward(global: &mut Global, lineup:LineUp) {
        assert!(!global.lock, ERR_REWARD_HAS_BEEN_LOCKED);
        let previous_rank = find_rank(global, &lineup);
        print(&previous_rank);

        // if the player was not in the top 20, it is now 20th
        if (previous_rank == 21) {
            vector::pop_back(&mut global.rank_20);
            vector::push_back(&mut global.rank_20, lineup);
        } else if (previous_rank > 1) {
            // 15(rank = 15) -> 14(index = 13)
            //previous team 14 -> 15
            //The lineup kept in the global does not have the updated stats, so has to be replaced by the passed in lineup
            let previous_index = previous_rank - 1;
            vector::remove(&mut global.rank_20, previous_index);   
            vector::insert(&mut global.rank_20, lineup, (previous_index - 1));
            //lineup::print_lineup(vector::borrow(&global.rank_20, 8));
        } 
    }

    fun check_lineup_equality(lineup1:&LineUp, lineup2:&LineUp) : bool {
        ((lineup::get_hash(lineup1) == lineup::get_hash(lineup2)) &&
        (lineup::get_name(lineup1) == lineup::get_name(lineup2)) && 
        (lineup::get_creator(lineup1) == lineup::get_creator(lineup2)))
    }

    // find your rank, return 1-20  if not in the first 20, return 21
    public fun find_rank(global: &Global, lineup:&LineUp) :u64 {   
        let len = 20;
        assert!(vector::length(&global.rank_20) == len, ERR_EXCEED_VEC_LENGTH);
        let i = 0;
        while (i < len) {     
            let temp_lineup = vector::borrow(&global.rank_20, i);
            if (check_lineup_equality(temp_lineup, lineup)) {
                return i + 1
            };
            i = i + 1;
        };
        21
    }

    // Initiate the initial robot top 20 lineups with decreasing power and increasing seed when rank goes up
    public fun init_rank_20(global: &mut Global, roleGlobal: &role::Global, clock:&Clock, ctx: &mut TxContext) {
        let i = 0;
        let init_power = 60;
        let seed:u8 = 1;
        global.publish_time = clock::timestamp_ms(clock);
        assert!(vector::length(&global.rank_20) == 0, ERR_ALREADY_INIT);
        while (i < 20) {
            let lineup = lineup::generate_lineup_by_power(roleGlobal, init_power, seed, ctx);
            vector::push_back(&mut global.rank_20, lineup);
            init_power = init_power - 2;
            seed = seed + 1;
            i = i + 1;
        };
    }

    // Return the string description of the top 20 ranking.
    // The format is: 
    // playerAdd,playName,1,role1Name_level,role2Name_level...role6Name_level,score;
    // playerAdd,playName,2,role1Name_level,role2Name_level...role6Name_level,score;
    //   ?????
    // ?????? if string then with comma, buy vector maybe no need
    public fun generate_rank_20_description(global:&Global): String {
        let byte_comma = ascii::byte(ascii::char(44));
        let byte_semi = ascii::byte(ascii::char(59));
        let sub_line = ascii::byte(ascii::char(95));
        let len = vector::length(&global.rank_20);
        assert!(len == 20, ERR_EXCEED_VEC_LENGTH);
        let i = 0;
        let output:vector<u8> = vector::empty<u8>();
        while (i < len) {     
            let lineup = vector::borrow(&global.rank_20, i);
            let addr = address::to_string(lineup::get_creator(lineup));
            let name = lineup::get_name(lineup);
            let roles = lineup::get_roles(lineup);
            let score = calculate_score(global, i + 1);
            vector::append(&mut output, *string::bytes(&addr));
            vector::push_back(&mut output, byte_comma);
            vector::append(&mut output, *string::bytes(&name));
            vector::push_back(&mut output, byte_comma);
            vector::append(&mut output, utils::numbers_to_ascii_vector(i + 1));
            vector::push_back(&mut output, byte_comma);
            let j = 0;
            assert!(vector::length(roles) == 6, ERR_EXCEED_VEC_LENGTH);
            while (j < 6) {       
                let char = vector::borrow(roles, j);
                let roleName = role::get_class(char);
                let level = (role::get_level(char) as u64);
                vector::append(&mut output, *string::bytes(&roleName));
                vector::push_back(&mut output, sub_line);
                vector::append(&mut output, utils::numbers_to_ascii_vector(level));
                vector::push_back(&mut output, byte_comma);
                j = j + 1;
            };
            vector::append(&mut output, utils::numbers_to_ascii_vector(score));
            vector::push_back(&mut output, byte_semi);
            i = i + 1;
        };
        utf8(output)
    }

    // Return the time left in the current round of challenge, each round last for 7 days starting from the 
    // published time
    public entry fun query_left_challenge_time(global: &Global, clock:&Clock):u64 {
        let now = clock::timestamp_ms(clock);
        let one_week = DAY_IN_MS * 7;
        if ((now - global.publish_time) >= one_week) {
            0
        } else {
            one_week - (now - global.publish_time)
        }
    }

    fun get_base_weight_by_rank(rank:u64) : u64 {
        20 - rank / 2
    }

    public fun get_reward_amount_by_rank(global: &Global, total_amount:u64, total_scores:u64, rank: u64) : u64 {
        assert!(vector::length(&global.rank_20) >= rank, ERR_EXCEED_VEC_LENGTH);
        let gold_cost = lineup::get_gold_cost(vector::borrow(&global.rank_20, rank-1));
        let prop = gold_cost * get_base_weight_by_rank(rank) / total_scores;
        total_amount * prop - 1_000_000_000
    }

    // Score reveals the evaluation of player's performance, 
    // It is used to calculate the rewards of each player
    // total_score = sum(for(i=0; i<20; i++){ith_lineup_price*(20-rank/2)})
    // raward = lineup_price*(20-rank/2)*total_amount/total_score-1
    // rewards_subtotal/scores is the ratio
    public fun calculate_scores(global: &Global) : u64 {
         assert!(vector::length(&global.rank_20) == 20, ERR_EXCEED_VEC_LENGTH);
        let rank = 1;
        let total_socres = 0;
        while(rank <= 20) {
            let tmp_lineup = vector::borrow(&global.rank_20, rank-1);
            let gold_cost = lineup::get_gold_cost(tmp_lineup);
            let prop = get_base_weight_by_rank(rank);
            total_socres = (gold_cost * prop) + total_socres;
            rank = rank + 1;
        };
        total_socres
    }

    // score = lineup_price*(20-rank/2)
    public fun calculate_score(global: &Global, rank: u64) : u64 {
        assert!(vector::length(&global.rank_20) > rank-1, ERR_EXCEED_VEC_LENGTH);
        let gold_cost = lineup::get_gold_cost(vector::borrow(&global.rank_20, rank - 1));
        let prop = get_base_weight_by_rank(rank);
        (gold_cost * prop)
    }

    // Transfer the left Sui in the rewards pool tho the chess shop account only when challenge timeout
    #[lint_allow(self_transfer)]
    public fun withdraw_left_amount(global: &mut Global, clock:&Clock, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @manager, ERR_NO_PERMISSION);
        assert!(query_left_challenge_time(global, clock) == 0, ERR_CHALLENGE_NOT_END);
        let value = balance::value(&global.balance_SUI);
        let balance = balance::split(&mut global.balance_SUI, value);
        let sui = coin::from_balance(balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    public fun push_reward_amount(global:&mut Global, amount:u64) {
        assert!(!global.lock, ERR_REWARD_HAS_BEEN_LOCKED);
        vector::push_back(&mut global.reward_20, amount)
    }

    // Send some SUI (balance:Balance<SUI>)from the chess shop account to the challenge rewards pool
    public fun top_up_challenge_pool(global:&mut Global, balance:Balance<SUI>) {
        balance::join(&mut global.balance_SUI, balance);
    }

    public fun get_rewards_balance(global:&Global) : u64 {
        balance::value(&global.balance_SUI)
    }

    // Transfer the rewarding SUI to the player
    #[lint_allow(self_transfer)]
    public fun send_reward_by_rank(global:&mut Global, rank:u8, ctx:&mut TxContext) {
        let receiver = tx_context::sender(ctx);
        assert!(vector::length(&global.rank_20) >= (rank as u64), ERR_EXCEED_VEC_LENGTH);
        let amount = *vector::borrow(&global.reward_20, (rank as u64)-1);
        let balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(balance, ctx); 
        transfer::public_transfer(sui, receiver);
    }

    // we have to lock the challenge rank in each season, so we have time to prepare reward for each player.
    public fun lock_pool(global:&mut Global) {
        global.lock = true
    }

    public fun upgradeVersion(global: &mut Global, version:u64, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.version = version;
    }

    public fun change_manager(global: &mut Global, new_manager: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.manager = new_manager;
    }
 
////////////////////////////////Mainly for test ////////////////////////////////Mainly for test ////////////////////////////////Mainly for test
////////////////////////////////Mainly for test////////////////////////////////Mainly for test////////////////////////////////Mainly for test

    #[test_only]
    fun generate_challenge_global(): Global {
        Global {
            id: object::new(&mut tx_context::dummy()),
            balance_SUI: balance::zero(),
            rank_20: vector::empty<LineUp>(),
            reward_20: vector::empty<u64>(),
            publish_time: 0,
            lock: false
        }
    }

     #[test_only]
    public fun delete_challenge_global(global:Global){
        let Global{
            id: id1,
            balance_SUI: b,     
            rank_20: _r,
            reward_20: _re,
            publish_time: _t,
            lock: _l,
            version: _v,
            manager: _m
        } = global;
        //balance::withdraw_all(&mut b);
        balance::destroy_zero(b);
        object::delete(id1);
    }

    #[test_only]
    public fun print_rank_20(challenge_global:&Global){
        let rank_20 = &challenge_global.rank_20;
        let i = 0;
        let len = vector::length(rank_20);
        while(i < len){
            print(&(i+1));
            let cur = vector::borrow(rank_20, i);
            lineup::print_lineup(cur);
            i = i + 1;
        };
    }
/*
    #[test_only]
    #[allow(unused_assignment)]
    fun print_reward_20(challenge_global:&Global){
        //let reward_20 = challenge_global.reward_20;
    }
*/

    // Initiate the initial robot top 20 lineups with decreasing power and increasing seed when rank goes up
    //init_rank_20(global: &mut Global, roleGlobal: &role::Global, clock:&Clock, ctx: &mut TxContext)
    #[test]
    fun test_init_rank_20(){
        let ctx = tx_context::dummy();
        let challenge_global = generate_challenge_global();
        let role_global = role::generate_role_global(&mut ctx);
        let clock = clock::create_for_testing(&mut ctx);
        init_rank_20(&mut challenge_global, &role_global, &clock, &mut ctx);
        print_rank_20(&challenge_global);

        clock::destroy_for_testing(clock);
        role::delete_role_global(role_global);
        delete_challenge_global(challenge_global);

    }

    //rank_forward(global: &mut Global, lineup:LineUp)
    #[test]
    fun test_rank_forward(){
        let ctx = tx_context::dummy();
        let challenge_global = generate_challenge_global();
        let role_global = role::generate_role_global(&mut ctx);
        let clock = clock::create_for_testing(&mut ctx);
        init_rank_20(&mut challenge_global, &role_global, &clock, &mut ctx);
        //print_rank_20(&challenge_global);

        //Test when the lineup is already in the top 20
        let pre_rank = 1;
        let rank_20 = challenge_global.rank_20;
        let lineup_forward = lineup::new_lineup_from_reference(vector::borrow(&rank_20, pre_rank-1));
        //let lineup_backward = vector::borrow(&rank_20, pre_rank-2);

        //Test when the lineup is not in the top 20
        let lineup_newin = lineup::generate_lineup_by_power(&role_global, 19, 8, &mut ctx);

        //lineup::print_lineup(&lineup_forward);

        rank_forward(&mut challenge_global, lineup_newin);

        //lineup::print_lineup(vector::borrow(&challenge_global.rank_20, 8));
        //lineup::print_lineup(vector::borrow(&challenge_global.rank_20, 9));

        //Test when the lineup is already in the top 20
        if(check_lineup_equality(&lineup_newin, vector::borrow(&challenge_global.rank_20, 19))){ 
            print(& utf8(b"Forwarded lineup done right! "));
        }; 
        /*
        if(check_lineup_equality(lineup_backward, vector::borrow(&challenge_global.rank_20, pre_rank-1))){
            print(& utf8(b"Borwarded lineup done right! "));
        };*/
        //Test when the lineup is not in the top 20
        //if(!check_lineup_equality(lineup_newin, vector::borrow(rank_20, 19))) print(&(b"New in lineup not done right! "));


        clock::destroy_for_testing(clock);
        role::delete_role_global(role_global);
        delete_challenge_global(challenge_global);
    }
}