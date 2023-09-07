module auto_chess::lineup {
    use sui::tx_context::{Self, TxContext};
    use std::vector::{Self};
    use sui::table::{Self, Table};
    use sui::transfer;
    use auto_chess::role::{Role, Self};
    use sui::object::{Self, UID};
    use std::string::{utf8, String};

    struct Global has key {
        id: UID,
        cards_pools: Table<String, LineUp>
    }
    
    struct LineUp has store, copy, drop {
        creator: address,
        role_num: u64,
        roles: vector<Role>
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            cards_pools: table::new<String, LineUp>(ctx)
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            cards_pools : table::new<String, LineUp>(ctx)
        };
        transfer::share_object(global);
    }

    public fun empty(ctx: &mut TxContext) : LineUp {
        LineUp {
            creator: tx_context::sender(ctx),
            role_num: 0,
            roles: vector::empty<Role>()
        }
    }

    fun init_random_roles(roleGlobal: &role::Global, ctx: &mut TxContext): vector<Role> {
        let vec = vector::empty<Role>();
        vector::push_back(&mut vec, role::create_role(roleGlobal, ctx));
        vector::push_back(&mut vec, role::create_role(roleGlobal, ctx));
        vector::push_back(&mut vec, role::create_role(roleGlobal, ctx));
        vec
    }

    public fun get_cards_pool(cards_pool_tag:&String, global:&Global, ctx: &mut TxContext) : LineUp {
        if (table::contains(&global.cards_pools, *cards_pool_tag)) {
            let lineup = table::borrow(&global.cards_pools, *cards_pool_tag);
            *lineup
        } else {
            // todo: how to choose a proper tag?
            let default_cards_pool_tag = utf8(b"0-0-0");
            let lineup = table::borrow(&global.cards_pools, default_cards_pool_tag);
            *lineup
        }
    }

    public fun init_cards_pools(global: &mut Global, roleGlobal: &role::Global, ctx: &mut TxContext) {
        let lineup = create_lineup(roleGlobal, ctx);
        table::add(&mut global.cards_pools, utf8(b"0-0-0"), lineup);
    }

    public fun create_lineup(roleGlobal: &role::Global, ctx: &mut TxContext) : LineUp {
        let virtual_roles = init_random_roles(roleGlobal, ctx);
        LineUp {
            creator: tx_context::sender(ctx),
            role_num: vector::length(&virtual_roles),
            roles: virtual_roles
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

}