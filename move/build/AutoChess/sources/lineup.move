module auto_chess::lineup {
    use sui::tx_context::{Self, TxContext};
    use std::vector::{Self};
    use sui::table::{Self, Table};
    use sui::transfer;
    use auto_chess::role::{Role, Self};
    use sui::object::{Self, UID};
    use std::string::{Self, utf8, String};
    use auto_chess::utils;
    use std::debug::print;

    struct Global has key {
        id: UID,
        // used for fight
        lineup_pools: Table<String, vector<LineUp>>,
    }

    struct LineUp has store, copy, drop {
        creator: address,
        name:String,
        role_num: u64,
        roles: vector<Role>
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            lineup_pools: table::new<String, vector<LineUp>>(ctx)
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            lineup_pools : table::new<String, vector<LineUp>>(ctx)
        };
        transfer::share_object(global);
    }

    public fun empty(ctx: &mut TxContext) : LineUp {
        LineUp {
            creator: tx_context::sender(ctx),
            name:utf8(b""),
            role_num: 0,
            roles: vector::empty<Role>()
        }
    }

    public fun generate_random_cards(role_global:&role::Global, power:u64, ctx:&mut TxContext) : LineUp {
        let max_cards = 20;
        let vec = vector::empty<Role>();
        let p2 = utils::get_cards_level2_prop_by_lineup_power(power);
        let seed = 20;
        while (max_cards != 0) {
            seed = seed + 1;
            let role = role::create_random_role_for_cards(role_global, seed, p2, ctx);
            vector::push_back(&mut vec, role);
            max_cards = max_cards - 1;
        };
        LineUp {
            creator: tx_context::sender(ctx),
            name:utf8(b"random cards pool"),
            role_num: vector::length(&vec),
            roles: vec
        }
    }

    public fun select_random_lineup(win:u8, lose:u8, global:&Global, ctx: &mut TxContext) : LineUp {
        let seed = 10;
        let lineup_pool_tag = utils::get_pool_tag(win, lose);
        let vec;
        if (table::contains(&global.lineup_pools, lineup_pool_tag)) {
            let lineup_vec = table::borrow(&global.lineup_pools, lineup_pool_tag);
            vec = *lineup_vec;
        } else {
            let tag = utils::u8_to_string(win);
            string::append(&mut tag, utf8(b"-0"));
            let lineup_vec = table::borrow(&global.lineup_pools, tag);
            vec = *lineup_vec;
        };
        let len = vector::length(&vec);
        let random = utils::get_random_num(0, len, seed, ctx);
        let index = random % len;
        *vector::borrow(&vec, index)
    }

    public fun init_lineup_pools(global: &mut Global, roleGlobal: &role::Global, ctx: &mut TxContext) {
        // todo:too much calculation
        let win = 0;
        let lose = 0;
        while (win < 9) {
            while (true) {
                // todo: add win lose linup here
                let duplicate_num = 2;
                let seed:u8 = 1;
                let tag = utils::get_pool_tag(win, lose);
                let power = utils::get_lineup_power_by_tag(win, lose);
                let vec = vector::empty<LineUp>();
                while (duplicate_num > 0) {
                    let lineup = generate_lineup_by_power(roleGlobal, power, seed, ctx);
                    vector::push_back(&mut vec, lineup);
                    duplicate_num = duplicate_num - 1;
                };
                assert!(!table::contains(&global.lineup_pools, tag), 0x01);
                table::add(&mut global.lineup_pools, tag, vec);
                lose = lose + 1;
                if (lose == 3) {
                    lose = 0;
                    break
                };
            };
            win = win + 1;
        };
    }

    public fun generate_lineup_by_power(roleGlobal:&role::Global, power:u64, seed:u8, ctx: &mut TxContext) : LineUp {
        let max_role_num = utils::get_role_num_by_lineup_power(power);
        let roles = vector::empty<Role>();
        let p2 = utils::get_lineup_level2_prop_by_lineup_power(power);
        let p3 = utils::get_lineup_level3_prop_by_lineup_power(power);
        while (max_role_num > 0) {
            let role = role::create_random_role_for_lineup(roleGlobal, seed, p2, p3, ctx);
            vector::push_back(&mut roles, role);
            max_role_num = max_role_num - 1;
        };
        LineUp {
            creator:tx_context::sender(ctx),
            name: utf8(b"I'm a super robot"),
            role_num:max_role_num,
            roles: roles
        }
    }

    public fun get_fight_info(lineup:&LineUp):(u64, u64) {
        let vec = lineup.roles;
        let (i, len) = (0u64, vector::length(&vec));
        let all_attacks = 0;
        let all_defense = 0;
        while (i < len) {
            // drop fragments
            let role:&Role = vector::borrow(&vec, i);
            all_attacks = all_attacks + role::get_attack(role);
            all_defense = all_defense + role::get_defense(role);
            i = i + 1;
        };
        (all_attacks, all_defense)
    }

    public fun parse_lineup_str_vec(name:String, role_global:&role::Global, str_vec:vector<String>, ctx:&mut TxContext) : LineUp {
        let len = vector::length(&str_vec);
        let vec = vector::empty<Role>();
        while (len > 0) {
            let role_name = vector::pop_back(&mut str_vec);
            let role = role::get_role_by_name(role_global, role_name);
            vector::push_back(&mut vec, role);
            len = len - 1;
        };
        LineUp {
            creator:tx_context::sender(ctx),
            name: name,
            role_num:len,
            roles: vec
        }
    }

    public fun get_roles(lineup:&LineUp): &vector<Role> {
        &lineup.roles
    }

    public fun get_name(lineup:&LineUp): String {
        *&lineup.name
    }
}