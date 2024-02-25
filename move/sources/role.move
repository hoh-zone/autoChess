/*This module manages the 16 roles designed in the game. The functions include:
1. Set the initial attributes of each role
2. Provide different ways to return a random role for lineup or cards
3. Upgrade
*/
module auto_chess::role {
    use std::string::{utf8, String};
    use sui::tx_context::{TxContext};
    use std::debug::print;
    use sui::object::{UID, Self};
    use sui::transfer::{Self};
    use std::string;
    use sui::vec_map::{Self, VecMap};
    use std::vector;
    use auto_chess::utils;
    friend auto_chess::chess;
    friend auto_chess::lineup;

    const ERR_WRONG_LINEUP_LENGTH:u64 = 0x01;
    const ERR_DIFFERENT_class:u64 = 0x02;
    const ERR_DIFFERENT_hp:u64 = 0x03;
    const ERR_DIFFERENT_ATTACK:u64 = 0x04;

    // charactors specifies all the 16 classes' basic stats
    // Each class has the specifications of level 1,2,3,5,9 and corresponding stats
    struct Global has key {
        id: UID,
        charactors: VecMap<String, Role>
    }

    struct Role has store, copy, drop {
        class:String,
        attack: u64,
        hp: u64,
        sp: u8,
        level: u8,
        gold_cost: u8,
        sp_cap: u8,
        effect: String,
        effect_value: String,
        effect_type: String
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: vec_map::empty<String, Role>()
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: vec_map::empty<String, Role>()
        };
        transfer::share_object(global);
    }

    public fun init_charactors1(global: &mut Global) {
        vec_map::insert(&mut global.charactors, utf8(b"assa1"), Role {class:utf8(b"assa1"), level: 1, gold_cost: 3, attack:  6, hp: 8, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"assa1_1"), Role {class:utf8(b"assa1_1"), level: 2, gold_cost: 5, attack:  6, hp: 8, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"assa2"), Role {class:utf8(b"assa2"), level: 3, gold_cost: 8, attack:  12, hp: 15, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"assa2_1"), Role {class:utf8(b"assa2_1"), level: 6, gold_cost: 9, attack:  12, hp: 15, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"assa3"), Role {class:utf8(b"assa3"), level: 9, gold_cost: 10, attack:  24, hp: 37, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"18")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1"), Role {class:utf8(b"cleric1"), level: 1, gold_cost: 3, attack:  3, hp: 8, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1_1"), Role {class:utf8(b"cleric1_1"), level: 2, gold_cost: 5, attack:  3, hp: 8, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2"), Role {class:utf8(b"cleric2"), level: 3, gold_cost: 8, attack:  6, hp: 15, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2_1"), Role {class:utf8(b"cleric2_1"), level: 6, gold_cost: 9, attack:  6, hp: 15, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric3"), Role {class:utf8(b"cleric3"), level: 9, gold_cost: 10, attack:  12, hp: 37, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1"), Role {class:utf8(b"fighter1"), level: 1, gold_cost: 3, attack:  4, hp: 9, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1_1"), Role {class:utf8(b"fighter1_1"), level: 2, gold_cost: 5, attack:  4, hp: 9, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2"), Role {class:utf8(b"fighter2"), level: 3, gold_cost: 8, attack:  12, hp: 18, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2_1"), Role {class:utf8(b"fighter2_1"), level: 6, gold_cost: 9, attack:  12, hp: 18, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter3"), Role {class:utf8(b"fighter3"), level: 9, gold_cost: 10, attack:  24, hp: 45, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"golem1"), Role {class:utf8(b"golem1"), level: 1, gold_cost: 3, attack:  4, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem1_1"), Role {class:utf8(b"golem1_1"), level: 2, gold_cost: 5, attack:  4, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem2"), Role {class:utf8(b"golem2"), level: 3, gold_cost: 8, attack:  8, hp: 24, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem2_1"), Role {class:utf8(b"golem2_1"), level: 6, gold_cost: 9, attack:  8, hp: 24, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem3"), Role {class:utf8(b"golem3"), level: 9, gold_cost: 10, attack:  16, hp: 60, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"tank1"), Role {class:utf8(b"tank1"), level: 1, gold_cost: 3, attack:  3, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"tank1_1"), Role {class:utf8(b"tank1_1"), level: 2, gold_cost: 5, attack:  3, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"tank2"), Role {class:utf8(b"tank2"), level: 3, gold_cost: 8, attack:  6, hp: 24, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"tank2_1"), Role {class:utf8(b"tank2_1"), level: 6, gold_cost: 9, attack:  6, hp: 24, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"tank3"), Role {class:utf8(b"tank3"), level: 9, gold_cost: 10, attack:  12, hp: 60, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega1"), Role {class:utf8(b"mega1"), level: 1, gold_cost: 3, attack:  4, hp: 11, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"mega1_1"), Role {class:utf8(b"mega1_1"), level: 2, gold_cost: 5, attack:  4, hp: 11, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"mega2"), Role {class:utf8(b"mega2"), level: 3, gold_cost: 8, attack:  8, hp: 21, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega2_1"), Role {class:utf8(b"mega2_1"), level: 6, gold_cost: 8, attack:  8, hp: 21, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega3"), Role {class:utf8(b"mega3"), level: 9, gold_cost: 10, attack:  16, hp: 50, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"16")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1"), Role {class:utf8(b"shaman1"), level: 1, gold_cost: 3, attack:  5, hp: 9, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1_1"), Role {class:utf8(b"shaman1_1"), level: 2, gold_cost: 5, attack:  5, hp: 9, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2"), Role {class:utf8(b"shaman2"), level: 3, gold_cost: 8, attack:  10, hp: 21, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2_1"), Role {class:utf8(b"shaman2_1"), level: 6, gold_cost: 9, attack:  10, hp: 21, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman3"), Role {class:utf8(b"shaman3"), level: 9, gold_cost: 10, attack:  20, hp: 65, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1"), Role {class:utf8(b"firemega1"), level: 1, gold_cost: 3, attack:  6, hp: 8, sp: 0, sp_cap: 3, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1_1"), Role {class:utf8(b"firemega1_1"), level: 2, gold_cost: 5, attack:  6, hp: 8, sp: 0, sp_cap: 3, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2"), Role {class:utf8(b"firemega2"), level: 3, gold_cost: 8, attack:  12, hp: 15, sp: 0, sp_cap: 2, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2_1"), Role {class:utf8(b"firemega2_1"), level: 6, gold_cost: 9,  attack:  12, hp: 15, sp: 0, sp_cap: 2, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega3"), Role {class:utf8(b"firemega3"), level: 9, gold_cost: 10, attack:  24, hp: 37, sp: 0, sp_cap: 1, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
    }

    public fun init_charactors2(global:&mut Global) {
        vec_map::insert(&mut global.charactors, utf8(b"slime1"), Role {class:utf8(b"slime1"), level: 1, gold_cost: 3, attack:  6, hp: 9, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"slime1_1"), Role {class:utf8(b"slime1_1"), level: 2, gold_cost: 5, attack:  6, hp: 9, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"slime2"), Role {class:utf8(b"slime2"), level: 3, gold_cost: 8, attack:  10, hp: 30, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"slime2_1"), Role {class:utf8(b"slime2_1"), level: 6, gold_cost: 9, attack:  10, hp: 30, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"slime3"), Role {class:utf8(b"slime3"), level: 9, gold_cost: 10, attack:  20, hp: 65, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"10")});
        vec_map::insert(&mut global.charactors, utf8(b"ani1"), Role {class:utf8(b"ani1"), level: 1, gold_cost: 3, attack:  4, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"ani1_1"), Role {class:utf8(b"ani1_1"), level: 2, gold_cost: 5, attack:  4, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"ani2"), Role {class:utf8(b"ani2"), level: 3, gold_cost: 8, attack:  8, hp: 24, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"ani2_1"), Role {class:utf8(b"ani2_1"), level: 6, gold_cost: 9, attack:  8, hp: 24, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"ani3"), Role {class:utf8(b"ani3"), level: 9, gold_cost: 10, attack:  16, hp: 60, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"9")});
        vec_map::insert(&mut global.charactors, utf8(b"tree1"), Role {class:utf8(b"tree1"), level: 1, gold_cost: 3, attack:  5, hp: 11, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"tree1_1"), Role {class:utf8(b"tree1_1"), level: 2, gold_cost: 5, attack:  5, hp: 11, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"tree2"), Role {class:utf8(b"tree2"), level: 3, gold_cost: 8, attack:  10, hp: 21, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"tree2_1"), Role {class:utf8(b"tree2_1"), level: 6, gold_cost: 9, attack:  10, hp: 21, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"tree3"), Role {class:utf8(b"tree3"), level: 9, gold_cost: 10, attack:  20, hp: 50, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"9")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1"), Role {class:utf8(b"wizard1"), level: 1, gold_cost: 3, attack:  5, hp: 9, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1_1"), Role {class:utf8(b"wizard1_1"), level: 2, gold_cost: 5, attack:  5, hp: 9, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2"), Role {class:utf8(b"wizard2"), level: 3, gold_cost: 8, attack:  10, hp: 18, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2_1"), Role {class:utf8(b"wizard2_1"), level: 6, gold_cost: 9, attack:  10, hp: 18, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard3"), Role {class:utf8(b"wizard3"), level: 9, gold_cost: 10, attack:  20, hp: 45, sp: 0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"priest1"), Role {class:utf8(b"priest1"), level: 1, gold_cost: 3, attack:  3, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"priest1_1"), Role {class:utf8(b"priest1_1"), level: 2, gold_cost: 5, attack:  3, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"priest2"), Role {class:utf8(b"priest2"), level: 3, gold_cost: 8, attack:  6, hp: 24, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"priest2_1"), Role {class:utf8(b"priest2_1"), level: 6, gold_cost: 9, attack:  6, hp: 24, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"priest3"), Role {class:utf8(b"priest3"), level: 9, gold_cost: 10, attack:  12, hp: 60, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi1"), Role {class:utf8(b"shinobi1"), level: 1, gold_cost: 3, attack:  4, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi1_1"), Role {class:utf8(b"shinobi1_1"), level: 2, gold_cost: 5, attack:  4, hp: 12, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi2"), Role {class:utf8(b"shinobi2"), level: 3, gold_cost: 8, attack:  8, hp: 24, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi2_1"), Role {class:utf8(b"shinobi2_1"), level: 6, gold_cost: 9, attack:  8, hp: 24, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi3"), Role {class:utf8(b"shinobi3"), level: 9, gold_cost: 10, attack:  16, hp: 60, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi1"), Role {class:utf8(b"kunoichi1"), level: 1, gold_cost: 3, attack:  6, hp: 9, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi1_1"), Role {class:utf8(b"kunoichi1_1"), level: 2, gold_cost: 5, attack:  6, hp: 9, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi2"), Role {class:utf8(b"kunoichi2"), level: 3, gold_cost: 8, attack:  12, hp: 18, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi2_1"), Role {class:utf8(b"kunoichi2_1"), level: 6, gold_cost: 9, attack:  12, hp: 18, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi3"), Role {class:utf8(b"kunoichi3"), level: 9, gold_cost: 10, attack:  24, hp: 45, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"archer1"), Role {class:utf8(b"archer1"), level: 1, gold_cost: 3, attack:  6, hp: 9, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"7")});
        vec_map::insert(&mut global.charactors, utf8(b"archer1_1"), Role {class:utf8(b"archer1_1"), level: 2, gold_cost: 5, attack:  6, hp: 9, sp: 0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"7")});
        vec_map::insert(&mut global.charactors, utf8(b"archer2"), Role {class:utf8(b"archer2"), level: 3, gold_cost: 8, attack:  12, hp: 18, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"14")});
        vec_map::insert(&mut global.charactors, utf8(b"archer2_1"), Role {class:utf8(b"archer2_1"), level: 6, gold_cost: 9, attack:  12, hp: 18, sp: 0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"14")});
        vec_map::insert(&mut global.charactors, utf8(b"archer3"), Role {class:utf8(b"archer3"), level: 9, gold_cost: 10, attack:  24, hp: 45, sp: 0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"24")});
    }

    // for loop init
    public fun init_role() : Role {
        Role {
            class:utf8(b"init"),
            attack: 0,
            hp: 0,
            sp : 0,
            level: 0,
            gold_cost: 0,
            sp_cap: 0,
            effect: utf8(b""),
            effect_value: utf8(b""),
            effect_type: utf8(b"")
        }
    }

    // when a hero is removed it is set to be 'none', could happen in card pool (hero pool) and player lineup
    public fun empty() : Role {
        Role {
            class:utf8(b"none"),
            attack: 0,
            hp: 0,
            sp : 0,
            level: 0,
            gold_cost: 0,
            sp_cap: 0,
            effect: utf8(b""),
            effect_value: utf8(b""),
            effect_type: utf8(b"")
        }
    }

    // return a randomly decided class of charactor of level 1, 3 or 9
    // level is predetermined and class is randomly chosen
    fun get_random_role_by_level(global: &Global, level:u64, random: u64, _ctx:&mut TxContext) :Role {
        let max_roles_per_level = vec_map::size(&global.charactors) / 5;
        let index = random % max_roles_per_level;
        if (level == 3) {
            let (_class, role) = vec_map::get_entry_by_idx(&global.charactors, 2 + 5 * index);
            *role
        } else if (level == 9) {
            let (_class, role) = vec_map::get_entry_by_idx(&global.charactors, 4 + 5 * index);
            *role
        } else {
            let (_class, role) = vec_map::get_entry_by_idx(&global.charactors, 5 * index);
            *role
        }
    }

    // p2 and p3 are calculated in lineup::generate_lineup_by_power
    // p2 = 35 * power; p3 = 0 or 2 times power when power >16
    // higher p3 is more likely to get a level 9 charactor
    // higher p2 is more likely to get a level 3 charactor
    public(friend) fun get_random_role_by_power(global: &Global, seed:u8, p2:u64, p3:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p3) {
            get_random_role_by_level(global, 9, random, ctx)
        } else if (random < p2) {
            get_random_role_by_level(global, 3, random, ctx)
        } else {
            get_random_role_by_level(global, 1, random, ctx)
        }
    }

    // return a random class charactor of level 1, it is created for the basic hero pool with 30 heros
    public(friend) fun create_random_role_for_cards(global: &Global, seed:u8, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        get_random_role_by_level(global, 1, random, ctx)
    }

    public fun get_role_by_class(global:&Global, class:String) : Role {
        print(&class);
        *vec_map::get(&global.charactors, &class)
    }

    public fun get_attack(role:&Role) : u64 {
        role.attack
    }

    public fun set_attack(role:&mut Role, attack:u64) {
        role.attack = attack;
    }

    public fun get_gold_cost(role:&Role) : u8 {
        let level = role.level;
        if (level == 1) {
            3
        } else if (level == 2) {
            5
        } else {
            6
        }
    }

    public fun get_class(role:&Role) : String {
        role.class
    }

    public fun get_hp(role:&Role) : u64 {
        role.hp
    }

    public fun get_level(role:&Role) : u8 {
        role.level
    }

    public fun set_hp(role:&mut Role, hp:u64) {
        role.hp = hp;
    }

    public fun set_level(role:&mut Role, level:u8) {
        role.level = level;
    }

    public fun set_class(role:&mut Role, class:String) {
        role.class = class;
    }

    public fun set_sp(role: &mut Role, value:u8) {
        role.sp = value;
    }

    public fun get_sp_cap(role: &Role) : u8 {
        role.sp_cap
    }

    public fun get_sp(role: &Role) : u8 {
        role.sp
    }

    public fun get_effect(role: &Role) : String {
        role.effect
    }

    public fun get_effect_value(role: &Role) : String {
        role.effect_value
    }

    public fun get_effect_type(role: &Role) : String {
        role.effect_type
    }

    // merge the two roles and get a stronger role
    public fun upgrade(global:&Global, from_role: &Role, to_role: &mut Role): bool {
        let sub_class1 = string::sub_string(&from_role.class, 0, 3);
        let sub_class2 = string::sub_string(&to_role.class, 0, 3);
        if (sub_class1 != sub_class2){
            return false
        };
        let level1 = from_role.level;
        let level2 = to_role.level;
        let hp1 = from_role.hp;
        let hp2 = to_role.hp;
        let attack1 = from_role.attack;
        let attack2 = to_role.attack;
        if (level1 > level2) {
            let tmp = level2;
            let tmp_hp = hp2;
            let tmp_attack = attack2;
            hp2 = hp1;
            hp1 = tmp_hp;
            attack2 = attack1;
            attack1 = tmp_attack;
            level2 = level1;
            level1 = tmp;
        };
        if (level1 < 9 && level2 < 9) {
            let updated_level = level1 + level2;
            if (updated_level > 9) {
                updated_level = 9;
            };
            to_role.level = updated_level;
            let base_class = utils::removeSuffix(to_role.class);
            let original_class1 = utils::get_class_by_level(base_class, level1);
            let original_class2 = utils::get_class_by_level(base_class, level2);
            let original_role1 = get_role_by_class(global, original_class1);
            let original_role2 = get_role_by_class(global, original_class2);

            let hp1_diff = hp1 - original_role1.hp;
            let hp2_diff = hp2 - original_role2.hp;
            let hp_diff;
            if (hp1_diff > hp2_diff) {
                hp_diff = hp1_diff;
            } else {
                hp_diff = hp2_diff;
            };

            let attack1_diff = attack1 - original_role1.attack;
            let attack2_diff = attack2 - original_role2.attack;
            let attack_diff;
            if (attack1_diff > attack2_diff) {
                attack_diff = attack1_diff;
            } else {
                attack_diff = attack2_diff;
            };
            let updated_class = utils::get_class_by_level(base_class, updated_level);
            let updated_role = get_role_by_class(global, updated_class);
            to_role.class = updated_class;
            to_role.sp_cap = updated_role.sp_cap;
            to_role.gold_cost = updated_role.gold_cost;
            to_role.attack = updated_role.attack + attack_diff;
            to_role.hp = updated_role.hp + hp_diff;
            to_role.effect_value = updated_role.effect_value;
        } else {
            return false
        };
        true
    }

    public fun get_sell_gold_cost(role: &Role) : u8 {
        let level = role.level;
        if (level < 3) {
            2
        } else if (level < 9) {
            6
        } else {
            8
        }
    }

    // determine if the two vectors of roles are the same, meaning same class same stats same order
    public fun check_roles_equality(roles1: &vector<Role>, roles2: &vector<Role>) : bool {
        assert!(vector::length(roles1) == 6, ERR_WRONG_LINEUP_LENGTH);
        assert!(vector::length(roles2) == 6, ERR_WRONG_LINEUP_LENGTH);
        let i = 0;
        while (i < 6) {
            let role1 = vector::borrow(roles1, i);
            let role2 = vector::borrow(roles2, i);
            if (role1.class == utf8(b"none") && role2.class == utf8(b"none")) {
                i = i + 1;
                continue
            };
            assert!(role1.class == role2.class, ERR_DIFFERENT_class);
            assert!(role1.hp == role2.hp, ERR_DIFFERENT_hp);
            assert!(role1.attack == role2.attack, ERR_DIFFERENT_ATTACK);
            i = i + 1;
        };
        true
    }
}