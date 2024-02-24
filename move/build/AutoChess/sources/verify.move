// verify the oprations, it seems this part consumes much gas, i don't know why.
module auto_chess::verify {
    use sui::tx_context::{TxContext};
    use std::string::{utf8, String};
    use std::vector;
    use auto_chess::lineup; 
    use auto_chess::role::{Self, Role};
    use auto_chess::utils;

    const REFRESH_gold_cost:u8 = 2;
    const CARDS_IN_ONE_REFRESH:u64 = 5;
    const ERR_NOT_ENOUGH_GOLD:u64 = 0x07;
    const ERR_INVALID_CHARACTOR:u64 = 0x08;
    const ERR_CHARACTOR_IS_NONE:u64 = 0x09;
    const ERR_UPGRADE_FAILED:u64 = 0x10;
    const ERR_SAME_INDEX_UPGRADE:u64 = 0x11;
    const ERR_CHECK_ROLES_NOT_EQUAL:u64 = 0x12;
    const ERR_WRONG_LEFT_GOLD:u64 = 0x13;

    // buy upgrade means players drag(buy) a role from shop, and put it in the same role in his lineup, "buy and upgrade your role"
    // swap means swap the postion of your 2 roles
    // refresh means refresh your cards in shop
    public fun verify_operation(role_global:&role::Global, init_roles:&mut vector<Role>, cards_pool_roles: &mut vector<Role>, operations: vector<String>,
        left_gold:u8, lineup_str_vec: vector<String>, name:String, gold:u8, ticket_gold_cost:u64, 
        ctx:&mut TxContext) {
        let refresh_time = 0;
        vector::reverse(&mut operations);
        while(vector::length(&operations) > 0) {
            let operate = vector::pop_back(&mut operations);
            if (operate == utf8(b"buy_upgrade")) {
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role;
                let gold_cost;
                {
                    from_role = *vector::borrow<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                    gold_cost = role::get_gold_cost(&from_role);
                    assert!(role::get_class(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_class(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(cards_pool_roles, from_index);
                role::set_class(from_role_mut, utf8(b"none"));
                gold = gold - gold_cost;
            } else if (operate == utf8(b"buy")) {
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role = vector::borrow_mut<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                assert!(role::get_class(from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let copy_role = *from_role;
                role::set_class(from_role, utf8(b"none"));
                let empty = vector::borrow<role::Role>(init_roles, to_index);
                assert!(role::get_class(empty) == utf8(b"none"), ERR_INVALID_CHARACTOR);
                vector::remove(init_roles, to_index);
                vector::insert(init_roles, copy_role, to_index);
                let gold_cost = role::get_gold_cost(&copy_role);
                gold = gold - gold_cost;
            } else if (operate == utf8(b"swap")) {
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                vector::swap(init_roles, from_index, to_index);
            } else if (operate == utf8(b"sell")) {
                let sub_str = vector::pop_back(&mut operations);
                let from_index = utils::utf8_to_u64(sub_str);
                let from_role = vector::borrow_mut<role::Role>(init_roles, from_index);
                assert!(role::get_class(from_role) != utf8(b"none"), ERR_INVALID_CHARACTOR);
                role::set_class(from_role, utf8(b"none"));
                gold = gold + role::get_sell_gold_cost(from_role);
            } else if (operate == utf8(b"upgrade")) {
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                assert!(from_index != to_index, ERR_SAME_INDEX_UPGRADE);
                let from_role;
                {
                    from_role = *vector::borrow<role::Role>(init_roles, from_index);
                    assert!(role::get_class(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_class(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(init_roles, from_index);
                role::set_class(from_role_mut, utf8(b"none"));
            } else if (operate == utf8(b"refresh")) {
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