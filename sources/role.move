module auto_chess::role {
    use std::string::{utf8, String};
    use sui::tx_context::{Self, TxContext};
    use std::debug::print;
    use sui::object::{UID, Self};
    use sui::transfer::{Self};
    use sui::hash;
    use std::vector;
    use sui::bcs;
    use sui::vec_map::{Self, VecMap};
    use auto_chess::utils;
    friend auto_chess::chess;
    friend auto_chess::lineup;

    struct Global has key {
        id: UID,
        charactors: VecMap<String, Role>
    }

    struct Role has store, copy, drop {
        name:String,
        attack: u64,
        defense: u64,
        level: u8,
        price: u8,
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: vec_map::empty<String, Role>()
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: vec_map::empty<String, Role>()
        };
        transfer::share_object(global);
    }

    public fun init_charactos(global: &mut Global) {
        vec_map::insert(&mut global.charactors, utf8(b"warrior1"), Role {name:utf8(b"warrior1"), attack:4, defense:25, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"warrior2"), Role {name:utf8(b"warrior2"), attack:6, defense:30, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"warrior3"), Role {name:utf8(b"warrior3"), attack:8, defense:40, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1"), Role {name:utf8(b"wizard1"), attack:7, defense:15, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2"), Role {name:utf8(b"wizard2"), attack:10, defense:20, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"wizard3"), Role {name:utf8(b"wizard3"), attack:14, defense:25, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"priest1"), Role {name:utf8(b"priest1"), attack:2, defense:30, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"priest2"), Role {name:utf8(b"priest2"), attack:4, defense:45, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"priest3"), Role {name:utf8(b"priest3"), attack:6, defense:60, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"assassin1"), Role {name:utf8(b"assassin1"), attack:5, defense:18, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"assassin2"), Role {name:utf8(b"assassin2"), attack:7, defense:25, level:1, price:1});
        vec_map::insert(&mut global.charactors, utf8(b"assassin3"), Role {name:utf8(b"assassin3"), attack:9, defense:30, level:1, price:1});
    }

    public fun empty() : Role {
        Role {
            name:utf8(b"none"),
            attack: 0,
            defense: 0,
            level: 0,
            price: 0,
        }
    }

    fun random_select_role_by_level(global: &Global, level:u64, random: u64, ctx:&mut TxContext):Role {
        let max_roles_per_level = vec_map::size(&global.charactors) / 3;
        let index = random % max_roles_per_level;
        if (level == 1) {
            let (name, role) = vec_map::get_entry_by_idx(&global.charactors, 3 * index);
            *role
        } else if (level ==2) {
           let (name, role) = vec_map::get_entry_by_idx(&global.charactors, 1 + 3 * index);
            *role
        } else {
            let (name, role) = vec_map::get_entry_by_idx(&global.charactors, 2 + 3 * index);
            *role
        }
    }

    public(friend) fun create_random_role_for_lineup(global: &Global, seed:u8, p2:u64, p3:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p3) {
            random_select_role_by_level(global, 3, random, ctx)
        } else if (random < p2) {
            random_select_role_by_level(global, 2, random, ctx)
        } else {
            random_select_role_by_level(global, 1, random, ctx)
        }
    }

    public(friend) fun create_random_role_for_cards(global: &Global, seed:u8, p2:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p2) {
            random_select_role_by_level(global, 2, random, ctx)
        } else {
            random_select_role_by_level(global, 1, random, ctx)
        }
    }

    public fun get_role_by_name(global:&Global, name:String) : Role {
        *vec_map::get(&global.charactors, &name)
    }

    public fun get_attack(role:&Role) : u64 {
        role.attack
    }

    public fun get_defense(role:&Role) : u64 {
        role.defense
    }

    public fun get_level(role:&Role) : u8 {
        role.level
    }

    public fun set_defense(role:&mut Role, defense:u64) {
        role.defense = defense;
    }
}