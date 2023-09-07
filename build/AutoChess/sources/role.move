module auto_chess::role {
    use std::string::{Self, utf8, String};
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
        defense: u64
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
        vec_map::insert(&mut global.charactors, utf8(b"warrior1"), Role {name:utf8(b"warrior1"), attack:4, defense:25});
        vec_map::insert(&mut global.charactors, utf8(b"warrior2"), Role {name:utf8(b"warrior2"), attack:6, defense:30});
        vec_map::insert(&mut global.charactors, utf8(b"warrior3"), Role {name:utf8(b"warrior3"), attack:8, defense:40});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1"), Role {name:utf8(b"wizard1"), attack:7, defense:15});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2"), Role {name:utf8(b"wizard2"), attack:10, defense:20});
        vec_map::insert(&mut global.charactors, utf8(b"wizard3"), Role {name:utf8(b"wizard3"), attack:14, defense:25});
        vec_map::insert(&mut global.charactors, utf8(b"priest1"), Role {name:utf8(b"priest1"), attack:2, defense:30});
        vec_map::insert(&mut global.charactors, utf8(b"priest2"), Role {name:utf8(b"priest2"), attack:4, defense:45});
        vec_map::insert(&mut global.charactors, utf8(b"priest3"), Role {name:utf8(b"priest3"), attack:6, defense:60});
        vec_map::insert(&mut global.charactors, utf8(b"assassin1"), Role {name:utf8(b"assassin1"), attack:5, defense:18});
        vec_map::insert(&mut global.charactors, utf8(b"assassin2"), Role {name:utf8(b"assassin2"), attack:7, defense:25});
        vec_map::insert(&mut global.charactors, utf8(b"assassin3"), Role {name:utf8(b"assassin3"), attack:9, defense:30});
    }

    public(friend) fun create_role(global: &Global, ctx: &mut TxContext) : Role {
        let seed:u8 = 100;
        let index = utils::get_random_num(0, vec_map::size(&global.charactors) - 1, seed, ctx);
        let (name, role) = vec_map::get_entry_by_idx(&global.charactors, index);
        *role
    }

    public fun get_attack(role:&Role) : u64 {
        role.attack
    }

    public fun get_defense(role:&Role) : u64 {
        role.defense
    }
}