module auto_chess::chess {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use std::string::{utf8, String, Self};
    use auto_chess::lineup::{Self, LineUp};
    use sui::balance::{Self, Balance};
    use sui::pay;
    use sui::coin::{Self, Coin};
    use std::vector;
    use std::debug::print;
    use sui::event;
    use auto_chess::role::{Self, Role};
    use auto_chess::utils;
    use auto_chess::effect;
    use sui::sui::SUI;
  
    const INIT_LIFE:u64 = 3;
    const INIT_GOLD:u64 = 10;
    const REFRESH_PRICE:u8 = 2;
    const ARENA_CHESS_PRICE:u64 = 1;
    const CARDS_IN_ONE_REFRESH:u64 = 5;
    const AMOUNT_DECIMAL:u64 = 1_000_000_000;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;
    const ERR_EXCEED_NUM_LIMIT:u64 = 0x02;
    const ERR_PAYMENT_NOT_ENOUGH:u64 = 0x03;
    const ERR_NOT_ARENA_CHESS:u64 = 0x04;
    const ERR_POOL_NOT_ENOUGH:u64 = 0x05;
    const ERR_NOT_PERMISSION:u64 = 0x06;
    const ERR_NOT_ENOUGH_GOLD:u64 = 0x07;
    const ERR_INVALID_CHARACTOR:u64 = 0x08;
    const ERR_CHARACTOR_IS_NONE:u64 = 0x09;
    const ERR_UPGRADE_FAILED:u64 = 0x10;
    const ERR_SAME_INDEX_UPGRADE:u64 = 0x11;
    const ERR_CHECK_ROLES_NOT_EQUAL:u64 = 0x12;
    const ERR_WRONG_LEFT_GOLD:u64 = 0x13;

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
        refresh_price: u8,
        win: u8,
        lose: u8,
        even: u8,
        creator: address,
        arena: bool
    }

    struct FightEvent has copy, drop {
        chess_id: address,
        v1: address,
        v1_name: String,
        v1_win: u8,
        v1_lose: u8,
        v2_name: String,
        v2_lineup:lineup::LineUp,
        res: u8 // even:0, win:1, lose:2
    }

    struct ArenaCheckOut has copy, drop {
        chess_id: address,
        owner: address,
        name: String,
        win: u8,
        lose: u8,
        reward: u64,
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

    public entry fun mint_arena_chess(role_global:&role::Global, global: &mut Global, name:String, coins:vector<Coin<SUI>>, ctx: &mut TxContext) {
        print(&utf8(b"mint new arena chess"));
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(0,0), ctx),
            gold: INIT_GOLD,
            refresh_price: REFRESH_PRICE,
            win: 0,
            lose: 0,
            even: 0,
            creator: sender,
            arena: true
        };
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        assert!(coin::value(&merged_coin) >= ARENA_CHESS_PRICE * AMOUNT_DECIMAL, ERR_PAYMENT_NOT_ENOUGH);
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, ARENA_CHESS_PRICE * AMOUNT_DECIMAL, ctx)
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


    public entry fun mint_chess(role_global:&role::Global, global: &mut Global, name:String, ctx: &mut TxContext) {
        print(&utf8(b"mint new chess"));
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(0,0), ctx),
            gold: INIT_GOLD,
            refresh_price: REFRESH_PRICE,
            win: 0,
            lose: 0,
            even: 0,
            creator: sender,
            arena: false
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    public entry fun check_out_arena(global: &mut Global, chess: Chess, ctx: &mut TxContext) {
        assert!(chess.arena, ERR_NOT_ARENA_CHESS);
        let reward_amount = estimate_reward(global, chess.win, chess.lose);
        event::emit(ArenaCheckOut {
            chess_id: object::id_address(&chess),
            owner: chess.creator,
            name: chess.name,
            win: chess.win,
            lose: chess.lose,
            reward: reward_amount,
        });
        let Chess {id, name, lineup, cards_pool, gold, refresh_price, win, lose, even, creator, arena} = chess;
       
        let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
        object::delete(id);
    }

    public entry fun operate_and_match(global:&mut Global, role_global:&role::Global, lineup_global:&mut lineup::Global, chess:&mut Chess, operations: vector<String>, left_gold:u8, lineup_str_vec: vector<String>, ctx:&mut TxContext) {
        assert!(vector::length(&lineup_str_vec) == 6, ERR_EXCEED_NUM_LIMIT);
        let init_lineup = *&chess.lineup;
        let init_roles = lineup::get_mut_roles(&mut init_lineup);
        let gold = 10;
        let cards_pool = chess.cards_pool;
        let cards_pool_roles = lineup::get_mut_roles(&mut cards_pool);
        let refresh_time = 0;
        vector::reverse(&mut operations);
        while(vector::length(&operations) > 0) {
            let operate = vector::pop_back(&mut operations);
            if (string::index_of(&operate, &utf8(b"buy_upgrade")) == 0) {
                print(&utf8(b"buy_upgrade operation"));
                let sub_str = string::sub_string(&operate, 11 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role = role::init_role();
                let price;
                {
                    from_role = *vector::borrow<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                    price = role::get_price(&from_role);
                    assert!(role::get_name(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_name(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(cards_pool_roles, from_index);
                role::set_name(from_role_mut, utf8(b"none"));
                assert!(gold >= price, ERR_NOT_ENOUGH_GOLD);
                gold = gold - price;
            } else if (string::index_of(&operate, &utf8(b"buy")) == 0) {
                print(&utf8(b"buy operation"));
                let sub_str = string::sub_string(&operate, 3 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role = vector::borrow_mut<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                assert!(role::get_name(from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let copy_role = *from_role;
                role::set_name(from_role, utf8(b"none"));
                let empty = vector::borrow<role::Role>(init_roles, to_index);
                assert!(role::get_name(empty) == utf8(b"none"), ERR_INVALID_CHARACTOR);
                vector::remove(init_roles, to_index);
                vector::insert(init_roles, copy_role, to_index);
                let price = role::get_price(&copy_role);
                assert!(gold >= price, ERR_NOT_ENOUGH_GOLD);
                gold = gold - price;
            } else if (string::index_of(&operate, &utf8(b"swap")) == 0) {
                print(&utf8(b"swap operation"));
                let sub_str = string::sub_string(&operate, 4 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                vector::swap(init_roles, from_index, to_index);
            } else if (string::index_of(&operate, &utf8(b"sell")) == 0) {
                print(&utf8(b"sell operation"));
                let sub_str = string::sub_string(&operate, 4 + 1, string::length(&operate));
                let from_index = utils::utf8_to_u64(sub_str);
                let from_role = vector::borrow_mut<role::Role>(init_roles, from_index);
                assert!(role::get_name(from_role) != utf8(b"none"), ERR_INVALID_CHARACTOR);
                role::set_name(from_role, utf8(b"none"));
                gold = gold + role::get_sell_price(from_role);
            } else if (string::index_of(&operate, &utf8(b"upgrade")) == 0) {
                print(&utf8(b"upgrade operation"));
                let sub_str = string::sub_string(&operate, 7 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                assert!(from_index != to_index, ERR_SAME_INDEX_UPGRADE);
                let from_role = role::init_role();
                {
                    from_role = *vector::borrow<role::Role>(init_roles, from_index);
                    assert!(role::get_name(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_name(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(init_roles, from_index);
                role::set_name(from_role_mut, utf8(b"none"));
            } else if (string::index_of(&operate, &utf8(b"refresh")) == 0) {
                print(&utf8(b"refresh operation"));
                assert!(gold >= REFRESH_PRICE, ERR_NOT_ENOUGH_GOLD);
                gold = gold - REFRESH_PRICE;
                refresh_time = refresh_time + 1;
            } else {
                print(&utf8(b"invalid operation"));
            }
        };

        let expected_lineup = lineup::parse_lineup_str_vec(chess.name, role_global, lineup_str_vec, ctx);
        let expected_roles = lineup::get_roles(&expected_lineup);

        assert!(role::check_roles_equal(init_roles, expected_roles), ERR_CHECK_ROLES_NOT_EQUAL);
        assert!(gold == left_gold, ERR_WRONG_LEFT_GOLD);
        chess.gold = INIT_GOLD;
        chess.lineup = expected_lineup;
        match(role_global, lineup_global, chess, ctx);
        global.total_match = global.total_match + 1;
        print(&utf8(b"match finish"));
    }

    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    fun match(role_global:&role::Global, lineup_global:&mut lineup::Global, chess:&mut Chess, ctx: &mut TxContext) {
        print(&utf8(b"start match chess"));
        assert!(chess.lose <= 2, ERR_YOU_ARE_DEAD);

        // match an enemy config
        let enemy_lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, ctx);

        // fight and record lineup
        if (fight(chess, &mut enemy_lineup, ctx)) {
            lineup::record_player_lineup(chess.win - 1, chess.lose, lineup_global, chess.lineup);
        } else {
            lineup::record_player_lineup(chess.win, chess.lose - 1, lineup_global, chess.lineup);
        };
        if (chess.lose <= 2) {
            refresh_cards_pools(role_global, chess, ctx);
        };
        chess.gold = INIT_GOLD;
    }

    fun refresh_cards_pools(role_global:&role::Global, chess:&mut Chess, ctx:&mut TxContext) {
        let seed = 20;
        chess.cards_pool = lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(chess.win,chess.lose), ctx);
    }

    fun some_alive(first_role: &Role, roles: &vector<Role>) : bool {
        let i = 0;
        if (role::get_name(first_role) != utf8(b"init") && role::get_life(first_role) > 0) {
            return true
        };
        while (i < vector::length(roles)) {
            let role = vector::borrow(roles, i);
            if (role::get_name(role) != utf8(b"none") && role::get_life(role) > 0) {
                return true
            };
            i = i + 1;
        };
        return false
    }

    fun get_extra_max_magic_debuff(roles: &vector<Role>): u8 {
        let value:u8 = 0;
        let len = vector::length(roles);
        let i = 0;
        while (i < len) {
            let role = vector::borrow(roles, i);
            if (role::get_effect(role)== utf8(b"add_all_tmp_max_magic")) {
                let tmp = (utils::utf8_to_u64(role::get_effect_value(role)) as u8);
                if (tmp > value) {
                    value = tmp;
                }
            };
            i = i + 1;
        };
        value
    }

    fun call_skill(role: &Role, _: &mut Role) {
        print(&role::get_name(role));
        print(&utf8(b"call the skill"));
    }

    fun call_attack(role: &Role, other_role: &mut Role) {
        let attack = role::get_attack(role);
        let enemy_life = role::get_life(other_role);
        if (enemy_life <= attack) {
            role::set_life(other_role, 0);
            print(&role::get_name(other_role));
            print(&utf8(b"is dead"));
        } else {
            role::set_life(other_role, enemy_life - attack);
        };
    }

    fun action(role: &mut Role, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>) {
        let extra_max_magic_debuff = get_extra_max_magic_debuff(enemy_roles);
        let max_magic = role::get_max_magic(role);
        let magic = role::get_magic(role);
        if (magic >= (max_magic + extra_max_magic_debuff) && role::get_effect_type(role) == utf8(b"skill")) {
            call_skill(role, enemy_role);
            role::set_magic(role, 0);
        } else {
            call_attack(role, enemy_role);
            role::set_magic(role, magic + 1);
        };
    }

    public fun fight(chess: &mut Chess, enemy_lineup: &mut LineUp, ctx:&mut TxContext):bool {
        let my_lineup_fight = *&chess.lineup;

        // backup to avoid base_life to be changed
        let enemy_lineup_fight = *enemy_lineup;
        let my_lineup_permanent = chess.lineup;
        let my_roles = *lineup::get_roles(&my_lineup_fight);
        vector::reverse<role::Role>(&mut my_roles);
        let my_num = vector::length(&my_roles);
        let enemy_roles = *lineup::get_roles(&enemy_lineup_fight);
        vector::reverse<role::Role>(&mut enemy_roles);
        let enemy_num = vector::length(&enemy_roles);
        if (my_num == 0) {
            return false
        };
        let my_first_role = role::init_role();
        let enemy_first_role = role::init_role();
        while (some_alive(&my_first_role, &my_roles) && some_alive(&enemy_first_role, &enemy_roles)) {
            while (vector::length(&my_roles) > 0 && (role::get_life(&my_first_role) == 0 || (role::get_name(&my_first_role) == utf8(b"none") || role::get_name(&my_first_role) == utf8(b"init")))) {
                my_first_role = vector::pop_back(&mut my_roles);
            };
            while (vector::length(&enemy_roles) > 0 && (role::get_life(&enemy_first_role) == 0 || (role::get_name(&enemy_first_role) == utf8(b"none") || role::get_name(&enemy_first_role) == utf8(b"init")))) {
                enemy_first_role = vector::pop_back(&mut enemy_roles);
            };
            while(role::get_life(&my_first_role) > 0 && role::get_life(&enemy_first_role) > 0) {
                print(&utf8(b"we action:"));
                action(&mut my_first_role, &mut enemy_first_role, &mut my_roles, &mut enemy_roles);
                print(&utf8(b"enemy action:"));
                action(&mut enemy_first_role, &mut my_first_role, &mut enemy_roles, &mut my_roles);
            };
        };

        if (some_alive(&enemy_first_role, &enemy_roles)) {
            print(&utf8(b"I lose"));
            chess.lose = chess.lose + 1;
            event::emit(FightEvent {
                chess_id: object::id_address(chess),
                v1: tx_context::sender(ctx),
                v1_name: chess.name,
                v1_win: chess.win,
                v1_lose: chess.lose,
                v2_name: lineup::get_name(enemy_lineup),
                v2_lineup:*enemy_lineup,
                res: 2
            });
            chess.lineup = my_lineup_permanent;
            false
        } else {
            print(&utf8(b"I win, my left lineup:"));
            chess.win = chess.win + 1;
            event::emit(FightEvent {
                chess_id: object::id_address(chess),
                v1: tx_context::sender(ctx),
                v1_name: chess.name,
                v1_win: chess.win,
                v1_lose: chess.lose, 
                v2_name: lineup::get_name(enemy_lineup),
                v2_lineup:*enemy_lineup,
                res: 1
            });
            chess.lineup = my_lineup_permanent;
            true
        }
    }

    fun combat(my_lineup_fight: &mut LineUp, my_lineup_permanent: &mut LineUp, enemy_lineup_fight: &mut LineUp, role1:&mut role::Role, role2:&mut role::Role) {
        let enemy_lineup_permnent = copy enemy_lineup_fight;

        // todo: for test : before start, call the effect skill
        effect::call_my_effect(role1, my_lineup_fight, my_lineup_permanent, enemy_lineup_fight);
        effect::call_enemy_effect(role2, enemy_lineup_fight, my_lineup_fight);

        let life1 = role::get_life(role1);
        let life2 = role::get_life(role2);

        let attack1 = role::get_attack(role1);
        let attack2 = role::get_attack(role2);
        while (life1 != 0 && life2 != 0) {
            if (life1 > attack2 && attack1 >= life2) {
                role::set_life(role1, life1 - attack2);
                role::set_life(role2, 0);
            } else if (life2 > attack1 && attack2 >= life1) {
                role::set_life(role1, 0);
                role::set_life(role2, life2 - attack1);
            } else if (life1 > attack2 && life2 > attack1) {
                role::set_life(role1, life1 - attack2);
                role::set_life(role2, life2 - attack1);
            } else if (attack1 >= life2 && attack2 >= life1) {
                role::set_life(role1, 0);
                role::set_life(role2, 0);
            } else {};
            life1 = role::get_life(role1);
            life2 = role::get_life(role2);
        };
    }

    public fun get_total_chesses(global: &Global) : u64 {
        global.total_chesses
    }
     
    public fun get_total_matches(global: &Global) : u64 {
        global.total_match
    }

    public fun get_total_shui_amount(global: &Global) : u64 {
        balance::value(&global.balance_SUI)
    }

    fun estimate_reward(global: &Global, win:u8, lose:u8) : u64 {
        let base_price = (win as u64) * 300_000_000;
        let max_reward = get_total_shui_amount(global) * 9 / 10;
        if (base_price > max_reward) {
            base_price = max_reward;
        };
        base_price
    }

    public fun withdraw(amount:u64, global: &mut Global, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @account, ERR_NOT_PERMISSION);
        let sui_balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }
}