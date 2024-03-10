// verify the oprations, it seems this part consumes much gas, i don't know why.
module verify_package::verify {
    use sui::tx_context::{TxContext};
    use std::string::{utf8, String};
    use std::vector;
    use lineup_package::lineup; 
    use role_package::role::{Self, Role};
    use util_package::utils;

    const REFRESH_gold_cost:u8 = 2;
    const CARDS_IN_ONE_REFRESH:u64 = 5;
    const ERR_INVALID_CHARACTOR:u64 = 0x001;
    const ERR_CHARACTOR_IS_NONE:u64 = 0x002;
    const ERR_UPGRADE_FAILED:u64 = 0x003;
    const ERR_SAME_INDEX_UPGRADE:u64 = 0x004;
    const ERR_CHECK_ROLES_NOT_EQUAL:u64 = 0x005;
    const ERR_WRONG_LEFT_GOLD:u64 = 0x006;
    const ERR_EXCEED_VEC_LENGTH:u64 = 0x007;

    // Operations record the orders made by the play from the interaction with the frontend game portal.
    // Commands include: buy_upgrade; upgrade; buy; sell; swap;
    // Operations are a list of commands and each entry is one command
    // buy upgrade means players drag(buy) a role from shop, and put it in the same role in his lineup, "buy and upgrade your role"
    // swap means swap the postion of 2 roles
    // refresh means refresh your cards in shop, it actually shifts/rotates the index by 5
    // init_roles refers to the current roles in the lineup
    // gold is the action point given for the operations, supposely 10, 
    // left gold is the frontend left gold after the operations, the function needs to make sure that:
    // left_gold = gold - operation_spending to make sure that operations are not tampered
    // lineup_str_vec is the description of the lineup after operations on the frontend, the function updates the lineup
    // after prosessing the operations recorded from frontend and makes sure that it is the same as the pure frontend result
    public fun verify_operation(role_global:&role::Global, init_roles:&mut vector<Role>, cards_pool_roles: &mut vector<Role>, operations: vector<String>,
        left_gold:u8, lineup_str_vec: vector<String>, name:String, gold:u8, ticket_gold_cost:u64, 
        ctx:&mut TxContext) {
        // more like rounds of role rotation
        let refresh_time = 0;
        vector::reverse(&mut operations);
        while(vector::length(&operations) > 0) {
            let operate = vector::pop_back(&mut operations);
            if (operate == utf8(b"buy_upgrade")) {
                // Buy a hero from the card pool and merge with a compatible hero in player lineup to upgrade the hero   
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role;
                let gold_cost;
                {
                    // return the chosen hero in the hero pool, current index is the position of the present 5 heros
                    // hero_pool_index = current_index + rotation_times*number_of_hero_present_in_each_rotation
                    assert!(vector::length(cards_pool_roles) > (from_index + CARDS_IN_ONE_REFRESH * refresh_time), ERR_EXCEED_VEC_LENGTH);
                    from_role = *vector::borrow<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                    gold_cost = role::get_gold_cost(&from_role);
                    assert!(role::get_class(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                assert!(vector::length(init_roles) > to_index, ERR_EXCEED_VEC_LENGTH);
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_class(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                // The chosen hero in the hero pool is removed by setting it's name to "none"
                let from_role_mut = vector::borrow_mut<role::Role>(cards_pool_roles, from_index);
                role::set_class(from_role_mut, utf8(b"none"));
                gold = gold - gold_cost;
            } else if (operate == utf8(b"buy")) {
                // buy the chosen hero in the hero pool, has to be placed in an 'empty' lineup position  
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                assert!(vector::length(cards_pool_roles) > (from_index + CARDS_IN_ONE_REFRESH * refresh_time), ERR_EXCEED_VEC_LENGTH);
                let from_role = vector::borrow_mut<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                assert!(role::get_class(from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let copy_role = *from_role;
                role::set_class(from_role, utf8(b"none"));
                assert!(vector::length(init_roles) > to_index, ERR_EXCEED_VEC_LENGTH);
                let empty = vector::borrow<role::Role>(init_roles, to_index);
                assert!(role::get_class(empty) == utf8(b"none"), ERR_INVALID_CHARACTOR);
                vector::remove(init_roles, to_index);
                vector::insert(init_roles, copy_role, to_index);
                let gold_cost = role::get_gold_cost(&copy_role);
                gold = gold - gold_cost;
            } else if (operate == utf8(b"swap")) {
                // swap the two chose heroes in the player lineup (why??? should not affect much)    
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                vector::swap(init_roles, from_index, to_index);
            } else if (operate == utf8(b"sell")) {
                // sell the chosen hero in the player's lineup and remove it form the player lineup by setting to 'none' 
                let sub_str = vector::pop_back(&mut operations);
                let from_index = utils::utf8_to_u64(sub_str);
                assert!(vector::length(init_roles) > from_index, ERR_EXCEED_VEC_LENGTH);
                let from_role = vector::borrow_mut<role::Role>(init_roles, from_index);
                assert!(role::get_class(from_role) != utf8(b"none"), ERR_INVALID_CHARACTOR);
                role::set_class(from_role, utf8(b"none"));
                gold = gold + role::get_sell_gold_cost(from_role);
            } else if (operate == utf8(b"upgrade")) {
                // merge(upgrade) the two chosen heroes in the player lineup into one and remove the hero corressponding to
                // from index, the operation does not cost
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                assert!(from_index != to_index, ERR_SAME_INDEX_UPGRADE);
                let from_role;
                {
                    assert!(vector::length(init_roles) > from_index, ERR_EXCEED_VEC_LENGTH);
                    from_role = *vector::borrow<role::Role>(init_roles, from_index);
                    assert!(role::get_class(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                assert!(vector::length(init_roles) > to_index, ERR_EXCEED_VEC_LENGTH);
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_class(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(init_roles, from_index);
                role::set_class(from_role_mut, utf8(b"none"));
            } else if (operate == utf8(b"refresh")) {
                // rotate the hero pool, each rotation action costs 2 gold
                gold = gold - REFRESH_gold_cost;
                refresh_time = refresh_time + 1;
            }
        };
        let expected_lineup = lineup::parse_lineup_str_vec(name, role_global, lineup_str_vec, ticket_gold_cost, ctx);
        let expected_roles = lineup::get_roles(&expected_lineup);
        assert!(role::check_roles_equality(init_roles, expected_roles), ERR_CHECK_ROLES_NOT_EQUAL);
        assert!(gold == left_gold, ERR_WRONG_LEFT_GOLD);
    }
}