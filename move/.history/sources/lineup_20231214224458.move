module auto_chess::lineup {
    use sui::tx_context::{Self, TxContext};
    use std::vector::{Self};
    use sui::table::{Self, Table};
    use sui::transfer;
    use auto_chess::role::{Role, Self};
    use sui::object::{Self, UID};
    use std::string::{Self, utf8, String};
    use auto_chess::utils;
    friend auto_chess::challenge;

    const ERR_WRONG_ROLES_NUMBER:u64 = 0x01;
    const ERR_TAG_NOT_IN_TABLE:u64 = 0x02;

    struct Global has key {
        id: UID,

        // used for fight
        lineup_pools: Table<String, vector<LineUp>>,

        arena_lineup_pools: Table<String, vector<LineUp>>,
    }

    struct LineUp has store, copy, drop {
        creator: address,
        name:String,
        role_num: u64,
        roles: vector<Role>,
        price: u64,
        hash: vector<u8>
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            lineup_pools: table::new<String, vector<LineUp>>(ctx),
            arena_lineup_pools: table::new<String, vector<LineUp>>(ctx)
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            lineup_pools : table::new<String, vector<LineUp>>(ctx),
            arena_lineup_pools: table::new<String, vector<LineUp>>(ctx)
        };
        transfer::share_object(global);
    }

    public fun empty(ctx: &mut TxContext) : LineUp {
        let vec = vector::empty<Role>();
        let i = 0;
        let seed = 12;
        while (i < 6) {
            vector::push_back(&mut vec, role::empty());
            i = i + 1;
        };
        LineUp {
            creator: tx_context::sender(ctx),
            name:utf8(b""),
            role_num: 0,
            roles: vec,
            price: 0,
            hash: utils::seed(ctx, seed)
        }
    }

    public fun generate_random_cards(role_global:&role::Global, power:u64, ctx:&mut TxContext) : LineUp {
        let max_cards = 30;
        let vec = vector::empty<Role>();
        let seed = 20;
        while (max_cards != 0) {
            seed = seed + 1;
            let role = role::create_random_role_for_cards(role_global, seed, ctx);
            vector::push_back(&mut vec, role);
            max_cards = max_cards - 1;
        };
        LineUp {
            creator: tx_context::sender(ctx),
            name:utf8(b"random cards pool"),
            role_num: vector::length(&vec),
            roles: vec,
            price: 0,
            hash: utils::seed(ctx, seed)
        }
    }

    public fun record_player_lineup(win:u8, lose:u8, global:&mut Global, lineup:LineUp, is_arena: bool) {
        let lineup_pool_tag = utils::get_pool_tag(win, lose);
        if (is_arena) {
            if (table::contains(&global.arena_lineup_pools, lineup_pool_tag)) {
                let lineup_vec = table::borrow_mut(&mut global.arena_lineup_pools, lineup_pool_tag);
                if (vector::length(lineup_vec) > 10) {
                    vector::remove(lineup_vec, 0);
                    vector::push_back(lineup_vec, lineup);
                } else {
                    vector::push_back(lineup_vec, lineup);
                };
            } else {
                let lineup_vec = vector::empty<LineUp>();
                vector::push_back(&mut lineup_vec, lineup);
                table::add(&mut global.arena_lineup_pools, lineup_pool_tag, lineup_vec);
            };
        } else {
            if (table::contains(&global.lineup_pools, lineup_pool_tag)) {
                let lineup_vec = table::borrow_mut(&mut global.lineup_pools, lineup_pool_tag);
                if (vector::length(lineup_vec) > 10) {
                    vector::remove(lineup_vec, 0);
                    vector::push_back(lineup_vec, lineup);
                } else {
                    vector::push_back(lineup_vec, lineup);
                };
            } else {
                let lineup_vec = vector::empty<LineUp>();
                vector::push_back(&mut lineup_vec, lineup);
                table::add(&mut global.lineup_pools, lineup_pool_tag, lineup_vec);
            };
        };

    }

    public fun select_random_lineup(win:u8, lose:u8, global:&Global, is_arena:bool, ctx: &mut TxContext) : LineUp {
        let seed = 10;
        let lineup_pool_tag = utils::get_pool_tag(win, lose);
        let vec;
        if (is_arena) {
            if (table::contains(&global.arena_lineup_pools, lineup_pool_tag)) {
                let lineup_vec = table::borrow(&global.arena_lineup_pools, lineup_pool_tag);
                vec = *lineup_vec;
            } else {
                let tag = utils::u8_to_string(win);
                string::append(&mut tag, utf8(b"-0"));
                let lineup_vec = table::borrow(&global.arena_lineup_pools, tag);
                vec = *lineup_vec;
            };
        } else {
            if (table::contains(&global.lineup_pools, lineup_pool_tag)) {
                let lineup_vec = table::borrow(&global.lineup_pools, lineup_pool_tag);
                vec = *lineup_vec;
            } else {
                let tag = utils::u8_to_string(win);
                string::append(&mut tag, utf8(b"-0"));
                let lineup_vec = table::borrow(&global.lineup_pools, tag);
                vec = *lineup_vec;
            };
        };

        let len = vector::length(&vec);
        let random = utils::get_random_num(0, len, seed, ctx);
        let index = random % len;
        *vector::borrow(&vec, index)
    }

    public fun init_lineup_pools(global: &mut Global, roleGlobal: &role::Global, ctx: &mut TxContext) {
        let win = 0;
        let lose = 0;
        while (win < 10) {
            while (true) {
                let seed:u8 = 1;
                let tag = utils::get_pool_tag(win, lose);
                let power = utils::get_lineup_power_by_tag(win, lose);
                let vec = vector::empty<LineUp>();
                let lineup = generate_lineup_by_power(roleGlobal, power, seed, ctx);
                vector::push_back(&mut vec, lineup);
                assert!(!table::contains(&global.lineup_pools, tag), ERR_TAG_NOT_IN_TABLE);
                assert!(!table::contains(&global.arena_lineup_pools, tag), ERR_TAG_NOT_IN_TABLE);
                table::add(&mut global.lineup_pools, tag, vec);
                table::add(&mut global.arena_lineup_pools, tag, vec);
                lose = lose + 1;
                if (lose == 3) {
                    lose = 0;
                    break
                };
            };
            win = win + 1;
        };
    }

    public(friend) fun generate_lineup_by_power(roleGlobal:&role::Global, power:u64, seed:u8, ctx: &mut TxContext) : LineUp {
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
            roles: roles,
            price: 0,
            hash: utils::seed(ctx, seed)
        }
    }

    public fun get_fight_info(lineup:&LineUp):(u64, u64) {
        let vec = lineup.roles;
        let (i, len) = (0u64, vector::length(&vec));
        let all_attacks = 0;
        let all_life = 0;
        while (i < len) {
            // drop fragments
            let role:&Role = vector::borrow(&vec, i);
            all_attacks = all_attacks + role::get_attack(role);
            all_life = all_life + role::get_life(role);
            i = i + 1;
        };
        (all_attacks, all_life)
    }

    public fun parse_lineup_str_vec(name:String, role_global:&role::Global, str_vec:vector<String>, price:u64, ctx:&mut TxContext) : LineUp {
        let len = vector::length(&str_vec);
        let vec = vector::empty<Role>();
        assert!(len == 6, ERR_WRONG_ROLES_NUMBER);
        vector::reverse<String>(&mut str_vec);
        while (len > 0) {
            // priest1:10:3:1' (namex_y-level:life:attack)
            let role_info = vector::pop_back(&mut str_vec);
            if (string::length(&role_info) == 0) {
                vector::push_back(&mut vec, role::empty());
                len = len - 1;
                continue
            };
            let index = string::index_of(&role_info, &utf8(b":"));
            let role_name_with_level = string::sub_string(&role_info, 0, index);
            let level_index = string::index_of(&role_name_with_level, &utf8(b"-"));
            let role_name = string::sub_string(&role_name_with_level, 0, level_index);
            let level = utils::utf8_to_u64(string::sub_string(&role_name_with_level, level_index + 1, string::length(&role_name_with_level)));
            let property = string::sub_string(&role_info, index + 1, string::length(&role_info));
            let second_index = string::index_of(&property, &utf8(b":"));
            let attack = utils::utf8_to_u64(string::sub_string(&property, 0, second_index));
            let life = utils::utf8_to_u64(string::sub_string(&property, second_index + 1, string::length(&property)));
            let role = role::get_role_by_name(role_global, role_name);
            role::set_life(&mut role, life);
            role::set_attack(&mut role, attack);
            role::set_level(&mut role, (level as u8));
            vector::push_back(&mut vec, role);
            len = len - 1;
        };
        LineUp {
            creator:tx_context::sender(ctx),
            name: name,
            role_num:len,
            roles: vec,
            price: price,
            hash: utils::seed(ctx, 123)
        }
    }

    public fun get_roles(lineup:&LineUp): &vector<Role> {
        &lineup.roles
    }

    public fun get_mut_roles(lineup:&mut LineUp) : &mut vector<Role>{
        &mut lineup.roles
    }

    public fun get_name(lineup:&LineUp): String {
        *&lineup.name
    }

    public fun get_creator(lineup:&LineUp): address {
        *&lineup.creator
    }

    public fun get_price(lineup:&LineUp): u64 {
        *&lineup.price
    }

    public fun get_hash(lineup:&LineUp): vector<u8> {
        lineup.hash
    }

    public fun set_hash(lineup:&mut LineUp, hash:vector<u8>) {
        lineup.hash = hash;
    }
}