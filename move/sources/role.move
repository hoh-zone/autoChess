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
        life: u64,
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
        vec_map::insert(&mut global.charactors, utf8(b"ani1"), Role {name:utf8(b"ani1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"ani1_1"), Role {name:utf8(b"ani1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"ani2"), Role {name:utf8(b"ani2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"ani2_1"), Role {name:utf8(b"ani2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"ani3"), Role {name:utf8(b"ani3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"archer1"), Role {name:utf8(b"archer1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"archer1_1"), Role {name:utf8(b"archer1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"archer2"), Role {name:utf8(b"archer2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"archer2_1"), Role {name:utf8(b"archer2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"archer3"), Role {name:utf8(b"archer3"), attack:8, life:40, level:9, price:3});

        vec_map::insert(&mut global.charactors, utf8(b"assa1"), Role {name:utf8(b"assa1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"assa1_1"), Role {name:utf8(b"assa1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"assa2"), Role {name:utf8(b"assa2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"assa2_1"), Role {name:utf8(b"assa2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"assa3"), Role {name:utf8(b"assa3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi1"), Role {name:utf8(b"kunoichi1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi1_1"), Role {name:utf8(b"kunoichi1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi2"), Role {name:utf8(b"kunoichi2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi2_1"), Role {name:utf8(b"kunoichi2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi3"), Role {name:utf8(b"kunoichi3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"shinobi1"), Role {name:utf8(b"shinobi1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi1_1"), Role {name:utf8(b"shinobi1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi2"), Role {name:utf8(b"shinobi2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi2_1"), Role {name:utf8(b"shinobi2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi3"), Role {name:utf8(b"shinobi3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"mega1"), Role {name:utf8(b"mega1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"mega1_1"), Role {name:utf8(b"mega1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"mega2"), Role {name:utf8(b"mega2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"mega2_1"), Role {name:utf8(b"mega2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"mega3"), Role {name:utf8(b"mega3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"shaman1"), Role {name:utf8(b"shaman1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1_1"), Role {name:utf8(b"shaman1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2"), Role {name:utf8(b"shaman2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2_1"), Role {name:utf8(b"shaman2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"shaman3"), Role {name:utf8(b"shaman3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"firemega1"), Role {name:utf8(b"firemega1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1_1"), Role {name:utf8(b"firemega1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2"), Role {name:utf8(b"firemega2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2_1"), Role {name:utf8(b"firemega2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"firemega3"), Role {name:utf8(b"firemega3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"wizard1"), Role {name:utf8(b"wizard1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1_1"), Role {name:utf8(b"wizard1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2"), Role {name:utf8(b"wizard2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2_1"), Role {name:utf8(b"wizard2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"wizard3"), Role {name:utf8(b"wizard3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"cleric1"), Role {name:utf8(b"cleric1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1_1"), Role {name:utf8(b"cleric1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2"), Role {name:utf8(b"cleric2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2_1"), Role {name:utf8(b"cleric2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"cleric3"), Role {name:utf8(b"cleric3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"fighter1"), Role {name:utf8(b"fighter1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1_1"), Role {name:utf8(b"fighter1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2"), Role {name:utf8(b"fighter2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2_1"), Role {name:utf8(b"fighter2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"fighter3"), Role {name:utf8(b"fighter3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"golem1"), Role {name:utf8(b"golem1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"golem1_1"), Role {name:utf8(b"golem1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"golem2"), Role {name:utf8(b"golem2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"golem2_1"), Role {name:utf8(b"golem2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"golem3"), Role {name:utf8(b"golem3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"slime1"), Role {name:utf8(b"slime1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"slime1_1"), Role {name:utf8(b"slime1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"slime2"), Role {name:utf8(b"slime2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"slime2_1"), Role {name:utf8(b"slime2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"slime3"), Role {name:utf8(b"slime3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"tank1"), Role {name:utf8(b"tank1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tank1_1"), Role {name:utf8(b"tank1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tank2"), Role {name:utf8(b"tank2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tank2_1"), Role {name:utf8(b"tank2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tank3"), Role {name:utf8(b"tank3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"priest1"), Role {name:utf8(b"priest1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"priest1_1"), Role {name:utf8(b"priest1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"priest2"), Role {name:utf8(b"priest2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"priest2_1"), Role {name:utf8(b"priest2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"priest3"), Role {name:utf8(b"priest3"), attack:8, life:40, level:9, price:3});
        
        vec_map::insert(&mut global.charactors, utf8(b"tree1"), Role {name:utf8(b"tree1"), attack:4, life:25, level:1, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tree1_1"), Role {name:utf8(b"tree1_1"), attack:6, life:30, level:2, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tree2"), Role {name:utf8(b"tree2"), attack:8, life:40, level:3, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tree2_1"), Role {name:utf8(b"tree2_1"), attack:8, life:40, level:6, price:3});
        vec_map::insert(&mut global.charactors, utf8(b"tree3"), Role {name:utf8(b"tree3"), attack:8, life:40, level:9, price:3});
    }

    public fun empty() : Role {
        Role {
            name:utf8(b"none"),
            attack: 0,
            life: 0,
            level: 0,
            price: 0,
        }
    }

    fun random_select_role_by_level(global: &Global, level:u64, random: u64, ctx:&mut TxContext):Role {
        let max_roles_per_level = vec_map::size(&global.charactors) / 5;
        let index = random % max_roles_per_level;
        if (level == 1) {
            let (name, role) = vec_map::get_entry_by_idx(&global.charactors, 5 * index);
            *role
        } else if (level == 3) {
           let (name, role) = vec_map::get_entry_by_idx(&global.charactors, 1 + 5 * index);
            *role
        } else {
            let (name, role) = vec_map::get_entry_by_idx(&global.charactors, 2 + 5 * index);
            *role
        }
    }

    public(friend) fun create_random_role_for_lineup(global: &Global, seed:u8, p2:u64, p3:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p3) {
            random_select_role_by_level(global, 9, random, ctx)
        } else if (random < p2) {
            random_select_role_by_level(global, 3, random, ctx)
        } else {
            random_select_role_by_level(global, 1, random, ctx)
        }
    }

    public(friend) fun create_random_role_for_cards(global: &Global, seed:u8, p2:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p2) {
            random_select_role_by_level(global, 3, random, ctx)
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

    public fun get_life(role:&Role) : u64 {
        role.life
    }

    public fun get_level(role:&Role) : u8 {
        role.level
    }

    public fun set_life(role:&mut Role, life:u64) {
        role.life = life;
    }
}