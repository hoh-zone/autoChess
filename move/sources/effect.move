module auto_chess::effect {
    use std::string::{utf8, String, Self};
    use std::vector;
    use std::debug::print;
    use auto_chess::role;
    use auto_chess::utils;
    use auto_chess::lineup::{Self, LineUp};
    friend auto_chess::chess;

    public(friend) fun call_effect(role:&mut Role,  my_lineup_fight:&mut LineUp, my_lineup_permanent:&mut LineUp, enemy_lineup: &mut LineUp) {
        let effect = role::get_effect(role);
        let effect_value = role::get_effect_value(role);
        if (effct == utf8(b"add_all_hp")) {
            let value = utils::utf8_to_u64(effect_value);
            add_all_attack(my_lineup, my_lineup_permanent, value);
        } else {
            print("no effect");
        };
    }

    public(friend) fun add_all_hp(lineup: &mut Lineup, value:u64) {
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&vec));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_life = role::get_life(role);
            role::set_life(role, orgin_life + value);
        };
    }

    public(friend) fun add_all_attack(lineup: &mut Lineup, value : u64) {
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&vec));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_attack = role::get_attack(role);
            role::set_attack(role, orgin_attack + value);
        };
    }

    public(friend) fun aoe_attack(lineup: &mut Lineup, attack_value: u64) {
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&vec));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_life = role::get_life(role);
            if (orgin_life > attack_value) {
                role::set_life(role, orgin_life - attack_value);
            } else {
                role::set_life(role, 0);
            };
        };
    }
}