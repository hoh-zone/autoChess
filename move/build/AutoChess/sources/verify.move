module auto_chess::verify {
    use sui::tx_context::{Self, TxContext};
    use std::string::{utf8, String, Self};
    use std::vector;
    use std::debug::print;
    use auto_chess::lineup::{Self, LineUp}; 
    use auto_chess::role::{Self, Role};
    use auto_chess::utils;
    use sui::sui::SUI;

    const INIT_GOLD:u64 = 10;
    const REFRESH_PRICE:u8 = 2;
    const CARDS_IN_ONE_REFRESH:u64 = 5;
    const ERR_NOT_ENOUGH_GOLD:u64 = 0x07;
    const ERR_INVALID_CHARACTOR:u64 = 0x08;
    const ERR_CHARACTOR_IS_NONE:u64 = 0x09;
    const ERR_UPGRADE_FAILED:u64 = 0x10;
    const ERR_SAME_INDEX_UPGRADE:u64 = 0x11;
    const ERR_CHECK_ROLES_NOT_EQUAL:u64 = 0x12;
    const ERR_WRONG_LEFT_GOLD:u64 = 0x13;

    public fun verify_operation(role_global:&role::Global, init_roles:&mut vector<Role>, cards_pool_roles: &mut vector<Role>, operations: vector<String>, left_gold:u8, lineup_str_vec: vector<String>, name:String, gold:u8, ctx:&mut TxContext) {
        let refresh_time = 0;
        vector::reverse(&mut operations);
        while(vector::length(&operations) > 0) {
            let operate = vector::pop_back(&mut operations);
            if (string::index_of(&operate, &utf8(b"buy_upgrade")) == 0) {
                print(&utf8(b"buy_upgrade operation"));
                let sub_str = string::sub_string(&operate, 11 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role = role::init_role();
                let price;
                {
                    from_role = *vector::borrow<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                    price = role::get_price(&from_role);
                    assert!(role::get_name(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_name(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(cards_pool_roles, from_index);
                role::set_name(from_role_mut, utf8(b"none"));
                assert!(gold >= price, ERR_NOT_ENOUGH_GOLD);
                gold = gold - price;
            } else if (string::index_of(&operate, &utf8(b"buy")) == 0) {
                print(&utf8(b"buy operation"));
                let sub_str = string::sub_string(&operate, 3 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                let from_role = vector::borrow_mut<role::Role>(cards_pool_roles, from_index + CARDS_IN_ONE_REFRESH * refresh_time);
                assert!(role::get_name(from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let copy_role = *from_role;
                role::set_name(from_role, utf8(b"none"));
                let empty = vector::borrow<role::Role>(init_roles, to_index);
                assert!(role::get_name(empty) == utf8(b"none"), ERR_INVALID_CHARACTOR);
                vector::remove(init_roles, to_index);
                vector::insert(init_roles, copy_role, to_index);
                let price = role::get_price(&copy_role);
                assert!(gold >= price, ERR_NOT_ENOUGH_GOLD);
                gold = gold - price;
            } else if (string::index_of(&operate, &utf8(b"swap")) == 0) {
                print(&utf8(b"swap operation"));
                let sub_str = string::sub_string(&operate, 4 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                vector::swap(init_roles, from_index, to_index);
            } else if (string::index_of(&operate, &utf8(b"sell")) == 0) {
                print(&utf8(b"sell operation"));
                let sub_str = string::sub_string(&operate, 4 + 1, string::length(&operate));
                let from_index = utils::utf8_to_u64(sub_str);
                let from_role = vector::borrow_mut<role::Role>(init_roles, from_index);
                assert!(role::get_name(from_role) != utf8(b"none"), ERR_INVALID_CHARACTOR);
                role::set_name(from_role, utf8(b"none"));
                gold = gold + role::get_sell_price(from_role);
            } else if (string::index_of(&operate, &utf8(b"upgrade")) == 0) {
                print(&utf8(b"upgrade operation"));
                let sub_str = string::sub_string(&operate, 7 + 1, string::length(&operate));
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                assert!(from_index != to_index, ERR_SAME_INDEX_UPGRADE);
                let from_role = role::init_role();
                {
                    from_role = *vector::borrow<role::Role>(init_roles, from_index);
                    print(&from_index);
                    assert!(role::get_name(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                };
                let to_role = vector::borrow_mut<role::Role>(init_roles, to_index);
                assert!(role::get_name(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                let res = role::upgrade(role_global, &from_role, to_role);
                assert!(res, ERR_UPGRADE_FAILED);
                let from_role_mut = vector::borrow_mut<role::Role>(init_roles, from_index);
                role::set_name(from_role_mut, utf8(b"none"));
            } else if (string::index_of(&operate, &utf8(b"refresh")) == 0) {
                print(&utf8(b"refresh operation"));
                assert!(gold >= REFRESH_PRICE, ERR_NOT_ENOUGH_GOLD);
                gold = gold - REFRESH_PRICE;
                refresh_time = refresh_time + 1;
            } else {
                print(&utf8(b"invalid operation"));
            }
        };
        let expected_lineup = lineup::parse_lineup_str_vec(name, role_global, lineup_str_vec, ctx);
        let expected_roles = lineup::get_roles(&expected_lineup);
        assert!(role::check_roles_equal(init_roles, expected_roles), ERR_CHECK_ROLES_NOT_EQUAL);
        assert!(gold == left_gold, ERR_WRONG_LEFT_GOLD);
    }
}