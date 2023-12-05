module auto_chess::challenge {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use std::string::{utf8, String, Self};
    use auto_chess::lineup::{Self, LineUp};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self};
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::ascii;
    use sui::address;
    use std::debug::print;
    use auto_chess::role;
    use sui::sui::SUI;
    friend auto_chess::chess;

    const ERR_CHALLENGE_NOT_END:u64 = 0x01;
    const ERR_NO_PERMISSION:u64 = 0x02;
    const DAY_IN_MS: u64 = 86_400_000;
    const ERR_REWARD_HAS_BEEN_LOCKED: u64 = 0x03;

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

    public(friend) fun get_lineup_by_rank(global: &Global, rank:u8): &LineUp {
        vector::borrow(&global.rank_20, (rank as u64))
    }

    public(friend) fun rank_forward(global: &mut Global, lineup:LineUp) {
        assert!(!global.lock, ERR_REWARD_HAS_BEEN_LOCKED);
        let rank = find_rank(global, &lineup);
        if (rank == 20) {
            vector::pop_back(&mut global.rank_20);
            vector::insert(&mut global.rank_20, lineup, 19);
        } else if (rank == 1) {
            // do nothing
        } else {
            // 15(rank = 15) -> 14(index = 13)
            vector::insert(&mut global.rank_20, lineup, rank - 2);
            vector::pop_back(&mut global.rank_20);
        };
    }

    fun check_lineup_equal(lineup1:&LineUp, lineup2:&LineUp) : bool {
        ((lineup::get_hash(lineup1) == lineup::get_hash(lineup2)) &&
        (lineup::get_name(lineup1) == lineup::get_name(lineup2)) && 
        (lineup::get_creator(lineup1) == lineup::get_creator(lineup2)))
    }

    // 1-20
    fun find_rank(global: &Global, lineup:&LineUp) :u64 {
        let len = 20;
        let i = 0;
        while (i < len) {
            let temp_lineup = vector::borrow(&global.rank_20, i);
            if (check_lineup_equal(temp_lineup, lineup)) {
                return i + 1;
            };
            i = i + 1;
        };
        20
    }

    public fun init_rank_20(global: &mut Global, roleGlobal: &role::Global, clock:&Clock, ctx: &mut TxContext) {
        let i = 0;
        let init_power = 40;
        let seed:u8 = 1;
        global.publish_time = clock::timestamp_ms(clock);
        while (i < 20) {
            let lineup = lineup::generate_lineup_by_power(roleGlobal, init_power, seed, ctx);
            vector::push_back(&mut global.rank_20, lineup);
            init_power = init_power + 2;
            seed = seed + 1;
            i = i + 1;
        };
    }

    public entry fun query_rank_20(global:&Global): String {
        let byte_comma = ascii::byte(ascii::char(44));
        let byte_semi = ascii::byte(ascii::char(59));
        let len = vector::length(&global.rank_20);
        let i = 0;
        let vec_out:vector<u8> = vector::empty<u8>();
        while (i < len) {
            let lineup = vector::borrow(&global.rank_20, i);
            let addr = lineup::get_creator(lineup);
            let addr_str = address::to_string(addr);
            let name = lineup::get_name(lineup);
            vector::append(&mut vec_out, *string::bytes(&addr_str));
            vector::push_back(&mut vec_out, byte_comma);
            vector::append(&mut vec_out, *string::bytes(&name));
            vector::push_back(&mut vec_out, byte_comma);
            vector::append(&mut vec_out, numbers_to_ascii_vector(i + 1));
            vector::push_back(&mut vec_out, byte_semi);
            i = i + 1;
        };
        utf8(vec_out)
    }

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

    public(friend) fun get_reward_amount_by_rank(global: &Global, total_amount:u64, total_scores:u64, rank: u64) : u64 {
        let tmp_lineup = vector::borrow(&global.rank_20, rank);
        let price = lineup::get_price(tmp_lineup);
        let prop = price * get_base_weight_by_rank(rank) / total_scores;
        total_amount * prop - 1_000_000_000
    }

    // todo:增加一个virtual的打印查询，检查一下lock的逻辑，降低一点难度，AI太强了。
    public(friend) fun get_total_virtual_scores(global: &Global) : u64 {
        let rank = 0;
        let total_socres = 0;
        while(rank < 20) {
            let tmp_lineup = vector::borrow(&global.rank_20, rank);
            let price = lineup::get_price(tmp_lineup);
            let prop = get_base_weight_by_rank(rank);
            total_socres = (price * prop) + total_socres;
            rank = rank + 1;
        };
        total_socres
    }

    #[lint_allow(self_transfer)]
    public fun withdraw_left_amount(global: &mut Global, clock:&Clock, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @account, ERR_NO_PERMISSION);
        assert!(query_left_challenge_time(global, clock) == 0, ERR_CHALLENGE_NOT_END);
        let value = balance::value(&global.balance_SUI);
        let balance = balance::split(&mut global.balance_SUI, value);
        let sui = coin::from_balance(balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    public(friend) fun push_reward_amount(global:&mut Global, amount:u64) {
        assert!(!global.lock, ERR_REWARD_HAS_BEEN_LOCKED);
        vector::push_back(&mut global.reward_20, amount)
    }

    public fun top_up_challenge_pool(global:&mut Global, balance:Balance<SUI>) {
        balance::join(&mut global.balance_SUI, balance);
    }

    #[lint_allow(self_transfer)]
    public(friend) fun send_reward_by_rank(global:&mut Global, rank:u8, ctx:&mut TxContext) {
        let receiver = tx_context::sender(ctx);
        let amount = *vector::borrow(&global.reward_20, (rank as u64));
        let balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(balance, ctx); 
        transfer::public_transfer(sui, receiver);
    }
    
    fun numbers_to_ascii_vector(val: u64): vector<u8> {
        let vec = vector<u8>[];
        loop {
            let b = val % 10;
            vector::push_back(&mut vec, (48 + b as u8));
            val = val / 10;
            if (val <= 0) break;
        };
        vector::reverse(&mut vec);
        vec
    }

    public(friend) fun lock(global:&mut Global) {
        global.lock = true
    }
}