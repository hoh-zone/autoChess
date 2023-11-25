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
    use auto_chess::challenge;

    use sui::sui::SUI;
    use auto_chess::verify;
  
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
    const ERR_CHECK_ROLES_NOT_EQUAL:u64 = 0x10;
    const ERR_WRONG_LEFT_GOLD:u64 = 0x11;
    const INVALID_INDEX:u64 = 10000;

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
        challenge_win:u8,
        challenge_lose:u8,
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
            challenge_win:0,
            challenge_lose:0,
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
            challenge_win:0,
            challenge_lose:0,
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
        let Chess {id, name, lineup, cards_pool, gold, refresh_price, win, lose, challenge_win, challenge_lose, even, creator, arena} = chess;
        let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
        object::delete(id);
    }

    public entry fun operate_and_match(global:&mut Global, role_global:&role::Global, lineup_global:&mut lineup::Global, challengeGlobal:&mut challenge::Global, chess:&mut Chess, operations: vector<String>, left_gold:u8, lineup_str_vec: vector<String>, ctx:&mut TxContext) {
        assert!(vector::length(&lineup_str_vec) == 6, ERR_EXCEED_NUM_LIMIT);
        let init_lineup = *&chess.lineup;
        let init_roles = lineup::get_mut_roles(&mut init_lineup);
        let cards_pool = chess.cards_pool;
        let cards_pool_roles = lineup::get_mut_roles(&mut cards_pool);
        verify::verify_operation(role_global, init_roles, cards_pool_roles, operations, left_gold, lineup_str_vec, chess.name, (chess.gold as u8), ctx);
        let expected_lineup = lineup::parse_lineup_str_vec(chess.name, role_global, lineup_str_vec, ctx);
        if (chess.challenge_win + chess.challenge_lose >= 20) {
            // prevent from unlimited strength upon its lineup
            chess.gold = 0;
        } else {
            chess.gold = INIT_GOLD;
        };
        chess.lineup = expected_lineup;
        match(role_global, lineup_global, challengeGlobal, chess, ctx);
        global.total_match = global.total_match + 1;
        print(&utf8(b"match finish"));
    }

    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    fun match(role_global:&role::Global, lineup_global:&mut lineup::Global, challengeGlobal:&mut challenge::Global, chess:&mut Chess, ctx: &mut TxContext) {
        print(&utf8(b"start match chess"));
        assert!(chess.lose <= 2, ERR_YOU_ARE_DEAD);

        // match an enemy config
        let enemy_lineup;
        let chanllenge_on = false;
        if (chess.win >= 10) {
            assert!(chess.challenge_lose <= 2, ERR_YOU_ARE_DEAD);
            chanllenge_on = true;
            enemy_lineup = challenge::get_linup_by_rank(challengeGlobal, (19 - chess.challenge_win));
        } else {
            enemy_lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, chess.arena, ctx);
        };

        // fight and record lineup
        if (fight(chess, &mut enemy_lineup, ctx)) {
            if (chanllenge_on) {
                chess.challenge_win = chess.challenge_win + 1;
                challenge::rank_forward(challengeGlobal, chess.lineup, 20 - chess.challenge_win);
            } else {
                lineup::record_player_lineup(chess.win - 1, chess.lose, lineup_global, chess.lineup, chess.arena);
                if (chess.win == 10) {
                    lineup::record_player_lineup(chess.win, chess.lose, lineup_global, chess.lineup, chess.arena);
                };
            };
        } else {
            if (chanllenge_on) {
                chess.challenge_lose = chess.challenge_lose + 1;
            } else {
                lineup::record_player_lineup(chess.win, chess.lose - 1, lineup_global, chess.lineup, chess.arena);
            }
        };
        if (chess.lose <= 2) {
            refresh_cards_pools(role_global, chess, ctx);
        };
    }

    fun refresh_cards_pools(role_global:&role::Global, chess:&mut Chess, ctx:&mut TxContext) {
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


    fun call_skill(role_index:u64, role: &mut Role, enemy_role_index:u64, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>, my_lineup_permanent: &mut LineUp) {
        let effect = role::get_effect(role);
        let effect_value = role::get_effect_value(role);

        print(&utf8(b"skill"));
        print(&effect);

        let is_forbid_buff = false;
        let is_forbid_debuff = false;

        let i = 0;
        let enemy_len = vector::length(enemy_roles);
        let my_len = vector::length(my_roles);
        while (i < enemy_len) {
            let role = vector::borrow(enemy_roles, i);
            let effect = role::get_effect(role);
            if (effect == utf8(b"forbid_buff")) {
                is_forbid_buff = true;
            };
            if (effect == utf8(b"forbid_debuff")) {
                is_forbid_debuff = true;
            };
            if (is_forbid_buff && is_forbid_debuff) {
                break
            };
            i = i + 1;
        };

        if (effect == utf8(b"aoe")) {
            let attack = utils::utf8_to_u64(effect_value);
            let i = 0;
            safe_attack(attack, enemy_role);
            while (i < enemy_len) {
                let char = vector::borrow_mut(enemy_roles, i);
                safe_attack(attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_hp")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_hp = utils::utf8_to_u64(effect_value);
            let life = role::get_life(role);
            role::set_life(role, life + add_hp);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                safe_add_hp(add_hp, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_attack")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_attack = utils::utf8_to_u64(effect_value);
            let attack = role::get_life(role);
            role::set_attack(role, attack + add_attack);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                safe_add_attack(add_attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_magic")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_magic = (utils::utf8_to_u64(effect_value) as u8);
            let magic = role::get_magic(role);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                let magic = role::get_magic(char);
                role::set_magic(char, magic + add_magic);
                i = i + 1;
            };
        } else if (effect == utf8(b"all_max_hp_to_back1")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_hp = utils::utf8_to_u64(effect_value);
            let roles = lineup::get_mut_roles(my_lineup_permanent);
            if (role_index == 5) {
                return
            };
            let back_char = vector::borrow_mut(roles, role_index + 1);
            let life = role::get_life(back_char);
            role::set_life(back_char, life + add_hp);
        } else if (effect == utf8(b"reduce_tmp_attack")) {
            if (is_forbid_debuff) {
                print(&utf8(b"debuff forbiden"));
                return
            };
            let reduce_attack = utils::utf8_to_u64(effect_value);
            safe_reduce_attack(reduce_attack, enemy_role);
        } else if (effect == utf8(b"reduce_all_tmp_attack")) {
            if (is_forbid_debuff) {
                print(&utf8(b"debuff forbiden"));
                return
            };
            let reduce_attack = utils::utf8_to_u64(effect_value);
            safe_reduce_attack(reduce_attack, enemy_role);
            let i = 0;
            while (i < enemy_len) {
                let char = vector::borrow_mut(enemy_roles, i);
                safe_reduce_attack(reduce_attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"attack_sputter_to_second_by_percent")) {
            let percent_by_ten = utils::utf8_to_u64(effect_value);
            let base_attack = role::get_attack(role);
            let suppter_attack = base_attack * percent_by_ten / 10;
            safe_attack(base_attack, enemy_role);
            if (vector::length(enemy_roles) == 0) {
                return
            };
            let next_one = vector::borrow_mut(enemy_roles, 0);
            safe_attack(suppter_attack, next_one);
        } else if (effect == utf8(b"attack_last_char")) {
            let effect_attack = utils::utf8_to_u64(effect_value);
            if (vector::length(enemy_roles) == 0) {
                safe_attack(effect_attack, enemy_role);
            } else {
                let last_one = vector::borrow_mut(enemy_roles, enemy_len - 1);
                safe_attack(effect_attack, last_one);
            }
        } else if (effect == utf8(b"attack_lowest_hp")) {
            let attack = utils::utf8_to_u64(effect_value);
            let role = find_lowest_life_one(enemy_role, enemy_roles);
            safe_attack(attack, role);
        } else if (effect == utf8(b"attack_by_life_percent")) {
            let value = utils::utf8_to_u64(effect_value);
            let enemy_life = role::get_life(enemy_role);
            let base_attack = role::get_attack(role);
            let extra_attack = enemy_life * value / 10;
            safe_attack(base_attack + extra_attack, role);
        } 
    }

    fun find_lowest_life_one(default_role: &mut Role, roles: &mut vector<Role>) : &mut Role {
        let min_hp = INVALID_INDEX;
        let min_hp_index = INVALID_INDEX;
        let len = vector::length(roles);
        if (len == 0) {
            return default_role
        };
        let i = 0;
        while(i < len) {
            let role = vector::borrow(roles, i);
            let life = role::get_life(role);
            if (life > 0 && life < min_hp) {
                min_hp = life;
                min_hp_index = i;
            };
            i = i + 1;
        };
        if (min_hp_index != INVALID_INDEX) {
            return vector::borrow_mut(roles, min_hp_index)
        };
        return default_role
    }

    fun safe_reduce_attack(reduce_value:u64, role: &mut Role) {
        let char_life = role::get_life(role);
        let char_attack = role::get_attack(role);
        if (char_life == 0) {
            return
        };
        if (char_attack <= reduce_value) {
            role::set_attack(role, 1);
        } else {
            role::set_attack(role, char_attack - reduce_value);
        }
    }

    fun safe_add_attack(add_value:u64, role: &mut Role) {
        let char_life = role::get_life(role);
        let char_attack = role::get_attack(role);
        if (char_life == 0) {
            return
        };
        role::set_attack(role, char_attack + add_value);
    }

    fun safe_add_hp(add_value:u64, role: &mut Role) {
        let char_life = role::get_life(role);
        if (char_life == 0) {
            return
        };
        role::set_life(role, char_life + add_value);
    }

    fun safe_attack(attack:u64, other_role:&mut Role) {
        let other_life = role::get_life(other_role);
        if (other_life <= attack) {
            role::set_life(other_role, 0);
            print(&role::get_name(other_role));
            print(&utf8(b"is dead"));
        } else {
            role::set_life(other_role, other_life - attack);
        };
        print(&role::get_name(other_role));
        print(&utf8(b"before after life:"));
        print(&other_life);
        print(&role::get_life(other_role));
    }

    fun call_attack(role: &Role, other_role: &mut Role) {
        let attack = role::get_attack(role);
        let name = role::get_name(other_role);
        let life = role::get_life(other_role);
        safe_attack(attack, other_role);
        life = role::get_life(other_role);
    }

    fun action(role_index:u64, role: &mut Role, enemy_role_index:u64, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>, my_lineup_permanent: &mut LineUp) {
        let extra_max_magic_debuff = get_extra_max_magic_debuff(enemy_roles);
        let max_magic = role::get_max_magic(role);
        let magic = role::get_magic(role);
        if (magic >= (max_magic + extra_max_magic_debuff) && role::get_effect_type(role) == utf8(b"skill")) {
            print(&utf8(b"skill:"));
            print(&role::get_effect(role));
            call_skill(role_index, role, enemy_role_index, enemy_role, my_roles, enemy_roles, my_lineup_permanent);
            role::set_magic(role, 0);
        } else {
            print(&utf8(b"attack:"));
            print(&role::get_attack(role));
            call_attack(role, enemy_role);
            role::set_magic(role, magic + 1);
        };
    }

    #[test_only]
    public fun test_fight(my_lineup_fight: LineUp, enemy_lineup: LineUp):bool {
        // backup to avoid base_life to be changed
        let enemy_lineup_fight = *&enemy_lineup;
        let my_lineup_permanent = &mut *&my_lineup_fight;
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
        while (some_alive(&my_first_role, &my_roles) && some_alive(&enemy_first_role, &enemy_roles)) {
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
                print(&utf8(b"we action:"));
                print(&role::get_name(&my_first_role));
                action(my_fist_role_index, &mut my_first_role, enemy_first_role_index, &mut enemy_first_role, &mut my_roles, &mut enemy_roles, my_lineup_permanent);
                print(&utf8(b"enemy action:"));
                print(&role::get_name(&enemy_first_role));
                action(enemy_first_role_index, &mut enemy_first_role, my_fist_role_index, &mut my_first_role, &mut enemy_roles, &mut my_roles, my_lineup_permanent);
            };
        };

        if (some_alive(&enemy_first_role, &enemy_roles)) {
            print(&utf8(b"I lose"));
            false
        } else {
            print(&enemy_roles);
            print(&utf8(b"I win"));
            true
        }
    }

    public fun fight(chess: &mut Chess, enemy_lineup: &mut LineUp, ctx:&mut TxContext):bool {
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
        while (some_alive(&my_first_role, &my_roles) && some_alive(&enemy_first_role, &enemy_roles)) {
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
                action(my_fist_role_index, &mut my_first_role, enemy_first_role_index, &mut enemy_first_role, &mut my_roles, &mut enemy_roles, my_lineup_permanent);
                action(enemy_first_role_index, &mut enemy_first_role, my_fist_role_index, &mut my_first_role, &mut enemy_roles, &mut my_roles, my_lineup_permanent);
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
            true
        }
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