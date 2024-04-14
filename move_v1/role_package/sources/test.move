// Copyright 2023 ComingChat Authors. Licensed under Apache-2.0 License.
#[test_only]
module role_package::test {
    use std::string::{utf8, String, Self};
    use sui::clock::{Self};
    use sui::test_scenario::{
        Scenario, next_tx, begin, end, ctx, take_shared, return_shared, take_from_sender,return_to_sender,
        next_epoch
    };
    use std::vector;
    use std::debug::print;
    use role_package::role;

    fun scenario(): Scenario { begin(@admin) }

    #[test]
    fun test_virtual_fight() {
        let scenario = scenario();
        let test = &mut scenario;
        let admin = @admin;
        next_tx(test, admin);
        {
            // init modules
            role::init_for_test(ctx(test));
            next_epoch(test, admin);
            let roleGlobal = take_shared<role::Global>(test);
            role::init_charactors1(&mut roleGlobal);
            return_shared(roleGlobal);
        };
        end(scenario);
    }
}