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
        let forbid_my_buff = forbid_buff(&enemy_lineup);
        let forbid_enemy_buff = forbid_buff(&my_lineup_fight);
        if (effct == utf8(b"add_all_hp")) {
            let value = utils::utf8_to_u64(effect_value);
            add_all_hp(my_lineup_fight, value);
            add_all_hp(my_lineup_permanent, value);
        } else if (effect == utf8(b"add_all_tmp_attack")) {
            let value = utils::utf8_to_u64(effect_value);
            add_all_attack(my_lineup_fight, value);
        } else if (effct == utf8(b"aoe")) {
            let value = utils::utf8_to_u64(effect_value);
            aoe_attack(enemy_lineup, valid);
        } else if (effect == utf8(b"add_all_tmp_hp") ){
            let value = utils::utf8_to_u64(effect_value);
            add_all_hp(my_lineup_fight, value);
        };
    }

    fun is_forbid_buff(&lineup: LineUp) : bool{
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&vec));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let effect = role::get_effect(&role);
            if (effct == utf8(b"forbid_buff")) {
                return true;
            }
        };
        return false;
    }

    fun add_all_hp(lineup: &mut Lineup, value:u64) {
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&vec));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_life = role::get_life(role);
            role::set_life(role, orgin_life + value);
        };
    }

    fun add_all_attack(lineup: &mut Lineup, value : u64) {
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&vec));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_attack = role::get_attack(role);
            role::set_attack(role, orgin_attack + value);
        };
    }

    fun aoe_attack(lineup: &mut Lineup, attack_value: u64) {
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