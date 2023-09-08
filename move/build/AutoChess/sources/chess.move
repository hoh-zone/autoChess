module auto_chess::chess {
    // use auto_chess::role;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use std::string::{utf8, String, Self};
    use auto_chess::lineup::{Self, LineUp};
    use std::vector;
    use std::debug::print;
    use auto_chess::role;
    use auto_chess::utils;

    const INIT_LIFE:u64 = 3;
    const INIT_GOLD:u64 = 10;
    const REFRESH_PRICE:u64 = 3;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;
    const ERR_EXCEED_NUM_LIMIT:u64 = 0x02;

    struct Global has key {
        id: UID,
        total_chesses: u64,
        total_match:u64,
    }

    struct Chess has key, store {
        id:UID,
        name:String,
        lineup: LineUp,
        cards_pool: LineUp,
        gold: u64,
        refresh_price: u64,
        life: u64,
        win: u8,
        lose: u8,
        even: u8,
        creator: address
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0
        };
        transfer::share_object(global);
    }

    
    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
        };
        transfer::share_object(global);
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
            life: INIT_LIFE,
            win: 0,
            lose: 0,
            even: 0,
            creator: sender
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    public entry fun operate_my_chess(role_global:&role::Global, gold:u64, lineup_str_vec: vector<String>, chess:&mut Chess, ctx:&mut TxContext) {
        // todo: for safety, verify the data.
        assert!(vector::length(&lineup_str_vec) <= 7, ERR_EXCEED_NUM_LIMIT);
        chess.gold = gold;
        chess.lineup = lineup::parse_lineup_str_vec(chess.name, role_global, lineup_str_vec, ctx);
    }

    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    public fun match(global: &mut Global, role_global:&role::Global, lineup_global:&lineup::Global, chess:&mut Chess, ctx: &mut TxContext) {
        print(&utf8(b"start match chess"));
        assert!(chess.life > 0, ERR_YOU_ARE_DEAD);

        // match an enemy config
        let lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, ctx);

        // fight
        fight(chess, &lineup);

        // record
        if (chess.life > 0) {
            refresh_cards_pools(role_global, chess, ctx);
        };
        chess.gold = INIT_GOLD;
        global.total_match = global.total_match + 1;
        print(&utf8(b"match finish"));
    }

    fun refresh_cards_pools(role_global:&role::Global, chess:&mut Chess, ctx:&mut TxContext) {
        let seed = 20;
        chess.cards_pool = lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(chess.win,chess.lose), ctx);
    }

    public fun fight(chess: &mut Chess, enemy_lineup: &LineUp):bool {
        print(&utf8(b"enemy lineup"));
        print(enemy_lineup);
        let my_lineup = &chess.lineup;
        let my_roles = *lineup::get_roles(my_lineup);
        let my_num = vector::length(&my_roles);
        let enemy_roles = *lineup::get_roles(enemy_lineup);
        let enemy_num = vector::length(&enemy_roles);
        if (my_num == 0) {
            return false
        };
        let my_first_role = role::empty();
        let enemy_first_role = role::empty();
        while (true) {
            if (vector::length(&my_roles) == 0 && role::get_defense(&my_first_role) == 0) {
                print(&utf8(b"I lose"));
                chess.lose = chess.lose + 1;
                chess.life = chess.life - 1;
                return false
            };
            if (vector::length(&enemy_roles) == 0 && role::get_defense(&enemy_first_role) == 0) {
                chess.win = chess.win + 1;
                print(&utf8(b"I win, my left lineup:"));
                print(&my_first_role);
                print(&my_roles);
                return true
            };
            if (role::get_defense(&my_first_role) == 0) {
                my_first_role = vector::pop_back(&mut my_roles);
            };
            if (role::get_defense(&enemy_first_role) == 0) {
                enemy_first_role = vector::pop_back(&mut enemy_roles);
            };
            combat(&mut my_first_role, &mut enemy_first_role);
        };
        false
    }

    fun combat(role1:&mut role::Role, role2:&mut role::Role) {
        let defense1 = 1;
        let defense2 = 1;
        let attack1 = role::get_attack(role1);
        let attack2 = role::get_attack(role2);
        while (defense1 != 0 && defense2 != 0) {
            defense1 = role::get_defense(role1);
            defense2 = role::get_defense(role2);
            if (defense1 < attack2) {
                role::set_defense(role1, 0);
                break
            } else {
                role::set_defense(role1, defense1 - attack2);
            };
            if (defense2 < attack1) {
                role::set_defense(role2, 0);
                break
            } else {
                role::set_defense(role2, defense2 - attack1);
            };
        };
    }

    public fun get_total_chesses(global: &Global) : u64 {
        global.total_chesses
    }
     
    public fun get_total_matches(global: &Global) : u64 {
        global.total_match
    }
}