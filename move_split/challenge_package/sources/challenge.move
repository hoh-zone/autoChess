// this module is used for the challenge mode, every player who has won more than 10 chesses can attend the challenge mode to win more sui
// every season we extract partial sui from our reward pool for the first 20 players in the challenge mode.
// you can review your rank in web : https://home.autochess.app/
module challenge_package::challenge {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use std::string::{utf8, String, Self};
    use lineup_package::lineup::{Self, LineUp};
    use util_package::utils;
    use sui::balance::{Self, Balance};
    use sui::coin::{Self};
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::ascii;
    use sui::address;
    use role_package::role;
    use sui::sui::SUI;

    const ERR_CHALLENGE_NOT_END:u64 = 0x01;
    const ERR_NO_PERMISSION:u64 = 0x02;
    const DAY_IN_MS: u64 = 86_400_000;
    const ERR_REWARD_HAS_BEEN_LOCKED: u64 = 0x03;
    const ERR_ALREADY_INIT: u64 = 0x04;
    const ERR_EXCEED_VEC_LENGTH: u64 = 0x05;

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
        lock:bool
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            balance_SUI: balance::zero(),
            rank_20: vector::empty<LineUp>(),
            reward_20: vector::empty<u64>(),
            publish_time: 0,
            lock: false
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            balance_SUI: balance::zero(),
            rank_20: vector::empty<LineUp>(),
            reward_20: vector::empty<u64>(),
            publish_time: 0,
            lock: false
        };
        transfer::share_object(global);
    }

    public fun get_lineup_by_rank(global: &Global, rank:u8): &LineUp {
        assert!(vector::length(&global.rank_20) > (rank as u64), ERR_EXCEED_VEC_LENGTH);
        vector::borrow(&global.rank_20, (rank as u64))
    }

    // when the player wins, swap the ranking of the player with the previous one who was 1 rank ahead
    public fun rank_forward(global: &mut Global, lineup:LineUp) {
        assert!(!global.lock, ERR_REWARD_HAS_BEEN_LOCKED);
        let previous_rank = find_rank(global, &lineup);
        // if the player was not in the top 20, it is now 20th
        if (previous_rank == 21) {
            vector::pop_back(&mut global.rank_20);
            vector::insert(&mut global.rank_20, lineup, 19);
        } else if (previous_rank == 1) {
            // do nothing
        } else {
            // 15(rank = 15) -> 14(index = 13)
            let old_index = previous_rank - 1;
            vector::remove(&mut global.rank_20, old_index);
            vector::insert(&mut global.rank_20, lineup, old_index - 1);
        };
    }

    fun check_lineup_equality(lineup1:&LineUp, lineup2:&LineUp) : bool {
        ((lineup::get_hash(lineup1) == lineup::get_hash(lineup2)) &&
        (lineup::get_name(lineup1) == lineup::get_name(lineup2)) && 
        (lineup::get_creator(lineup1) == lineup::get_creator(lineup2)))
    }

    // find your rank, return 1-20  if not in the first 20, return 21
    public fun find_rank(global: &Global, lineup:&LineUp) :u64 {
        let len = 20;
        let i = 0;
        while (i < len) {
            assert!(vector::length(&global.rank_20) > i, ERR_EXCEED_VEC_LENGTH);
            let temp_lineup = vector::borrow(&global.rank_20, i);
            if (check_lineup_equality(temp_lineup, lineup)) {
                return i + 1
            };
            i = i + 1;
        };
        21
    }

    // Initiate the initial robot top 20 lineups with the set and increasing power and seed when rank goes up
    public fun init_rank_20(global: &mut Global, roleGlobal: &role::Global, clock:&Clock, ctx: &mut TxContext) {
        let i = 0;
        let init_power = 80;
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
    //    
    public entry fun generate_rank_20_description(global:&Global): String {
        let byte_comma = ascii::byte(ascii::char(44));
        let byte_semi = ascii::byte(ascii::char(59));
        let sub_line = ascii::byte(ascii::char(95));
        let len = vector::length(&global.rank_20);
        let i = 0;
        let vec_out:vector<u8> = vector::empty<u8>();
        while (i < len) {
            assert!(vector::length(&global.rank_20) > i, ERR_EXCEED_VEC_LENGTH);
            let lineup = vector::borrow(&global.rank_20, i);
            let addr = lineup::get_creator(lineup);
            let addr_str = address::to_string(addr);
            let name = lineup::get_name(lineup);
            let roles = lineup::get_roles(lineup);
            let score = calculate_score(global, i + 1);
            vector::append(&mut vec_out, *string::bytes(&addr_str));
            vector::push_back(&mut vec_out, byte_comma);
            vector::append(&mut vec_out, *string::bytes(&name));
            vector::push_back(&mut vec_out, byte_comma);
            vector::append(&mut vec_out, utils::numbers_to_ascii_vector(i + 1));
            vector::push_back(&mut vec_out, byte_comma);
            let j = 0;
            while (j < 6) {
                assert!(vector::length(roles) > j, ERR_EXCEED_VEC_LENGTH);
                let role = vector::borrow(roles, j);
                let roleName = role::get_class(role);
                let level = (role::get_level(role) as u64);
                vector::append(&mut vec_out, *string::bytes(&roleName));
                vector::push_back(&mut vec_out, sub_line);
                vector::append(&mut vec_out, utils::numbers_to_ascii_vector(level));
                vector::push_back(&mut vec_out, byte_comma);
                j = j + 1;
            };
            vector::append(&mut vec_out, utils::numbers_to_ascii_vector(score));
            vector::push_back(&mut vec_out, byte_semi);
            i = i + 1;
        };
        utf8(vec_out)
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
        assert!(vector::length(&global.rank_20) > rank, ERR_EXCEED_VEC_LENGTH);
        let tmp_lineup = vector::borrow(&global.rank_20, rank);
        let gold_cost = lineup::get_gold_cost(tmp_lineup);
        let prop = gold_cost * get_base_weight_by_rank(rank) / total_scores;
        total_amount * prop - 1_000_000_000
    }

    // Score reveals the evaluation of player's performance, 
    // It is used to calculate the rewards of each player
    // total_score = sum(for(i=0; i<20; i++){ith_lineup_price*(20-rank/2)})
    // raward = lineup_price*(20-rank/2)*total_amount/total_score-1
    // rewards_subtotal/scores is the ratio
    public fun calculate_scores(global: &Global) : u64 {
        let rank = 0;
        let total_socres = 0;
        while(rank < 20) {
            assert!(vector::length(&global.rank_20) > rank, ERR_EXCEED_VEC_LENGTH);
            let tmp_lineup = vector::borrow(&global.rank_20, rank);
            let gold_cost = lineup::get_gold_cost(tmp_lineup);
            let prop = get_base_weight_by_rank(rank);
            total_socres = (gold_cost * prop) + total_socres;
            rank = rank + 1;
        };
        total_socres
    }

    // score = lineup_price*(20-rank/2)
    public fun calculate_score(global: &Global, rank: u64) : u64 {
        assert!(vector::length(&global.rank_20) > rank - 1, ERR_EXCEED_VEC_LENGTH);
        let tmp_lineup = vector::borrow(&global.rank_20, rank - 1);
        let gold_cost = lineup::get_gold_cost(tmp_lineup);
        let prop = get_base_weight_by_rank(rank - 1);
        (gold_cost * prop)
    }

    // Transfer the left Sui in the rewards pool tho the chess shop account only when challenge timeout
    #[lint_allow(self_transfer)]
    public fun withdraw_left_amount(global: &mut Global, clock:&Clock, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @account, ERR_NO_PERMISSION);
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
        assert!(vector::length(&global.rank_20) > (rank as u64), ERR_EXCEED_VEC_LENGTH);
        let amount = *vector::borrow(&global.reward_20, (rank as u64));
        let balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(balance, ctx); 
        transfer::public_transfer(sui, receiver);
    }

    // we have to lock the challenge rank in each season, so we have time to prepare reward for each player.
    public fun lock_pool(global:&mut Global) {
        global.lock = true
    }
}