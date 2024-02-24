// fight logic in every match.
module auto_chess::fight {
    use auto_chess::role::{Self, Role};
    use auto_chess::lineup::{Self, LineUp};
    use auto_chess::utils;
    use std::debug::print;
    use std::vector;
    use std::string::{utf8};
    friend auto_chess::chess;

    const INVALID_INDEX:u64 = 10000;

    public(friend) fun safe_reduce_attack(reduce_value:u64, opponent: &mut Role) {
        let char_hp = role::get_hp(opponent);
        let char_attack = role::get_attack(opponent);
        if (char_hp == 0) {
            return
        };
        if (char_attack <= reduce_value) {
            role::set_attack(opponent, 1);
        } else {
            role::set_attack(opponent, char_attack - reduce_value);
        }
    }

    public(friend) fun safe_attack(attack:u64, opponent:&mut Role) {
        let other_hp = role::get_hp(opponent);
        if (other_hp <= attack) {
            role::set_hp(opponent, 0);
            print(&role::get_class(opponent));
            print(&utf8(b"is dead"));
        } else {
            role::set_hp(opponent, other_hp - attack);
        };
        print(&role::get_class(opponent));
        print(&utf8(b"before after hp:"));
        print(&other_hp);
        print(&role::get_hp(opponent));
    }

    public(friend) fun increase_attack(added_value:u64, team_mate: &mut Role) {
        let char_hp = role::get_hp(team_mate);
        let char_attack = role::get_attack(team_mate);
        if (char_hp == 0) {
            return
        };
        role::set_attack(team_mate, char_attack + added_value);
    }

    public(friend) fun heal(recovered_hp:u64, team_mate: &mut Role) {
        let char_hp = role::get_hp(team_mate);
        if (char_hp == 0) {
            return
        };
        role::set_hp(team_mate, char_hp + recovered_hp);
    }

    public(friend) fun call_skill(role_index:u64, role: &mut Role, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>, my_lineup_permanent: &mut LineUp) {
        let effect = role::get_effect(role);
        let effect_value = role::get_effect_value(role);

        print(&utf8(b"skill"));
        print(&effect);

        let is_buff_forbidden = false;
        let is_debuff_forbiddenf = false;

        let i = 0;
        let enemy_len = vector::length(enemy_roles);
        let my_len = vector::length(my_roles);
        while (i < enemy_len) {
            let role = vector::borrow(enemy_roles, i);
            let effect = role::get_effect(role);
            if (effect == utf8(b"forbid_buff")) {
                is_buff_forbidden = true;
            };
            if (effect == utf8(b"forbid_debuff")) {
                is_debuff_forbiddenf = true;
            };
            if (is_buff_forbidden && is_debuff_forbiddenf) {
                break
            };
            i = i + 1;
        };

        if (effect == utf8(b"aoe")) {
            let attack = utils::utf8_to_u64(effect_value);
            let i = 0;
            safe_attack(attack, enemy_role);
            while (i < enemy_len) {
                let char = vector::borrow_mut(enemy_roles, i);
                safe_attack(attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_hp")) {
            if (is_buff_forbidden) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let added = utils::utf8_to_u64(effect_value);
            let hp = role::get_hp(role);
            role::set_hp(role, hp + added);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                heal(added, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_attack")) {
            if (is_buff_forbidden) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let added_attack = utils::utf8_to_u64(effect_value);
            let attack = role::get_attack(role);
            role::set_attack(role, attack + added_attack);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                increase_attack(added_attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_sp")) {
            if (is_buff_forbidden) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let added_sp = (utils::utf8_to_u64(effect_value) as u8);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                let sp = role::get_sp(char);
                role::set_sp(char, sp + added_sp);
                i = i + 1;
            };
        } else if (effect == utf8(b"all_max_hp_to_back1")) {
            if (is_buff_forbidden) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let added_hp = utils::utf8_to_u64(effect_value);
            let roles = lineup::get_mut_roles(my_lineup_permanent);
            if (role_index == 5) {
                return
            };
            let back_char = vector::borrow_mut(roles, role_index + 1);
            let hp = role::get_hp(back_char);
            role::set_hp(back_char, hp + added_hp);
        } else if (effect == utf8(b"reduce_tmp_attack")) {
            if (is_debuff_forbiddenf) {
                print(&utf8(b"debuff forbiden"));
                return
            };
            let reduced_attack = utils::utf8_to_u64(effect_value);
            safe_reduce_attack(reduced_attack, enemy_role);
        } else if (effect == utf8(b"reduce_all_tmp_attack")) {
            if (is_debuff_forbiddenf) {
                print(&utf8(b"debuff forbiden"));
                return
            };
            let reduced_attack = utils::utf8_to_u64(effect_value);
             safe_reduce_attack(reduced_attack, enemy_role);
            let i = 0;
            while (i < enemy_len) {
                let char = vector::borrow_mut(enemy_roles, i);
                 safe_reduce_attack(reduced_attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"attack_sputter_to_second_by_percent")) {
            let percent_by_ten = utils::utf8_to_u64(effect_value);
            let base_attack = role::get_attack(role);
            let suppter_attack = base_attack * percent_by_ten / 10;
            safe_attack(base_attack, enemy_role);
            if (vector::length(enemy_roles) == 0) {
                return
            };
            let next_one = vector::borrow_mut(enemy_roles, enemy_len - 1);
            safe_attack(suppter_attack, next_one);
        } else if (effect == utf8(b"attack_last_char")) {
            let effect_attack = utils::utf8_to_u64(effect_value);
            if (vector::length(enemy_roles) == 0) {
                safe_attack(effect_attack, enemy_role);
            } else {
                let last_one = vector::borrow_mut(enemy_roles, 0);
                safe_attack(effect_attack, last_one);
            }
        } else if (effect == utf8(b"attack_lowest_hp")) {
            let attack = utils::utf8_to_u64(effect_value);
            let role = find_lowest_hp_one(enemy_role, enemy_roles);
            safe_attack(attack, role);
        } else if (effect == utf8(b"attack_by_hp_percent")) {
            let value = utils::utf8_to_u64(effect_value);
            let enemy_hp = role::get_hp(enemy_role);
            let base_attack = role::get_attack(role);
            let extra_attack = enemy_hp * value / 10;
            safe_attack(base_attack + extra_attack, role);
        } 
    }

    fun find_lowest_hp_one(default_role: &mut Role, roles: &mut vector<Role>) : &mut Role {
        let min_hp = INVALID_INDEX;
        let min_hp_index = INVALID_INDEX;
        let len = vector::length(roles);
        if (len == 0) {
            return default_role
        };
        let i = 0;
        while(i < len) {
            let role = vector::borrow(roles, i);
            let hp = role::get_hp(role);
            if (hp > 0 && hp < min_hp) {
                min_hp = hp;
                min_hp_index = i;
            };
            i = i + 1;
        };
        if (min_hp_index != INVALID_INDEX) {
            return vector::borrow_mut(roles, min_hp_index)
        };
        return default_role
    }

    public(friend) fun standard_attack(my_hero: &Role, opponent: &mut Role) {
        let attack = role::get_attack(my_hero);
        safe_attack(attack, opponent);
    }

    public(friend) fun action(role_index:u64, role: &mut Role, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>, my_lineup_permanent: &mut LineUp) {
        let extra_sp_cap_debuff = get_extra_sp_cap_debuff(enemy_roles);
        let sp_cap = role::get_sp_cap(role);
        let sp = role::get_sp(role);
        if (sp >= (sp_cap + extra_sp_cap_debuff) && role::get_effect_type(role) == utf8(b"skill")) {
            print(&utf8(b"skill:"));
            print(&role::get_effect(role));
            call_skill(role_index, role, enemy_role, my_roles, enemy_roles, my_lineup_permanent);
            role::set_sp(role, 0);
        } else {
            print(&utf8(b"attack:"));
            print(&role::get_attack(role));
            standard_attack(role, enemy_role);
            role::set_sp(role, sp + 1);
        };
    }

    fun get_extra_sp_cap_debuff(roles: &vector<Role>): u8 {
        let value:u8 = 0;
        let len = vector::length(roles);
        let i = 0;
        while (i < len) {
            let role = vector::borrow(roles, i);
            if (role::get_effect(role)== utf8(b"add_all_tmp_sp_cap")) {
                let tmp = (utils::utf8_to_u64(role::get_effect_value(role)) as u8);
                if (tmp > value) {
                    value = tmp;
                }
            };
            i = i + 1;
        };
        value
    }

    public(friend) fun some_alive(first_role: &Role, roles: &vector<Role>) : bool {
        let i = 0;
        if (role::get_class(first_role) != utf8(b"init") && role::get_hp(first_role) > 0) {
            return true
        };
        while (i < vector::length(roles)) {
            let role = vector::borrow(roles, i);
            if (role::get_class(role) != utf8(b"none") && role::get_hp(role) > 0) {
                return true
            };
            i = i + 1;
        };
        return false
    }
}