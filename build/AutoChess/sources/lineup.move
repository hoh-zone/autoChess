module auto_chess::lineup {
    use sui::tx_context::{Self, TxContext};
    use std::vector::{Self};

    use auto_chess::role::{Role, Self};
    
    struct LineUp has store, copy, drop {
        creator: address,
        role_num: u64,
        roles: vector<Role>
    }

    fun init_random_roles(ctx: &mut TxContext): vector<Role> {
        let vec = vector::empty<Role>();
        vector::push_back(&mut vec, role::create_role(ctx));
        vector::push_back(&mut vec, role::create_role(ctx));
        vector::push_back(&mut vec, role::create_role(ctx));
        vec
    }

    public fun create_lineup(ctx: &mut TxContext) : LineUp {
        let virtual_roles = init_random_roles(ctx);
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