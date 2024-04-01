/*This module manages the 16 roles designed in the game. The functions include:
1. Set the initial attributes of each role
2. Provide different ways to return a random role for lineup or cards
3. Upgrade
*/
module role_package::role {
    use std::string::{Self, utf8, String};
    use std::debug::print;
    use std::vector;

    use sui::tx_context::{Self, TxContext};
    use sui::object::{UID, Self};
    use sui::transfer::{Self};
    use sui::vec_map::{Self, VecMap};

    use util_package::utils::{Self, Int_wrapper};
    // friend auto_chess::chess;
    // friend auto_chess::lineup;

    const ERR_WRONG_LINEUP_LENGTH:u64 = 0x001;
    const ERR_DIFFERENT_class:u64 = 0x002;
    const ERR_DIFFERENT_hp:u64 = 0x003;
    const ERR_DIFFERENT_ATTACK:u64 = 0x004;

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
        speed: u64,
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

    public fun init_charactors1(global: &mut Global) {
        vec_map::insert(&mut global.charactors, utf8(b"assa1"), Role {class:utf8(b"assa1"), level: 1, gold_cost: 3, attack:  6, hp: 8, speed: 10, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"assa1_1"), Role {class:utf8(b"assa1_1"), level: 2, gold_cost: 5, attack:  6, hp: 8, speed: 10, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"assa2"), Role {class:utf8(b"assa2"), level: 3, gold_cost: 8, attack:  12, hp: 15, speed: 12, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"assa2_1"), Role {class:utf8(b"assa2_1"), level: 6, gold_cost: 9, attack:  12, hp: 15, speed: 12, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"assa3"), Role {class:utf8(b"assa3"), level: 9, gold_cost: 10, attack:  24, hp: 37, speed: 14, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"18")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1"), Role {class:utf8(b"cleric1"), level: 1, gold_cost: 3, attack:  3, hp: 8, speed: 5, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1_1"), Role {class:utf8(b"cleric1_1"), level: 2, gold_cost: 5, attack:  3, hp: 8, speed: 5, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2"), Role {class:utf8(b"cleric2"), level: 3, gold_cost: 8, attack:  6, hp: 15, speed: 7, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2_1"), Role {class:utf8(b"cleric2_1"), level: 6, gold_cost: 9, attack:  6, hp: 15, speed: 7, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric3"), Role {class:utf8(b"cleric3"), level: 9, gold_cost: 10, attack:  12, hp: 37, speed: 10, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1"), Role {class:utf8(b"fighter1"), level: 1, gold_cost: 3, attack:  4, hp: 9, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1_1"), Role {class:utf8(b"fighter1_1"), level: 2, gold_cost: 5, attack:  4, hp: 9, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2"), Role {class:utf8(b"fighter2"), level: 3, gold_cost: 8, attack:  12, hp: 18, speed: 8, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2_1"), Role {class:utf8(b"fighter2_1"), level: 6, gold_cost: 9, attack:  12, hp: 18, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter3"), Role {class:utf8(b"fighter3"), level: 9, gold_cost: 10, attack:  24, hp: 45, speed: 12, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"golem1"), Role {class:utf8(b"golem1"), level: 1, gold_cost: 3, attack:  4, hp: 12, speed: 4, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem1_1"), Role {class:utf8(b"golem1_1"), level: 2, gold_cost: 5, attack:  4, hp: 12, speed: 4, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem2"), Role {class:utf8(b"golem2"), level: 3, gold_cost: 8, attack:  8, hp: 24, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem2_1"), Role {class:utf8(b"golem2_1"), level: 6, gold_cost: 9, attack:  8, hp: 24, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem3"), Role {class:utf8(b"golem3"), level: 9, gold_cost: 10, attack:  16, hp: 60, speed: 13, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_sp"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"tank1"), Role {class:utf8(b"tank1"), level: 1, gold_cost: 3, attack:  3, hp: 12, speed: 4, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"tank1_1"), Role {class:utf8(b"tank1_1"), level: 2, gold_cost: 5, attack:  3, hp: 12, speed: 4, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"tank2"), Role {class:utf8(b"tank2"), level: 3, gold_cost: 8, attack:  6, hp: 24, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"tank2_1"), Role {class:utf8(b"tank2_1"), level: 6, gold_cost: 9, attack:  6, hp: 24, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"tank3"), Role {class:utf8(b"tank3"), level: 9, gold_cost: 10, attack:  12, hp: 60, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega1"), Role {class:utf8(b"mega1"), level: 1, gold_cost: 3, attack:  4, hp: 11, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"mega1_1"), Role {class:utf8(b"mega1_1"), level: 2, gold_cost: 5, attack:  4, hp: 11, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"mega2"), Role {class:utf8(b"mega2"), level: 3, gold_cost: 8, attack:  8, hp: 21, speed: 8, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega2_1"), Role {class:utf8(b"mega2_1"), level: 6, gold_cost: 9, attack:  8, hp: 21, speed: 8, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega3"), Role {class:utf8(b"mega3"), level: 9, gold_cost: 10, attack:  16, hp: 50, speed: 10, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"16")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1"), Role {class:utf8(b"shaman1"), level: 1, gold_cost: 3, attack:  5, hp: 9, speed: 6, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1_1"), Role {class:utf8(b"shaman1_1"), level: 2, gold_cost: 5, attack:  5, hp: 9, speed: 6, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2"), Role {class:utf8(b"shaman2"), level: 3, gold_cost: 8, attack:  10, hp: 21, speed: 8, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2_1"), Role {class:utf8(b"shaman2_1"), level: 6, gold_cost: 9, attack:  10, hp: 21, speed: 8, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman3"), Role {class:utf8(b"shaman3"), level: 9, gold_cost: 10, attack:  20, hp: 65, speed: 10, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1"), Role {class:utf8(b"firemega1"), level: 1, gold_cost: 3, attack:  6, hp: 8, speed: 5, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1_1"), Role {class:utf8(b"firemega1_1"), level: 2, gold_cost: 5, attack:  6, hp: 8, speed: 5, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2"), Role {class:utf8(b"firemega2"), level: 3, gold_cost: 8, attack:  12, hp: 15, speed: 9, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2_1"), Role {class:utf8(b"firemega2_1"), level: 6, gold_cost: 9,  attack:  12, hp: 15, speed: 9, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega3"), Role {class:utf8(b"firemega3"), level: 9, gold_cost: 10, attack:  24, hp: 37, speed: 11, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
    }

    public fun init_charactors2(global:&mut Global) {
vec_map::insert(&mut global.charactors, utf8(b"slime1"), Role {class:utf8(b"slime1"), level: 1, gold_cost: 3, attack:  6, hp: 9, speed: 5, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"")});
vec_map::insert(&mut global.charactors, utf8(b"slime1_1"), Role {class:utf8(b"slime1_1"), level: 2, gold_cost: 5, attack:  6, hp: 9, speed: 5, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"")});
vec_map::insert(&mut global.charactors, utf8(b"slime2"), Role {class:utf8(b"slime2"), level: 3, gold_cost: 8, attack:  10, hp: 30, speed: 7, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"")});
vec_map::insert(&mut global.charactors, utf8(b"slime2_1"), Role {class:utf8(b"slime2_1"), level: 6, gold_cost: 9, attack:  10, hp: 30, speed: 7, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"")});
vec_map::insert(&mut global.charactors, utf8(b"slime3"), Role {class:utf8(b"slime3"), level: 9, gold_cost: 10, attack:  20, hp: 65, speed: 10, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"")});
vec_map::insert(&mut global.charactors, utf8(b"ani1"), Role {class:utf8(b"ani1"), level: 1, gold_cost: 3, attack:  4, hp: 12, speed: 7, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
vec_map::insert(&mut global.charactors, utf8(b"ani1_1"), Role {class:utf8(b"ani1_1"), level: 2, gold_cost: 5, attack:  4, hp: 12, speed: 7, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
vec_map::insert(&mut global.charactors, utf8(b"ani2"), Role {class:utf8(b"ani2"), level: 3, gold_cost: 8, attack:  8, hp: 24, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
vec_map::insert(&mut global.charactors, utf8(b"ani2_1"), Role {class:utf8(b"ani2_1"), level: 6, gold_cost: 9, attack:  8, hp: 24, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
vec_map::insert(&mut global.charactors, utf8(b"ani3"), Role {class:utf8(b"ani3"), level: 9, gold_cost: 10, attack:  16, hp: 60, speed: 9, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"9")});
vec_map::insert(&mut global.charactors, utf8(b"tree1"), Role {class:utf8(b"tree1"), level: 1, gold_cost: 3, attack:  5, hp: 11, speed: 7, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
vec_map::insert(&mut global.charactors, utf8(b"tree1_1"), Role {class:utf8(b"tree1_1"), level: 2, gold_cost: 5, attack:  5, hp: 11, speed: 7, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
vec_map::insert(&mut global.charactors, utf8(b"tree2"), Role {class:utf8(b"tree2"), level: 3, gold_cost: 8, attack:  10, hp: 21, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
vec_map::insert(&mut global.charactors, utf8(b"tree2_1"), Role {class:utf8(b"tree2_1"), level: 6, gold_cost: 9, attack:  10, hp: 21, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
vec_map::insert(&mut global.charactors, utf8(b"tree3"), Role {class:utf8(b"tree3"), level: 9, gold_cost: 10, attack:  20, hp: 50, speed: 10, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"9")});
vec_map::insert(&mut global.charactors, utf8(b"wizard1"), Role {class:utf8(b"wizard1"), level: 1, gold_cost: 3, attack:  5, hp: 9, speed: 7, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
vec_map::insert(&mut global.charactors, utf8(b"wizard1_1"), Role {class:utf8(b"wizard1_1"), level: 2, gold_cost: 5, attack:  5, hp: 9, speed: 7, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
vec_map::insert(&mut global.charactors, utf8(b"wizard2"), Role {class:utf8(b"wizard2"), level: 3, gold_cost: 8, attack:  10, hp: 18, speed: 9, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
vec_map::insert(&mut global.charactors, utf8(b"wizard2_1"), Role {class:utf8(b"wizard2_1"), level: 6, gold_cost: 9, attack:  10, hp: 18, speed: 9, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"1")});
vec_map::insert(&mut global.charactors, utf8(b"wizard3"), Role {class:utf8(b"wizard3"), level: 9, gold_cost: 10, attack:  20, hp: 45, speed: 12, sp:0, sp_cap: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_sp_cap"), effect_value: utf8(b"2")});
vec_map::insert(&mut global.charactors, utf8(b"priest1"), Role {class:utf8(b"priest1"), level: 1, gold_cost: 3, attack:  3, hp: 12, speed: 4, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"6")});
vec_map::insert(&mut global.charactors, utf8(b"priest1_1"), Role {class:utf8(b"priest1_1"), level: 2, gold_cost: 5, attack:  3, hp: 12, speed: 4, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"6")});
vec_map::insert(&mut global.charactors, utf8(b"priest2"), Role {class:utf8(b"priest2"), level: 3, gold_cost: 8, attack:  6, hp: 24, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"8")});
vec_map::insert(&mut global.charactors, utf8(b"priest2_1"), Role {class:utf8(b"priest2_1"), level: 6, gold_cost: 9, attack:  6, hp: 24, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"8")});
vec_map::insert(&mut global.charactors, utf8(b"priest3"), Role {class:utf8(b"priest3"), level: 9, gold_cost: 10, attack:  12, hp: 60, speed: 9, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"12")});
vec_map::insert(&mut global.charactors, utf8(b"shinobi1"), Role {class:utf8(b"shinobi1"), level: 1, gold_cost: 3, attack:  4, hp: 12, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"1")});
vec_map::insert(&mut global.charactors, utf8(b"shinobi1_1"), Role {class:utf8(b"shinobi1_1"), level: 2, gold_cost: 5, attack:  4, hp: 12, speed: 6, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"1")});
vec_map::insert(&mut global.charactors, utf8(b"shinobi2"), Role {class:utf8(b"shinobi2"), level: 3, gold_cost: 8, attack:  8, hp: 24, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"2")});
vec_map::insert(&mut global.charactors, utf8(b"shinobi2_1"), Role {class:utf8(b"shinobi2_1"), level: 6, gold_cost: 9, attack:  8, hp: 24, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"2")});
vec_map::insert(&mut global.charactors, utf8(b"shinobi3"), Role {class:utf8(b"shinobi3"), level: 9, gold_cost: 10, attack:  16, hp: 60, speed: 10, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_hp_percent"), effect_value: utf8(b"3")});
vec_map::insert(&mut global.charactors, utf8(b"kunoichi1"), Role {class:utf8(b"kunoichi1"), level: 1, gold_cost: 3, attack:  6, hp: 9, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
vec_map::insert(&mut global.charactors, utf8(b"kunoichi1_1"), Role {class:utf8(b"kunoichi1_1"), level: 2, gold_cost: 5, attack:  6, hp: 9, speed: 8, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
vec_map::insert(&mut global.charactors, utf8(b"kunoichi2"), Role {class:utf8(b"kunoichi2"), level: 3, gold_cost: 8, attack:  12, hp: 18, speed: 10, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
vec_map::insert(&mut global.charactors, utf8(b"kunoichi2_1"), Role {class:utf8(b"kunoichi2_1"), level: 6, gold_cost: 9, attack:  12, hp: 18, speed: 10, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
vec_map::insert(&mut global.charactors, utf8(b"kunoichi3"), Role {class:utf8(b"kunoichi3"), level: 9, gold_cost: 10, attack:  24, hp: 45, speed: 12, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
vec_map::insert(&mut global.charactors, utf8(b"archer1"), Role {class:utf8(b"archer1"), level: 1, gold_cost: 3, attack:  6, hp: 9, speed: 7, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"7")});
vec_map::insert(&mut global.charactors, utf8(b"archer1_1"), Role {class:utf8(b"archer1_1"), level: 2, gold_cost: 5, attack:  6, hp: 9, speed: 7, sp:0, sp_cap: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"7")});
vec_map::insert(&mut global.charactors, utf8(b"archer2"), Role {class:utf8(b"archer2"), level: 3, gold_cost: 8, attack:  12, hp: 18, speed: 9, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"14")});
vec_map::insert(&mut global.charactors, utf8(b"archer2_1"), Role {class:utf8(b"archer2_1"), level: 6, gold_cost: 9, attack:  12, hp: 18, speed: 9, sp:0, sp_cap: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"14")});
vec_map::insert(&mut global.charactors, utf8(b"archer3"), Role {class:utf8(b"archer3"), level: 9, gold_cost: 10, attack:  24, hp: 45, speed: 12, sp:0, sp_cap: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"24")});
}

    public fun new_role(class:String, attack:u64, hp:u64, speed:u64, sp:u8, level:u8, gold_cost:u8, sp_cap:u8, 
        effect:String, effect_value:String, effect_type:String): Role{
        Role {
            class,
            attack,
            hp,
            speed,
            sp,
            level,
            gold_cost,
            sp_cap,
            effect,
            effect_value,
            effect_type
        }
    }

    //deep copy,from a borrowed role
    public fun new_role_from_reference(copy_from: &Role): Role{
        Role {
            class: copy_from.class,
            attack: copy_from.attack,
            hp: copy_from.hp,
            speed: copy_from.speed,
            sp: copy_from.sp,
            level: copy_from.level,
            gold_cost: copy_from.gold_cost,
            sp_cap: copy_from.sp_cap,
            effect: copy_from.effect,
            effect_value: copy_from.effect_value,
            effect_type: copy_from.effect_type
        }
    }

    public fun set_role(role:&mut Role, other_role: & Role){
        role.class = other_role.class;
        role.attack = other_role.attack;
        role.hp = other_role.hp;
        role.speed = other_role.speed;
        role.sp = other_role.sp;
        role.level = other_role.level;
        role.gold_cost = other_role.gold_cost;
        role.sp_cap = other_role.sp_cap;
        role.effect = other_role.effect;
        role.effect_value = other_role.effect_value;
        role.effect_type = other_role.effect_type;
    }

    // when a hero is removed it is set to be 'none', could happen in card pool (hero pool) and player lineup
    //changed
    public fun empty() : Role {
        new_role(utf8(b"none"),0,0,0,0,0,0,0,utf8(b""),utf8(b""),utf8(b""))
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

    public fun get_speed(role:&Role) : u64 {
        role.speed
    }

    public fun get_level(role:&Role) : u8 {
        role.level
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

    public fun get_sell_gold_cost(role: &Role) : u8 {
        let level = role.level;
        if (level < 3) {
            2
        } else if (level < 6) {
            6
        } else {
            8
        }
    }

    public fun get_hp(role:&Role) : u64 {
        role.hp
    }

    public fun set_hp(role:&mut Role, hp:u64) {
        role.hp = hp;
    }

    public fun increase_hp(role:&mut Role, increased_value:u64) {
        role.hp = role.hp + increased_value;
    }

    public fun get_role_by_class(global:&Global, class:String) : Role {
        //print(&class);
        *vec_map::get(&global.charactors, &class)
    }

    public fun permenant_increase_role_hp(roles: &mut vector<Role>, permenant_increase_hp_info: &VecMap<String, Int_wrapper>){
        let buffed_classes = vec_map::keys(permenant_increase_hp_info);
        let num_buffed_classes = vector::length(&buffed_classes);
        let len = vector::length(roles);
        let j = 0;
        while(j < num_buffed_classes){
            let buffed_class = vector::borrow(&buffed_classes, j);
            let increased_value = utils::get_int(vec_map::get(permenant_increase_hp_info, buffed_class));
            let i = 0;
            while(i < len){
                if(&vector::borrow_mut(roles, i).class == buffed_class){
                    let role = vector::borrow_mut(roles, i);
                    increase_hp(role, increased_value);
                    break
                };
                i = i + 1;
            };
            j = j + 1;
        }    
    }

    // p2 and p3 are calculated in lineup::generate_lineup_by_power
    // p2 = 35 * power; p3 = 0 or 2 times power when power >16
    // higher p3 is more likely to get a level 9 charactor
    // higher p2 is more likely to get a level 3 charactor
    public fun get_random_role_by_power(global: &Global, seed:u8, p2:u64, p3:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p3) {
            //print(&utf8(b"level 9 will be chosen"));
            get_random_role_by_level(global, 9, random, ctx)
        } else if (random < p2) {
            //print(&utf8(b"level 3 will be chosen"));
            get_random_role_by_level(global, 3, random, ctx)
        } else {
            //print(&utf8(b"level 1 will be chosen"));
            get_random_role_by_level(global, 1, random, ctx)
        }
    }

    // return a random class charactor of level 1, it is created for the basic hero pool with 30 heros
    public fun create_random_role_for_cards(global: &Global, seed:u8, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        get_random_role_by_level(global, 1, random, ctx)
    }
    
    //changed a lot
    // merge the two roles and get a stronger role
    public fun upgrade(global:&Global, role1: &Role, role2: &mut Role): bool {
        if (string::sub_string(&role1.class, 0, 3) != string::sub_string(&role2.class, 0, 3)){
            return false
        };
        let level1 = role1.level;
        let level2 = role2.level;
        if (level1 < 9 && level2 < 9) {
            let updated_level = if(level1 + level2 < 9){level1 + level2} else {9};
            print(&updated_level);

            let original_role1 = get_role_by_class(global, role1.class);
            let original_role2 = get_role_by_class(global, role2.class);

            let hp1_diff = role1.hp - original_role1.hp;
            let hp2_diff = role2.hp - original_role2.hp;   
            let hp_diff = if(hp1_diff > hp2_diff){hp1_diff} else {hp2_diff};

            let updated_class = utils::get_class_by_level(utils::removeSuffix(role2.class), updated_level);
            print(&updated_class);
            let updated_role = get_role_by_class(global, updated_class);
            set_role(role2, &updated_role);
            increase_hp(role2, hp_diff);
            role2.level = updated_level;
        } else {
            return false
        };
        true
    }

    //changed
    // determine if the two vectors of roles are the same, meaning same class same stats same order
    public fun check_roles_equality(roles1: &vector<Role>, roles2: &vector<Role>) : bool {
        assert!(vector::length(roles1) == 6, ERR_WRONG_LINEUP_LENGTH);
        assert!(vector::length(roles2) == 6, ERR_WRONG_LINEUP_LENGTH);
        let i = 0;
        while (i < 6) {
            //assert!(vector::length(roles1) > i, ERR_EXCEED_VEC_LENGTH);
            //assert!(vector::length(roles2) > i, ERR_EXCEED_VEC_LENGTH);
            let role1 = vector::borrow(roles1, i);
            let role2 = vector::borrow(roles2, i);
            if (role1.class == utf8(b"none") && role2.class == utf8(b"none")) {
                i = i + 1;
                continue
            };
            assert!(role1.class == role2.class, ERR_DIFFERENT_class);
            assert!(role1.hp == role2.hp, ERR_DIFFERENT_hp);
            assert!(role1.attack == role2.attack, ERR_DIFFERENT_ATTACK);
            assert!(role1.level == role2.level, ERR_DIFFERENT_ATTACK);
            i = i + 1;
        };
        true
    }
 
    //remove all the 'none' roles in the Role vector
    public fun remove_none_roles(roles: &mut vector<Role>){
        let len = vector::length(roles);
        let i = 0;
        while(i < len){
            if(get_class(vector::borrow(roles, i)) == utf8(b"none")){
                vector::remove(roles, i);
                len = len - 1;
                continue
            };
            i = i + 1;
        };
    }

    //changed
    // return a randomly decided class of charactor of level 1, 3 or 9
    // level is predetermined and class is randomly chosen
    fun get_random_role_by_level(global: &Global, level:u64, random: u64, _ctx:&mut TxContext) :Role {
        let max_roles_per_level = vec_map::size(&global.charactors) / 5;
        let index = random % max_roles_per_level;
        if (level == 1) {
            let (_class, role) = vec_map::get_entry_by_idx(&global.charactors, 5 * index);
            *role
        //level == 3 || level == 9
        } else {
            let (_class, role) = vec_map::get_entry_by_idx(&global.charactors, level/3 + 1 + 5 * index);
            *role
        } 
    }
////////////////////////////// Test

    public fun generate_role_global(ctx: &mut TxContext): Global{
        let global = Global {
            id: object::new(ctx),
            charactors: vec_map::empty<String, Role>()
        };
        init_charactors1(&mut global);
        init_charactors2(&mut global);
        global
    }

    public fun delete_role_global(global:Global){
        let Global{
            id: id1,
            charactors: _char         
        } = global;
        object::delete(id1);
    }

    public fun print_role(role: &Role){
        let role_info = role.class;
        string::append(&mut role_info, utf8(b", level: "));
        string::append(&mut role_info, utils::u8_to_string(role.level));
        string::append(&mut role_info, utf8(b", attack: "));
        string::append(&mut role_info, utils::u64_to_string(role.attack));
        string::append(&mut role_info, utf8(b", hp: "));
        string::append(&mut role_info, utils::u64_to_string(role.hp));
        string::append(&mut role_info, utf8(b", speed: "));
        string::append(&mut role_info, utils::u64_to_string(role.speed));
        string::append(&mut role_info, utf8(b", sp: "));
        string::append(&mut role_info, utils::u8_to_string(role.sp));
        string::append(&mut role_info, utf8(b", sp_cap: "));
        string::append(&mut role_info, utils::u8_to_string(role.sp_cap));
        string::append(&mut role_info, utf8(b", effect: "));
        string::append(&mut role_info, role.effect);
        string::append(&mut role_info, utf8(b", effect_type: "));
        string::append(&mut role_info, role.effect_type);
        string::append(&mut role_info, utf8(b", effect_value: "));
        string::append(&mut role_info, role.effect_value);  
        string::append(&mut role_info, utf8(b", gold_cost: "));     
        string::append(&mut role_info, utils::u8_to_string(role.gold_cost));
        print(&role_info);
    }

    public fun print_role_short(role: &Role){
        let role_info = role.class;
        //string::append(&mut role_info, utf8(b", level: "));
        //string::append(&mut role_info, utils::u8_to_string(role.level));
        string::append(&mut role_info, utf8(b", attack: "));
        string::append(&mut role_info, utils::u64_to_string(role.attack));
        string::append(&mut role_info, utf8(b", hp: "));
        string::append(&mut role_info, utils::u64_to_string(role.hp));
        string::append(&mut role_info, utf8(b", speed: "));
        string::append(&mut role_info, utils::u64_to_string(role.speed));
        string::append(&mut role_info, utf8(b", sp: "));
        string::append(&mut role_info, utils::u8_to_string(role.sp));
        //string::append(&mut role_info, utf8(b", gold_cost: "));     
        //string::append(&mut role_info, utils::u8_to_string(role.gold_cost));
        print(&role_info);
    }

    public fun print_roles_short(current_roles: &vector<Role>){
        let i = 0;
        let len = vector::length(current_roles);
        while(i < len){
            let cur = vector::borrow(current_roles, i);
            print_role_short(cur);
            i = i + 1;
        }
    }

    public fun print_roles(current_roles: &vector<Role>){
        let i = 0;
        let len = vector::length(current_roles);
        while(i < len){
            let cur = vector::borrow(current_roles, i);
            print_role(cur);
            i = i + 1;
        }
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: vec_map::empty<String, Role>()
        };
        transfer::share_object(global);
    }

    #[test]
    #[allow(unused_assignment)]
    fun test_remove_none_roles(){
        let global = generate_role_global(&mut tx_context::dummy());
        let role_1 = get_role_by_class(&global, utf8(b"assa1_1"));  
        let role_2 = get_role_by_class(&global, utf8(b"golem1_1"));
        let role_3 = get_role_by_class(&global, utf8(b"cleric2"));  
        let role_4 = get_role_by_class(&global, utf8(b"shaman1"));
        let role_none = empty();
        let role_class_none = get_role_by_class(&global, utf8(b"shaman1"));
        role_class_none.class = utf8(b"none");

        let roles = vector::empty<Role>();
        vector::push_back(&mut roles, role_1);
        vector::push_back(&mut roles, role_none);
        vector::push_back(&mut roles, role_2);
        vector::push_back(&mut roles, role_class_none);
        vector::push_back(&mut roles, role_none);
        vector::push_back(&mut roles, role_3);

        print(&utf8(b"Before remove none operation: "));
        let len = vector::length(&roles);
        let i = 0;
        while(i < len){
            print_role(vector::borrow(&roles, i));
            i = i + 1;
        };
        
        remove_none_roles(&mut roles);

        print(&utf8(b"After remove none operation: "));
        len = vector::length(&roles);
        i = 0;
        while(i < len){
            print_role(vector::borrow(&roles, i));
            i = i + 1;
        };
        let Global{
            id: id1,
            charactors: _char         
        } = global;
        object::delete(id1);
    }

    #[test]
    #[allow(unused_assignment)]
    fun test_upgrade(){
        let global = generate_role_global(&mut tx_context::dummy());

        let roleA_1 = get_role_by_class(&global, utf8(b"assa2"));  
        let roleA_2 = get_role_by_class(&global, utf8(b"assa2"));
        increase_hp(&mut roleA_1, 3);
        increase_hp(&mut roleA_2, 2);

        let roleB_1 = get_role_by_class(&global, utf8(b"cleric2"));
        let roleB_2 = get_role_by_class(&global, utf8(b"mega2_1"));
        increase_hp(&mut roleB_1, 1);

        let roleC_1 = get_role_by_class(&global, utf8(b"golem1_1"));
        let roleC_2 = get_role_by_class(&global, utf8(b"golem1_1"));
        increase_hp(&mut roleC_1, 1);
        increase_hp(&mut roleC_2, 2);

        let roleD_1 = get_role_by_class(&global, utf8(b"mega2_1"));
        let roleD_2 = get_role_by_class(&global, utf8(b"shaman1"));

        print(&utf8(b"Before upgrade: "));
        print_role(&roleB_1);
        print_role(&roleB_2);
        if(upgrade(&global, &roleB_1, &mut roleB_2)){
            print(&utf8(b"After upgrade: "));
            print_role(&roleB_2);
        };
        let Global{
            id: id1,
            charactors: _char         
        } = global;
        object::delete(id1);
    }

    //test_get_random_role_by_power test groups
    //make 10 seed, p2, p3 groups


    #[test]
    fun test_get_random_role_by_power(){
        //get_lineup_power_by_tag(win, lose)
        let power = utils::get_lineup_power_by_tag(1, 0);
        let p2 = utils::get_lineup_level2_prop_by_lineup_power(power);
        let p3 = utils::get_lineup_level3_prop_by_lineup_power(power);

        let p_info = utf8(b"Power: ");
        string::append(&mut p_info, utils::u64_to_string(power));
        string::append(&mut p_info, utf8(b", p2: "));
        string::append(&mut p_info, utils::u64_to_string(p2));
        string::append(&mut p_info, utf8(b", p3: "));
        string::append(&mut p_info, utils::u64_to_string(p3));   
        print(&p_info);
        let global = generate_role_global(&mut tx_context::dummy());
        let role = &get_random_role_by_power(&global, 7, p2, p3, &mut tx_context::dummy());
        print_role(role);
        let Global{
            id: id1,
            charactors: _char         
        } = global;
        object::delete(id1);
    }
}