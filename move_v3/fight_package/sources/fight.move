// fight logic in every match.
module fight_packagev3::fight {
    use std::debug::print;
    use std::vector;
    use std::string::{String, utf8};

    use sui::vec_map::{Self, VecMap};

    use role_packagev3::role::{Self, Role};
    use util_packagev3::utils::{Self, Int_wrapper};

    //const INVALID_INDEX:u64 = 10000;
    //const ERR_EXCEED_VEC_LENGTH:u64 = 0x001;

    // When the player role is taking the turn in a fight. If the sp point is full， not cancelled out and the acting role has a skill,
    // the skill attack is triggered and sp point cleared out.
    // Otherwise the standard attact is trigged and sp point of the attacked opponent increases by 1.
    public fun action(attacking_role: &mut Role, attacked_role: &mut Role, attacking_team:&mut vector<Role>, attacked_team:&mut vector<Role>,
    permenant_increase_hp_info: &mut VecMap<String, Int_wrapper>){
        let extra_sp_cap_debuff = get_extra_sp_cap_debuff(attacked_role, attacked_team);
        //test
        print(&utf8(b"The extra sp cap debuff is:"));
        print(&extra_sp_cap_debuff);

        let sp = role::get_sp(attacking_role);
        if (sp >= (role::get_sp_cap(attacking_role) + extra_sp_cap_debuff) && role::get_effect_type(attacking_role) == utf8(b"skill")
            && call_skill(attacking_role, attacked_role, attacking_team, attacked_team, permenant_increase_hp_info)) {
            //test
            print(&utf8(b"Skill:"));
            print(&role::get_effect(attacking_role));
            print(&role::get_effect_value(attacking_role));

            role::set_sp(attacking_role, 0);
        } else {
            //test
            print(&utf8(b"Standard attack:"));
            print(&role::get_attack(attacking_role));

            standard_attack(attacking_role, attacked_role);
            role::set_sp(attacking_role, sp + 1);
        };
    }

    // role_index is the acting hero's index in my_lineup_permanent and only used for the effect 'all_max_hp_to_back1'
    // attacked_role: acting opponent; attacking_team:dynamic team exclude acting role
    // role: acting player role(ps. bad naming); attacked_team: dynamic opponent team exclude acting opponent; 
    // my_lineup_permanent: the static team (with stats before the battle)
    fun call_skill(attacking_role: &mut Role, attacked_role: &mut Role, attacking_team:&mut vector<Role>, attacked_team:&mut vector<Role>,
     permenant_increase_hp_info: &mut VecMap<String, Int_wrapper>): bool{
        let effect = role::get_effect(attacking_role);
        let effect_value = role::get_effect_value(attacking_role);
        let attacked_team_len = vector::length(attacked_team);
        let attacking_team_len = vector::length(attacking_team);
        let i = 0;

        let (is_buff_forbidden, is_debuff_forbidden) = set_forbidden_flag(attacked_role, attacked_team);
        
        //Test
        if(is_buff_forbidden)  print(&utf8(b"Buff forbidden"));
        if(is_debuff_forbidden)  print(&utf8(b"Debuff forbidden"));
           
        // Afflict attack to the whole enemy team, not affected by buff/debuff forbidden flag
        if (effect == utf8(b"aoe")) {
            let attack = utils::utf8_to_u64(effect_value);
            //let attack = 10;
            safe_attack(attack, attacked_role);
            i = attacked_team_len;
            while (i > 0) {
                if(safe_attack(attack, vector::borrow_mut(attacked_team, i-1))){
                    vector::remove(attacked_team, i-1);
                };
                i = i - 1;
            };
            return true
        // Attack the acting opponent and inflict a certain percentage of hp lost to the next acting role,
        // not affected by buff/debuff forbidden flag
        // The next is not exactly the next to make sure that someone else gets attacked
        } else if (effect == utf8(b"attack_sputter_to_second_by_percent")) {           
            let base_attack = role::get_attack(attacking_role);           
            safe_attack(base_attack, attacked_role);
            if ( attacked_team_len > 0) {
                let percent_by_ten = utils::utf8_to_u64(effect_value);
                let suppter_attack = base_attack * percent_by_ten / 10;
                if(safe_attack(suppter_attack, vector::borrow_mut(attacked_team, attacked_team_len - 1))){
                    vector::remove(attacked_team, attacked_team_len - 1);
                };               
            };
            return true
        // Attack the last charactor in the enemy team,when the acting opponent is not the only role left, not affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"attack_last_char")) {
            let effect_attack = utils::utf8_to_u64(effect_value);
            if ( attacked_team_len == 0) {
                safe_attack(effect_attack, attacked_role);
            } else {
                if(safe_attack(effect_attack, vector::borrow_mut(attacked_team, 0))){
                    vector::remove(attacked_team, 0);
                };
            };
            return true
        // Attack the charactor with the lowest hp in the enemy team, not affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"attack_lowest_hp")) {
            let attack = utils::utf8_to_u64(effect_value);
            let lowest_hp_index = lowest_hp_index(attacked_role, attacked_team);
            if(lowest_hp_index == 6 ){
                safe_attack(attack, attacked_role);
            }else{
                if(safe_attack(attack, vector::borrow_mut(attacked_team, lowest_hp_index))){
                    vector::remove(attacked_team, lowest_hp_index);
                };
            };  
            return true     
        // Inflict extract attack to the acting opponent role, the extract attack is a certain percentage of 
        // the opponent's hp value, not affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"attack_by_hp_percent")) {
            let base_attack = role::get_attack(attacking_role);
            let extra_attack = role::get_hp(attacked_role) * utils::utf8_to_u64(effect_value) / 10;
            safe_attack(base_attack + extra_attack, attacked_role);
            return true
         // Increase HP of all team mates affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"add_all_tmp_hp")) {   
            if(!is_buff_forbidden){ 
                let recovered_hp = utils::utf8_to_u64(effect_value);
                heal(recovered_hp, attacking_role);
                i = 0;
                while (i < attacking_team_len) {
                    heal(recovered_hp, vector::borrow_mut(attacking_team, i));
                    i = i + 1;
                };
                return true
            }else
                return false
        // Boost the attack value of the whole team temporarily (one round?), affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"add_all_tmp_attack")) {
            if( !is_buff_forbidden){
                let added_attack = utils::utf8_to_u64(effect_value);
                increase_attack(added_attack, attacking_role);
                i = 0;
                while (i < attacking_team_len) {
                    increase_attack(added_attack, vector::borrow_mut(attacking_team, i));
                    i = i + 1;
                };
                return true
            }else
                return false
        // Boost the sp value of the whole team temporarily (one round), affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"add_all_tmp_sp")) {
            if( !is_buff_forbidden){
                let added_sp = (utils::utf8_to_u64(effect_value) as u8);
                i = 0;
                while (i < attacking_team_len) {
                    let char = vector::borrow_mut(attacking_team, i);
                    let sp = role::get_sp(char);
                    role::set_sp(char, sp + added_sp);
                    i = i + 1;
                };
                return true
            } else
                return false
        // Permenantly(meaning for all the following battles in the chess game) 
        // increase hp value to the next charactor of the acting charactor,if the acting charactor is not the last in lineup,
        // affected by buff/debuff forbidden flag
        // The index choice is a bit confusing
        } else if (effect == utf8(b"all_max_hp_to_back1")) {
            if( !is_buff_forbidden){
                if(attacking_team_len > 0){
                    let buffed_char = vector::borrow_mut(attacking_team, attacking_team_len-1);
                    let hp_to_add = utils::utf8_to_u64(effect_value);
                    heal(hp_to_add, buffed_char);
                    //If the opponent is taking action, there is "invalid" key
                    if(!vec_map::contains(permenant_increase_hp_info, &utf8(b"invalid"))){
                        let class = role::get_class(buffed_char);
                        if(vec_map::contains(permenant_increase_hp_info, &class)){
                            let wrapper = vec_map::get_mut(permenant_increase_hp_info, &class);
                            let current_val = utils::get_int(wrapper);
                            utils::set_int(wrapper, current_val+hp_to_add);
                        }else{
                            let new_wrapper = utils::generate_wrapper_with_value(hp_to_add);
                            vec_map::insert(permenant_increase_hp_info, class, new_wrapper);
                        };
                    };
                };
                return true
            } else
                return false
        // Reduce the attack value of the active opponent role(temp), affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"reduce_tmp_attack")) {
            if( !is_debuff_forbidden){
                let reduced_attack = utils::utf8_to_u64(effect_value);
                safe_reduce_attack(reduced_attack, attacked_role);
                return true
            }else
                return false
        // Reduce the attack value (temp, one round) of the whole enemy team, affected by buff/debuff forbidden flag
        } else if (effect == utf8(b"reduce_all_tmp_attack")) {
            if(!is_debuff_forbidden){
                let reduced_attack = utils::utf8_to_u64(effect_value);
                safe_reduce_attack(reduced_attack, attacked_role);
                i = 0;
                while (i < attacked_team_len) {
                    safe_reduce_attack(reduced_attack, vector::borrow_mut(attacked_team, i));
                    i = i + 1;
                };
                return true
            }else
                return false
        }; 
        return false
    }

    // If a role in the opponent team has duff forbidden or debuff forbidden ability, the flag is set to be true.
    // If is_buff_forbidden is true, all the enhancement skills can not take effect on the teamates
    // If is_debuff_forbiddenf is true, all the damaging skills can not take effect on the enemies 
    fun set_forbidden_flag(attacked_role: &Role, attacked_team: &vector<Role>):(bool, bool){
        let (is_buff_forbidden, is_debuff_forbidden) = (false, false);
        let i = 0;
        let attacked_team_len = vector::length(attacked_team);

        let effect = role::get_effect(attacked_role);
        if (effect == utf8(b"forbid_buff")) is_buff_forbidden = true;
        if (effect == utf8(b"forbid_debuff")) is_debuff_forbidden = true;

        while (i < attacked_team_len) {
            effect = role::get_effect(vector::borrow(attacked_team, i));
            if (effect == utf8(b"forbid_buff")) is_buff_forbidden = true;
            if (effect == utf8(b"forbid_debuff")) is_debuff_forbidden = true;
            // break the loop if both are ture, one member with each ability is enough
            if (is_buff_forbidden && is_debuff_forbidden) break;
            i = i + 1;
        };
        (is_buff_forbidden, is_debuff_forbidden)
    }

    // Return the role with the lowest hp value in the role vector and if it is lower than the rols's hp, return the index
    //if the default_role has the lowest hp, return 6
    fun lowest_hp_index(default_role: & Role, roles: & vector<Role>): u64 {
        let len = vector::length(roles);
        if (len == 0) {
            return 6
        };
        let min_hp = role::get_hp(default_role);
        let min_hp_index = 6;
        let i = len;
        while(i > 0) {
            i = i - 1;
            let hp = role::get_hp(vector::borrow(roles, i));
            if (hp < min_hp) {
                min_hp = hp;
                min_hp_index = i;
            };         
        };
        min_hp_index
    }

    // first arguement role attack the second, if the opponent is dead, return ture, otherwise return false
    fun standard_attack(my_hero: &Role, opponent: &mut Role):bool {
        safe_attack(role::get_attack(my_hero), opponent)
    }

    // reduce the passed role's attack by the reduced value
    fun safe_reduce_attack(reduce_value:u64, opponent: &mut Role){
        let char_attack = role::get_attack(opponent); 
        if (char_attack <= reduce_value) {
            role::set_attack(opponent, 1);
        } else {
            role::set_attack(opponent, char_attack - reduce_value);
        }
    }

    // inflict hp damage to the opponent, if the opponent is dead, return ture, otherwise return false
    fun safe_attack(attack:u64, opponent:&mut Role):bool  {
        let opponent_hp = role::get_hp(opponent);
        opponent_hp =  if(opponent_hp > attack) {opponent_hp - attack} else 0;
        role::set_hp(opponent, opponent_hp);
        if(opponent_hp == 0)
            true
        else
            false
    }

    // increase the passed role's attack by the passed value 
    fun increase_attack(added_value:u64, team_mate: &mut Role) {
        let char_attack = role::get_attack(team_mate);
        role::set_attack(team_mate, char_attack + added_value);
    }

    // recover hp for the role
    fun heal(recovered_hp:u64, team_mate: &mut Role) {
        let char_hp = role::get_hp(team_mate);
        role::set_hp(team_mate, char_hp + recovered_hp);
    }

    // Get the value of the possible largest de-sp value in the passed role vector.
    // Only charactor with add_all_tmp_max_magic has the de-sp value larger than 0
    //the value of add_all_tmp_sp_cap can only be 1 or 2(only when the char level is 9)
    fun get_extra_sp_cap_debuff(role: &Role, roles: &vector<Role>): u8 {
        let len = vector::length(roles);
        let i = 0;
        let result:u8 = 0;
        if (role::get_effect(role) == utf8(b"add_all_tmp_sp_cap")) {
                result = 1;
                if((utils::utf8_to_u64(role::get_effect_value(role)) as u8) == 2)
                    return 2
        };

        while (i < len) {
            let current_role = vector::borrow(roles, i);
            if (role::get_effect(current_role)== utf8(b"add_all_tmp_sp_cap")) {
                result = 1;
                if(utils::utf8_to_u64(role::get_effect_value(current_role))  == 2)
                    return 2
            };
            i = i + 1;
        };
        result
    }

//////////////////////////////////Mainly for test ////////////////////////////////Mainly for test ////////////////////////////////Mainly for test
//////////////////////////////Mainly for test////////////////////////////////Mainly for test////////////////////////////////Mainly for test

    // lowest_hp_index(default_role: & Role, roles: & vector<Role>): 
     #[test]
    fun test_lowest_hp_index(){
        let ctx = tx_context::dummy();
        let role_global = role::generate_role_global(&mut ctx);
/*
        let lineup_to_test = lineup::generate_lineup_by_power(&role_global, 13, 5, &mut ctx);
        lineup::print_lineup(&lineup_to_test);
        let roles = lineup::get_mut_roles(&mut lineup_to_test);
        let acting_role = vector::remove(roles, 0);
*/
        let roles = vector::empty<Role>();
        vector::push_back(&mut roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
        vector::push_back(&mut roles, role::get_role_by_class(&role_global, utf8(b"ani2")));
        vector::push_back(&mut roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
        vector::push_back(&mut roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
        vector::push_back(&mut roles, role::get_role_by_class(&role_global, utf8(b"ani2")));
        let acting_role = role::get_role_by_class(&role_global, utf8(b"ani2"));
        let index = lowest_hp_index(&acting_role, &roles);
        print(&index);

        role::delete_role_global(role_global);
    }

    #[test]
    fun test_get_extra_sp_cap_debuff(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();

        let attacking_role = role::get_role_by_class(&role_global, utf8(b"mega2_1"));

        //let attacked_role = role::get_role_by_class(&role_global, utf8(b"shinobi2"));
        //let attacked_role = role::get_role_by_class(&role_global, utf8(b"shaman1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"slime2"));
        //1
        //let attacked_role = role::get_role_by_class(&role_global, utf8(b"wizard1_1"));
        //2
        //let attacked_role = role::get_role_by_class(&role_global, utf8(b"wizard3"));

        let sp_attacking_role = 4;
        //Can change
        role::set_sp(&mut attacking_role, sp_attacking_role);

        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));

        //vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shaman1")));
        vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter2_1")));
        vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));
        vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
        //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
        //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
        vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime1")));
        //1
        vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"wizard2")));
        //2
        //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"wizard3")));

        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        role::delete_role_global(role_global);
    }

     // call_skill(attacking_role: &mut Role, attacked_role: &mut Role, attacking_team:&mut vector<Role>, attacked_team:&mut vector<Role>,
     //permenant_increase_hp_info: &mut VecMap<String, Int_wrapper>)

    #[test]
    fun test_attack_standard(){}

    //fun call_skill(attacking_role: &mut Role, attacked_role: &mut Role, attacking_team:&mut vector<Role>, attacked_team:&mut vector<Role>,
    // permenant_increase_hp_info: &mut VecMap<String, Int_wrapper>)
    //get_role_by_class(global:&Global, class:String)
     #[test]
     #[allow(unused_assignment,unused_variable)]
    fun test_attack_aoe(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role  = role::get_role_by_class(&role_global, utf8(b"mega1_1"));
        let attacked_role  = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();
 
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
         //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"mega1_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree1")));
        //Group B
        }else{
            attacking_role = role::get_role_by_class(&role_global, utf8(b"mega2_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"shinobi2"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

     #[test]
     #[allow(unused_assignment,unused_variable)]
    fun test_attack_lowest_hp(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();

        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
         //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tree1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree1")));
        //Group B
        }else{
            attacking_role = role::get_role_by_class(&role_global, utf8(b"assa2_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"shinobi2"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();      
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

     #[test]
     #[allow(unused_assignment,unused_variable)]
    fun test_attack_by_hp_percent(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"shinobi1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"tree1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();

        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
         //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"shinobi1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"tree1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric1_1")));
        //Group B
        }else {
            attacking_role = role::get_role_by_class(&role_global, utf8(b"shinobi2_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"priest2_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tree3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();

        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
       //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
         role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment)]
    fun test_attack_sputter_to_second_by_percent(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"kunoichi1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"tree1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
        //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"kunoichi1_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"tree1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric1_1")));
        //Group B
        }else{
            attacking_role = role::get_role_by_class(&role_global, utf8(b"kunoichi3"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"priest2_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_attack_last_char(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"archer2"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"golem1_1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
         //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"archer2"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"golem1_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa1")));
        //Group B
        }else{
            attacking_role = role::get_role_by_class(&role_global, utf8(b"archer3"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"mega3"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree3")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();   
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_buff_add_all_tmp_attack(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"cleric1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"mega1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();

        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
        //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"cleric1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"mega1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"ani1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter1")));
        //Group B
        }else{
            attacking_role = role::get_role_by_class(&role_global, utf8(b"cleric2_1"));

            attacked_role = role::get_role_by_class(&role_global, utf8(b"ani2_1"));
            //attacked_role = role::get_role_by_class(&role_global, utf8(b"slime1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer3")));

            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"firemega1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"firemega2")));
            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shaman2")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacking_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacking_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_buff_add_all_tmp_sp(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"golem1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
         //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"golem1_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"assa1_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tree1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tree1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2")));
        //Group B
        }else{
            attacking_role = role::get_role_by_class(&role_global, utf8(b"golem2_1"));

            attacked_role = role::get_role_by_class(&role_global, utf8(b"priest2_1"));
            //attacked_role = role::get_role_by_class(&role_global, utf8(b"slime2_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter2")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi3")));
            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime3")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacking_role);
        let i = 0;
        let len = vector::length(&attacking_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacking_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_buff_add_all_tmp_hp(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());  
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"tank1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"mega1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();     
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
        //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"tank1_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"mega1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);
            
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter1")));
        //Group B
        }else {
            attacking_role = role::get_role_by_class(&role_global, utf8(b"tank3"));

            attacked_role = role::get_role_by_class(&role_global, utf8(b"priest2_1"));
            //attacked_role = role::get_role_by_class(&role_global, utf8(b"shaman3"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));

            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime1")));
            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime2_1")));          
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi3")));
            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shaman2_1")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacking_role);
        let i = 0;
        let len = vector::length(&attacking_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacking_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_buff_all_max_hp_to_back1(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());   
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"kunoichi1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"kunoichi1_1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();   
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
        //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"priest1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"wizard1_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"firemega1_1")));
        //Group B
        }else {
            attacking_role = role::get_role_by_class(&role_global, utf8(b"priest2_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"wizard2_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shaman2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"firemega2_1")));
        };

        //Test with none and then {shinobi2, 6} and then {{shinobi2, 6}, {golem2_1, 6}}
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        //{shinobi2, 6}
        let wrapper1 = utils::generate_wrapper_with_value(6);
        vec_map::insert(&mut permenant_increase_hp_info,  utf8(b"shinobi2"), wrapper1);
        //{{shinobi2, 6}, {golem2_1, 6}}
        vec_map::insert(&mut permenant_increase_hp_info,  utf8(b"golem2_1"), wrapper1);

        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print The vec_map, the result is a little different here
        //A: none -> {shinobi2, 6};
        //A: {shinobi2, 6} -> {shinobi2, 12};
        //B: none -> {golem2_1, 8};
        //A: {{shinobi2, 6}, {golem2_1, 6}} -> {{shinobi2, 6}, {golem2_1, 14}};
        //A:
        if(!use_a){
            print(&utf8(b"Permenant increase hp of shinobi2: "));
            let val_shinobi2 = utils::get_int(vec_map::get(&permenant_increase_hp_info, &utf8(b"shinobi2")));
            print(&val_shinobi2);
        };
        //B:
        if(!use_a){
            print(&utf8(b"Permenant increase hp of golem2_1: "));
            let val_golem2_1 = utils::get_int(vec_map::get(&permenant_increase_hp_info, &utf8(b"golem2_1")));
            print(&val_golem2_1);
        };
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_debuff_reduce_all_tmp_attack(){
        let role_global = role::generate_role_global(&mut tx_context::dummy()); 
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"fighter1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"tree1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();      
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
        //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"fighter1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"tree1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric1_1")));
        //Group B
        }else {
            attacking_role = role::get_role_by_class(&role_global, utf8(b"fighter2_1"));

            attacked_role = role::get_role_by_class(&role_global, utf8(b"priest2_1"));
            //attacked_role = role::get_role_by_class(&role_global, utf8(b"firemega1_1"));
            //attacked_role = role::get_role_by_class(&role_global, utf8(b"slime1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tree3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi3")));

            //vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shaman2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_debuff_reduce_tmp_attack(){
        let role_global = role::generate_role_global(&mut tx_context::dummy()); 
        let attacking_role = role::get_role_by_class(&role_global, utf8(b"ani1_1"));
        let attacked_role = role::get_role_by_class(&role_global, utf8(b"golem1_1"));
        let attacking_roles = vector::empty<Role>();
        let attacked_roles= vector::empty<Role>();
      
        //if true, use stats A, if false, use B
        let use_a = false;
        //There are A and B groups, B has higher stats, each team has five roles
        //Group A
        if(use_a){
            attacking_role = role::get_role_by_class(&role_global, utf8(b"ani1_1"));
            attacked_role = role::get_role_by_class(&role_global, utf8(b"golem1_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric1_1")));
        //Group B
        }else {
            attacking_role = role::get_role_by_class(&role_global, utf8(b"tree2_1"));

            attacked_role = role::get_role_by_class(&role_global, utf8(b"golem2_1"));
            //attacked_role = role::get_role_by_class(&role_global, utf8(b"slime2_1"));
            let cur_sp_cap = role::get_sp_cap(& attacking_role);
            role::set_sp(&mut attacking_role, cur_sp_cap);

            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));

            //vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"firemega2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
            //vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shaman2_1")));
            //vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"slime3")));
        };
        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();      
        action(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //call_skill(&mut attacking_role, &mut attacked_role, &mut attacking_roles, &mut attacked_roles, &mut permenant_increase_hp_info);
        //Print result
        role::print_role(&attacked_role);
        let i = 0;
        let len = vector::length(&attacked_roles);
        while(i < len){
             role::print_role(vector::borrow(&attacked_roles, i));
             i = i + 1;
        };      
        role::delete_role_global(role_global);
    }
}