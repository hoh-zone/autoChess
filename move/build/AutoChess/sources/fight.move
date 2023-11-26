module auto_chess::fight {
    use auto_chess::role::{Self, Role};
    use auto_chess::lineup::{Self, LineUp};
    use auto_chess::utils;
    use std::debug::print;
    use std::vector;
    use std::string::{utf8, String};
    friend auto_chess::chess;

    const INVALID_INDEX:u64 = 10000;

    public(friend) fun safe_reduce_attack(reduce_value:u64, role: &mut Role) {
        let char_life = role::get_life(role);
        let char_attack = role::get_attack(role);
        if (char_life == 0) {
            return
        };
        if (char_attack <= reduce_value) {
            role::set_attack(role, 1);
        } else {
            role::set_attack(role, char_attack - reduce_value);
        }
    }

    public(friend) fun safe_attack(attack:u64, other_role:&mut Role) {
        let other_life = role::get_life(other_role);
        if (other_life <= attack) {
            role::set_life(other_role, 0);
            print(&role::get_name(other_role));
            print(&utf8(b"is dead"));
        } else {
            role::set_life(other_role, other_life - attack);
        };
        print(&role::get_name(other_role));
        print(&utf8(b"before after life:"));
        print(&other_life);
        print(&role::get_life(other_role));
    }

    public(friend) fun safe_add_attack(add_value:u64, role: &mut Role) {
        let char_life = role::get_life(role);
        let char_attack = role::get_attack(role);
        if (char_life == 0) {
            return
        };
        role::set_attack(role, char_attack + add_value);
    }

    public(friend) fun safe_add_hp(add_value:u64, role: &mut Role) {
        let char_life = role::get_life(role);
        if (char_life == 0) {
            return
        };
        role::set_life(role, char_life + add_value);
    }

    public(friend) fun call_skill(role_index:u64, role: &mut Role, enemy_role_index:u64, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>, my_lineup_permanent: &mut LineUp) {
        let effect = role::get_effect(role);
        let effect_value = role::get_effect_value(role);

        print(&utf8(b"skill"));
        print(&effect);

        let is_forbid_buff = false;
        let is_forbid_debuff = false;

        let i = 0;
        let enemy_len = vector::length(enemy_roles);
        let my_len = vector::length(my_roles);
        while (i < enemy_len) {
            let role = vector::borrow(enemy_roles, i);
            let effect = role::get_effect(role);
            if (effect == utf8(b"forbid_buff")) {
                is_forbid_buff = true;
            };
            if (effect == utf8(b"forbid_debuff")) {
                is_forbid_debuff = true;
            };
            if (is_forbid_buff && is_forbid_debuff) {
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
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_hp = utils::utf8_to_u64(effect_value);
            let life = role::get_life(role);
            role::set_life(role, life + add_hp);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                safe_add_hp(add_hp, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_attack")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_attack = utils::utf8_to_u64(effect_value);
            let attack = role::get_life(role);
            role::set_attack(role, attack + add_attack);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                safe_add_attack(add_attack, char);
                i = i + 1;
            };
        } else if (effect == utf8(b"add_all_tmp_magic")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_magic = (utils::utf8_to_u64(effect_value) as u8);
            let i = 0;
            while (i < my_len) {
                let char = vector::borrow_mut(my_roles, i);
                let magic = role::get_magic(char);
                role::set_magic(char, magic + add_magic);
                i = i + 1;
            };
        } else if (effect == utf8(b"all_max_hp_to_back1")) {
            if (is_forbid_buff) {
                print(&utf8(b"buff forbiden"));
                return
            };
            let add_hp = utils::utf8_to_u64(effect_value);
            let roles = lineup::get_mut_roles(my_lineup_permanent);
            if (role_index == 5) {
                return
            };
            let back_char = vector::borrow_mut(roles, role_index + 1);
            let life = role::get_life(back_char);
            role::set_life(back_char, life + add_hp);
        } else if (effect == utf8(b"reduce_tmp_attack")) {
            if (is_forbid_debuff) {
                print(&utf8(b"debuff forbiden"));
                return
            };
            let reduce_attack = utils::utf8_to_u64(effect_value);
            safe_reduce_attack(reduce_attack, enemy_role);
        } else if (effect == utf8(b"reduce_all_tmp_attack")) {
            if (is_forbid_debuff) {
                print(&utf8(b"debuff forbiden"));
                return
            };
            let reduce_attack = utils::utf8_to_u64(effect_value);
             safe_reduce_attack(reduce_attack, enemy_role);
            let i = 0;
            while (i < enemy_len) {
                let char = vector::borrow_mut(enemy_roles, i);
                 safe_reduce_attack(reduce_attack, char);
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
            let next_one = vector::borrow_mut(enemy_roles, 0);
            safe_attack(suppter_attack, next_one);
        } else if (effect == utf8(b"attack_last_char")) {
            let effect_attack = utils::utf8_to_u64(effect_value);
            if (vector::length(enemy_roles) == 0) {
                safe_attack(effect_attack, enemy_role);
            } else {
                let last_one = vector::borrow_mut(enemy_roles, enemy_len - 1);
                safe_attack(effect_attack, last_one);
            }
        } else if (effect == utf8(b"attack_lowest_hp")) {
            let attack = utils::utf8_to_u64(effect_value);
            let role = find_lowest_life_one(enemy_role, enemy_roles);
            safe_attack(attack, role);
        } else if (effect == utf8(b"attack_by_life_percent")) {
            let value = utils::utf8_to_u64(effect_value);
            let enemy_life = role::get_life(enemy_role);
            let base_attack = role::get_attack(role);
            let extra_attack = enemy_life * value / 10;
            safe_attack(base_attack + extra_attack, role);
        } 
    }

    fun find_lowest_life_one(default_role: &mut Role, roles: &mut vector<Role>) : &mut Role {
        let min_hp = INVALID_INDEX;
        let min_hp_index = INVALID_INDEX;
        let len = vector::length(roles);
        if (len == 0) {
            return default_role
        };
        let i = 0;
        while(i < len) {
            let role = vector::borrow(roles, i);
            let life = role::get_life(role);
            if (life > 0 && life < min_hp) {
                min_hp = life;
                min_hp_index = i;
            };
            i = i + 1;
        };
        if (min_hp_index != INVALID_INDEX) {
            return vector::borrow_mut(roles, min_hp_index)
        };
        return default_role
    }

    public(friend) fun call_attack(role: &Role, other_role: &mut Role) {
        let attack = role::get_attack(role);
        safe_attack(attack, other_role);
    }

    public(friend) fun action(role_index:u64, role: &mut Role, enemy_role_index:u64, enemy_role: &mut Role, my_roles:&mut vector<Role>, enemy_roles:&mut vector<Role>, my_lineup_permanent: &mut LineUp) {
        let extra_max_magic_debuff = get_extra_max_magic_debuff(enemy_roles);
        let max_magic = role::get_max_magic(role);
        let magic = role::get_magic(role);
        if (magic >= (max_magic + extra_max_magic_debuff) && role::get_effect_type(role) == utf8(b"skill")) {
            print(&utf8(b"skill:"));
            print(&role::get_effect(role));
            call_skill(role_index, role, enemy_role_index, enemy_role, my_roles, enemy_roles, my_lineup_permanent);
            role::set_magic(role, 0);
        } else {
            print(&utf8(b"attack:"));
            print(&role::get_attack(role));
            call_attack(role, enemy_role);
            role::set_magic(role, magic + 1);
        };
    }

    fun get_extra_max_magic_debuff(roles: &vector<Role>): u8 {
        let value:u8 = 0;
        let len = vector::length(roles);
        let i = 0;
        while (i < len) {
            let role = vector::borrow(roles, i);
            if (role::get_effect(role)== utf8(b"add_all_tmp_max_magic")) {
                let tmp = (utils::utf8_to_u64(role::get_effect_value(role)) as u8);
                if (tmp > value) {
                    value = tmp;
                }
            };
            i = i + 1;
        };
        value
    }
}