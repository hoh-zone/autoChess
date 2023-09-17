module auto_chess::effect {
    use std::string::{utf8, String, Self};
    use std::vector;
    use std::debug::print;
    use auto_chess::role::{Self, Role};
    use auto_chess::utils;
    use auto_chess::lineup::{Self, LineUp};
    friend auto_chess::chess;

    public(friend) fun call_effect(role:&mut Role,  my_lineup_fight:&mut LineUp, my_lineup_permanent:&mut LineUp, enemy_lineup: &mut LineUp) {
        let effect = role::get_effect(role);
        let effect_value = role::get_effect_value(role);
        let forbid_my_buff = is_forbid_buff(enemy_lineup);
        let forbid_enemy_buff = is_forbid_buff(my_lineup_fight);
        if (effect == utf8(b"add_all_hp")) {
            print(&utf8(b"here:"));
            let value = utils::utf8_to_u64(effect_value);
            add_all_hp(my_lineup_fight, value);
            add_all_hp(my_lineup_permanent, value);
            print(my_lineup_permanent);
        } else if (effect == utf8(b"add_all_tmp_attack")) {
            let value = utils::utf8_to_u64(effect_value);
            add_all_attack(my_lineup_fight, value);
        } else if (effect == utf8(b"aoe")) {
            let value = utils::utf8_to_u64(effect_value);
            aoe_attack(enemy_lineup, value);
        } else if (effect == utf8(b"add_all_tmp_hp") ){
            let value = utils::utf8_to_u64(effect_value);
            add_all_hp(my_lineup_fight, value);
        };
    }

    fun is_forbid_buff(lineup: &LineUp) : bool{
        let roles = lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(roles));
        while (i < len) {
            let role:&Role = vector::borrow(roles, i);
            let effect = role::get_effect(role);
            if (effect == utf8(b"forbid_buff")) {
                return true
            };
            i = i + 1;
        };
        return false
    }

    fun add_all_hp(lineup: &mut LineUp, value:u64) {
        let roles = lineup::get_mut_roles(lineup);
        let (i, len) = (0u64, vector::length(roles));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(roles, i);
            let orgin_life = role::get_life(role);
            role::set_life(role, orgin_life + value);
            i = i + 1;
        };
    }

    fun add_all_attack(lineup: &mut LineUp, value : u64) {
        let roles = *lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&roles));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_attack = role::get_attack(role);
            role::set_attack(role, orgin_attack + value);
            i = i + 1;
        };
    }

    fun aoe_attack(lineup: &mut LineUp, attack_value: u64) {
        let roles = *lineup::get_roles(lineup);
        let (i, len) = (0u64, vector::length(&roles));
        while (i < len) {
            let role:&mut Role = vector::borrow_mut(&mut roles, i);
            let orgin_life = role::get_life(role);
            if (orgin_life > attack_value) {
                role::set_life(role, orgin_life - attack_value);
            } else {
                role::set_life(role, 0);
            };
            i = i + 1;
        };
    }
}