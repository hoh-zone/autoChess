module auto_chess::chess {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use std::string::{utf8, String};
    use auto_chess::lineup::{Self, LineUp};
    use sui::balance::{Self, Balance};
    use sui::pay;
    use sui::coin::{Self, Coin};
    use std::vector;
    use sui::clock::{Clock};
    use sui::event;
    use auto_chess::role::{Self};
    use auto_chess::utils;
    use auto_chess::challenge;
    use auto_chess::fight;

    use sui::sui::SUI;
    use auto_chess::verify;

    const INIT_GOLD:u64 = 10;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;
    const ERR_EXCEED_NUM_LIMIT:u64 = 0x02;
    const ERR_PAYMENT_NOT_ENOUGH:u64 = 0x03;
    const ERR_NOT_ARENA_CHESS:u64 = 0x04;
    const ERR_NOT_PERMISSION:u64 = 0x06;
    const ERR_ONLY_ARENA_MODE_ALLOWED:u64 = 0x12;
    const ERR_CHALLENGE_NOT_END:u64 = 0x013;
    const ERR_ARENA_FEE_HAS_CHECKED_OUT:u64 = 0x014;

    struct Global has key {
        id: UID,
        total_chesses: u64,
        total_match:u64,
        balance_SUI: Balance<SUI>,
    }

    struct Chess has key, store {
        id:UID,
        name:String,
        lineup: LineUp,
        cards_pool: LineUp,
        gold: u64,
        win: u8,
        lose: u8,
        challenge_win:u8,
        challenge_lose:u8,
        creator: address,
        price: u64,
        arena: bool,
        arena_checked: bool
    }

    struct FightEvent has copy, drop {
        chess_id: address,
        v1: address,
        v1_name: String,
        v1_win: u8,
        v1_lose: u8,
        v1_challenge_win: u8,
        v1_challenge_lose: u8,
        v2_name: String,
        v2_lineup:lineup::LineUp,
        res: u8 // even:0, win:1
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
            balance_SUI: balance::zero(),
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
            balance_SUI: balance::zero(),
        };
        transfer::share_object(global);
    }

    #[lint_allow(self_transfer)]
    public fun withdraw(amount:u64, global: &mut Global, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @account, ERR_NOT_PERMISSION);
        let sui_balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    public fun lock_reward(global: &mut Global, challengeGlobal: &mut challenge::Global, clock:&Clock, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @account, ERR_NOT_PERMISSION);
        assert!(challenge::query_left_challenge_time(challengeGlobal, clock) == 0, ERR_CHALLENGE_NOT_END);
        let total = balance::value(&global.balance_SUI);
        let split_value = total / 10;
        let balance = balance::split(&mut global.balance_SUI, split_value);
        challenge::top_up_challenge_pool(challengeGlobal, balance);
        let i = 0;
        let total_scores = challenge::get_total_virtual_scores(challengeGlobal);
        while (i < 20) {
            let amount = challenge::get_reward_amount_by_rank(challengeGlobal, split_value, total_scores, i);
            challenge::push_reward_amount(challengeGlobal, amount);
            i = i + 1;
        };
        challenge::lock_pool(challengeGlobal);
    }

    #[lint_allow(self_transfer)]
    public entry fun claim_rank_reward(challengeGlobal: &mut challenge::Global, chess:Chess, clock:&Clock, rank:u8, ctx: &mut TxContext) {
        assert!(challenge::query_left_challenge_time(challengeGlobal, clock) == 0, ERR_CHALLENGE_NOT_END);
        let sender = tx_context::sender(ctx);
        let tmp_lineup = challenge::get_lineup_by_rank(challengeGlobal, rank);
        if (lineup::get_creator(tmp_lineup) == sender) {
            let Chess {id, name:_, lineup:_, cards_pool:_, gold:_, win:_, lose:_, challenge_win:_, challenge_lose:_, creator:_, price:_, arena:_, arena_checked:_} = chess;
            challenge::send_reward_by_rank(challengeGlobal, rank, ctx);
            object::delete(id);
        } else {
            public_transfer(chess, sender);
        };
    }

    #[lint_allow(self_transfer)]
    public entry fun mint_arena_chess(role_global:&role::Global, global: &mut Global, name:String, coins:vector<Coin<SUI>>, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        let pay_value = coin::value(&merged_coin);
        assert!(utils::check_ticket_price(pay_value), ERR_PAYMENT_NOT_ENOUGH);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, ctx),
            gold: INIT_GOLD,
            win: 0,
            lose: 0,
            challenge_win:0,
            challenge_lose:0,
            creator: sender,
            price: pay_value,
            arena: true,
            arena_checked: false
        };
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, pay_value, ctx)
        );
        balance::join(&mut global.balance_SUI, balance);
        if (coin::value(&merged_coin) > 0) {
            transfer::public_transfer(merged_coin, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(merged_coin);
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    #[lint_allow(self_transfer)]
    public entry fun mint_chess(role_global:&role::Global, global: &mut Global, name:String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, ctx),
            gold: INIT_GOLD,
            win: 0,
            lose: 0,
            challenge_win:0,
            challenge_lose:0,
            creator: sender,
            price: 0,
            arena: false,
            arena_checked: true
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    #[lint_allow(self_transfer)]
    public entry fun check_out_arena_fee(global: &mut Global, chess: &mut Chess, ctx: &mut TxContext) {
        assert!(chess.arena, ERR_NOT_ARENA_CHESS);
        assert!(!chess.arena_checked, ERR_ARENA_FEE_HAS_CHECKED_OUT);
        chess.arena_checked = true;
        let total_amount = get_total_shui_amount(global);
        let reward_amount = utils::estimate_reward(total_amount, chess.price, chess.win);
        let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    #[lint_allow(self_transfer)]
    public entry fun check_out_arena(global: &mut Global, chess: Chess, ctx: &mut TxContext) {
        assert!(chess.arena, ERR_NOT_ARENA_CHESS);
        let total_amount = get_total_shui_amount(global);
        let reward_amount = utils::estimate_reward(total_amount, chess.price, chess.win);
        let Chess {id, name:_, lineup:_, cards_pool:_, gold:_, win:_, lose:_, challenge_win:_, challenge_lose:_, creator:_, price:_, arena:_, arena_checked: arena_checked} = chess;
        if (!arena_checked) {
            let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
            let sui = coin::from_balance(sui_balance, ctx);
            transfer::public_transfer(sui, tx_context::sender(ctx));
        };
        object::delete(id);
    }

    #[test_only]
    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    #[test_only]
    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    fun match(role_global:&role::Global, lineup_global:&mut lineup::Global, challengeGlobal:&mut challenge::Global, chess:&mut Chess, ctx: &mut TxContext) {
        assert!(chess.lose <= 2, ERR_YOU_ARE_DEAD);

        // match an enemy config
        let enemy_lineup;
        let chanllenge_on = false;
        if (chess.win >= 10) {
            assert!(chess.arena, ERR_ONLY_ARENA_MODE_ALLOWED);
            assert!(chess.challenge_lose <= 2, ERR_YOU_ARE_DEAD);
            chanllenge_on = true;
            enemy_lineup = *challenge::get_lineup_by_rank(challengeGlobal, (19 - chess.challenge_win));
        } else {
            enemy_lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, chess.arena, ctx);
        };

        // fight and record lineup
        if (fight(chess, &mut enemy_lineup, chanllenge_on, ctx)) {
            if (chanllenge_on) {
                chess.challenge_win = chess.challenge_win + 1;
                challenge::rank_forward(challengeGlobal, chess.lineup);
            } else {
                chess.win = chess.win + 1;
                lineup::record_player_lineup(chess.win - 1, chess.lose, lineup_global, chess.lineup, chess.arena);
                if (chess.win == 10) {
                    lineup::record_player_lineup(chess.win, chess.lose, lineup_global, chess.lineup, chess.arena);
                };
            };
        } else {
            if (chanllenge_on) {
                chess.challenge_lose = chess.challenge_lose + 1;
            } else {
                chess.lose = chess.lose + 1;
                lineup::record_player_lineup(chess.win, chess.lose - 1, lineup_global, chess.lineup, chess.arena);
            }
        };
        if (chess.lose <= 2) {
            refresh_cards_pools(role_global, chess, ctx);
        };
    }

    fun refresh_cards_pools(role_global:&role::Global, chess:&mut Chess, ctx:&mut TxContext) {
        chess.cards_pool = lineup::generate_random_cards(role_global, ctx);
    }

    public fun fight(chess: &mut Chess, enemy_lineup: &mut LineUp, is_challenge:bool, ctx:&mut TxContext) :bool {
        let my_lineup_fight = *&chess.lineup;

        // backup to avoid base_life to be changed
        let enemy_lineup_fight = *enemy_lineup;
        let my_lineup_permanent = &mut chess.lineup;
        let my_roles = *lineup::get_roles(&my_lineup_fight);
        vector::reverse<role::Role>(&mut my_roles);
        let my_num = vector::length(&my_roles);
        let enemy_roles = *lineup::get_roles(&enemy_lineup_fight);
        vector::reverse<role::Role>(&mut enemy_roles);
        if (my_num == 0) {
            return false
        };
        let my_first_role = role::init_role();
        let enemy_first_role = role::init_role();
        let my_fist_role_index = 0;
        let enemy_first_role_index = 0;
        while (fight::some_alive(&my_first_role, &my_roles) && fight::some_alive(&enemy_first_role, &enemy_roles)) {
            while (vector::length(&my_roles) > 0 && (role::get_life(&my_first_role) == 0 || (role::get_name(&my_first_role) == utf8(b"none") || role::get_name(&my_first_role) == utf8(b"init")))) {
                my_first_role = vector::pop_back(&mut my_roles);
                if (vector::length(&my_roles) < 5) {
                    my_fist_role_index = my_fist_role_index + 1;
                };
            };
            while (vector::length(&enemy_roles) > 0 && (role::get_life(&enemy_first_role) == 0 || (role::get_name(&enemy_first_role) == utf8(b"none") || role::get_name(&enemy_first_role) == utf8(b"init")))) {
                enemy_first_role = vector::pop_back(&mut enemy_roles);
                if (vector::length(&enemy_roles) < 5) {
                    enemy_first_role_index = enemy_first_role_index + 1;
                };
            };
            while(role::get_life(&my_first_role) > 0 && role::get_life(&enemy_first_role) > 0) {
                fight::action(my_fist_role_index, &mut my_first_role, &mut enemy_first_role, &mut my_roles, &mut enemy_roles, my_lineup_permanent);
                fight::action(enemy_first_role_index, &mut enemy_first_role, &mut my_first_role, &mut enemy_roles, &mut my_roles, my_lineup_permanent);
            };
        };

        let win = chess.win;
        let lose = chess.lose;
        let challenge_win = chess.challenge_win;
        let challenge_lose = chess.challenge_lose;
        let res;
        if (fight::some_alive(&enemy_first_role, &enemy_roles)) {
            if (is_challenge) {
                challenge_win = challenge_win + 1;
            } else {
                win = win + 1;
            };
            res = false
        } else {
            if (is_challenge) {
                challenge_lose = challenge_lose + 1;
            } else {
                lose = lose + 1;
            };
            res = true;
        };
        event::emit(FightEvent {
            chess_id: object::id_address(chess),
            v1: tx_context::sender(ctx),
            v1_name: chess.name,
            v1_win: win,
            v1_lose: lose,
            v1_challenge_win: challenge_win,
            v1_challenge_lose: challenge_lose,
            v2_name: lineup::get_name(enemy_lineup),
            v2_lineup:*enemy_lineup,
            res: 2
        });
        res
    }

    public fun get_total_shui_amount(global: &Global) : u64 {
        balance::value(&global.balance_SUI)
    }

    public entry fun operate_and_match(global:&mut Global, role_global:&role::Global, lineup_global:&mut lineup::Global, 
        challengeGlobal:&mut challenge::Global, chess:&mut Chess, operations: vector<String>, left_gold:u8, 
        lineup_str_vec: vector<String>, ctx:&mut TxContext) {
        assert!(vector::length(&lineup_str_vec) == 6, ERR_EXCEED_NUM_LIMIT);
        let init_lineup = *&chess.lineup;
        let init_roles = lineup::get_mut_roles(&mut init_lineup);
        let cards_pool = chess.cards_pool;
        let cards_pool_roles = lineup::get_mut_roles(&mut cards_pool);
        verify::verify_operation(role_global, init_roles, cards_pool_roles, operations, left_gold, lineup_str_vec, chess.name, (chess.gold as u8), chess.price, ctx);
        let expected_lineup = lineup::parse_lineup_str_vec(chess.name, role_global, lineup_str_vec, chess.price, ctx);
        if (chess.challenge_win + chess.challenge_lose >= 20) {
            // prevent from unlimited strength upon its lineup
            chess.gold = 0;
        } else {
            chess.gold = INIT_GOLD;
        };
        let tmp_hash = lineup::get_hash(&chess.lineup);
        chess.lineup = expected_lineup; 
        lineup::set_hash(&mut chess.lineup, tmp_hash);
        match(role_global, lineup_global, challengeGlobal, chess, ctx);
        global.total_match = global.total_match + 1;
    }
}