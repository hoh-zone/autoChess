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
    const ERR_DIFFERENT_NAME:u64 = 0x02;
    const ERR_DIFFERENT_LIFE:u64 = 0x03;
    const ERR_DIFFERENT_ATTACK:u64 = 0x04;

    struct Global has key {
        id: UID,
        charactors: VecMap<String, Role>
    }

    struct Role has store, copy, drop {
        name:String,
        attack: u64,
        life: u64,
        magic: u8,
        level: u8,
        price: u8,
        max_magic: u8,
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
        vec_map::insert(&mut global.charactors, utf8(b"assa1"), Role {name:utf8(b"assa1"), level: 1, price: 3, attack:  6, life: 8, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"assa1_1"), Role {name:utf8(b"assa1_1"), level: 2, price: 5, attack:  6, life: 8, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"assa2"), Role {name:utf8(b"assa2"), level: 3, price: 8, attack:  12, life: 15, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"assa2_1"), Role {name:utf8(b"assa2_1"), level: 6, price: 9, attack:  12, life: 15, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"assa3"), Role {name:utf8(b"assa3"), level: 9, price: 10, attack:  24, life: 37, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_lowest_hp"), effect_value: utf8(b"18")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1"), Role {name:utf8(b"cleric1"), level: 1, price: 3, attack:  3, life: 8, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric1_1"), Role {name:utf8(b"cleric1_1"), level: 2, price: 5, attack:  3, life: 8, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2"), Role {name:utf8(b"cleric2"), level: 3, price: 8, attack:  6, life: 15, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric2_1"), Role {name:utf8(b"cleric2_1"), level: 6, price: 9, attack:  6, life: 15, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"cleric3"), Role {name:utf8(b"cleric3"), level: 9, price: 10, attack:  12, life: 37, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1"), Role {name:utf8(b"fighter1"), level: 1, price: 3, attack:  4, life: 9, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter1_1"), Role {name:utf8(b"fighter1_1"), level: 2, price: 5, attack:  4, life: 9, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2"), Role {name:utf8(b"fighter2"), level: 3, price: 8, attack:  12, life: 18, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter2_1"), Role {name:utf8(b"fighter2_1"), level: 6, price: 9, attack:  12, life: 18, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"fighter3"), Role {name:utf8(b"fighter3"), level: 9, price: 10, attack:  24, life: 45, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_all_tmp_attack"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"golem1"), Role {name:utf8(b"golem1"), level: 1, price: 3, attack:  4, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem1_1"), Role {name:utf8(b"golem1_1"), level: 2, price: 5, attack:  4, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem2"), Role {name:utf8(b"golem2"), level: 3, price: 8, attack:  8, life: 24, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem2_1"), Role {name:utf8(b"golem2_1"), level: 6, price: 9, attack:  8, life: 24, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"golem3"), Role {name:utf8(b"golem3"), level: 9, price: 10, attack:  16, life: 60, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"tank1"), Role {name:utf8(b"tank1"), level: 1, price: 3, attack:  3, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"tank1_1"), Role {name:utf8(b"tank1_1"), level: 2, price: 5, attack:  3, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"tank2"), Role {name:utf8(b"tank2"), level: 3, price: 8, attack:  6, life: 24, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"tank2_1"), Role {name:utf8(b"tank2_1"), level: 6, price: 9, attack:  6, life: 24, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"tank3"), Role {name:utf8(b"tank3"), level: 9, price: 10, attack:  12, life: 60, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"add_all_tmp_hp"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega1"), Role {name:utf8(b"mega1"), level: 1, price: 3, attack:  4, life: 11, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"mega1_1"), Role {name:utf8(b"mega1_1"), level: 2, price: 5, attack:  4, life: 11, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"4")});
        vec_map::insert(&mut global.charactors, utf8(b"mega2"), Role {name:utf8(b"mega2"), level: 3, price: 8, attack:  8, life: 21, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega2_1"), Role {name:utf8(b"mega2_1"), level: 6, price: 8, attack:  8, life: 21, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"mega3"), Role {name:utf8(b"mega3"), level: 9, price: 10, attack:  16, life: 50, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"aoe"), effect_value: utf8(b"16")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1"), Role {name:utf8(b"shaman1"), level: 1, price: 3, attack:  5, life: 9, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman1_1"), Role {name:utf8(b"shaman1_1"), level: 2, price: 5, attack:  5, life: 9, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2"), Role {name:utf8(b"shaman2"), level: 3, price: 8, attack:  10, life: 21, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman2_1"), Role {name:utf8(b"shaman2_1"), level: 6, price: 9, attack:  10, life: 21, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"shaman3"), Role {name:utf8(b"shaman3"), level: 9, price: 10, attack:  20, life: 65, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1"), Role {name:utf8(b"firemega1"), level: 1, price: 3, attack:  6, life: 8, magic: 0, max_magic: 3, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega1_1"), Role {name:utf8(b"firemega1_1"), level: 2, price: 5, attack:  6, life: 8, magic: 0, max_magic: 3, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2"), Role {name:utf8(b"firemega2"), level: 3, price: 8, attack:  12, life: 15, magic: 0, max_magic: 2, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega2_1"), Role {name:utf8(b"firemega2_1"), level: 6, price: 9,  attack:  12, life: 15, magic: 0, max_magic: 2, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
        vec_map::insert(&mut global.charactors, utf8(b"firemega3"), Role {name:utf8(b"firemega3"), level: 9, price: 10, attack:  24, life: 37, magic: 0, max_magic: 1, effect_type: utf8(b"ring"), effect: utf8(b"forbid_debuff"), effect_value: utf8(b"")});
    }

    public fun init_charactors2(global:&mut Global) {
        vec_map::insert(&mut global.charactors, utf8(b"slime1"), Role {name:utf8(b"slime1"), level: 1, price: 3, attack:  6, life: 9, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"slime1_1"), Role {name:utf8(b"slime1_1"), level: 2, price: 5, attack:  6, life: 9, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"slime2"), Role {name:utf8(b"slime2"), level: 3, price: 8, attack:  10, life: 30, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"slime2_1"), Role {name:utf8(b"slime2_1"), level: 6, price: 9, attack:  10, life: 30, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"slime3"), Role {name:utf8(b"slime3"), level: 9, price: 10, attack:  20, life: 65, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"forbid_buff"), effect_value: utf8(b"10")});
        vec_map::insert(&mut global.charactors, utf8(b"ani1"), Role {name:utf8(b"ani1"), level: 1, price: 3, attack:  4, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"ani1_1"), Role {name:utf8(b"ani1_1"), level: 2, price: 5, attack:  4, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"ani2"), Role {name:utf8(b"ani2"), level: 3, price: 8, attack:  8, life: 24, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"ani2_1"), Role {name:utf8(b"ani2_1"), level: 6, price: 9, attack:  8, life: 24, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"ani3"), Role {name:utf8(b"ani3"), level: 9, price: 10, attack:  16, life: 60, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"9")});
        vec_map::insert(&mut global.charactors, utf8(b"tree1"), Role {name:utf8(b"tree1"), level: 1, price: 3, attack:  5, life: 11, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"tree1_1"), Role {name:utf8(b"tree1_1"), level: 2, price: 5, attack:  5, life: 11, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"tree2"), Role {name:utf8(b"tree2"), level: 3, price: 8, attack:  10, life: 21, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"tree2_1"), Role {name:utf8(b"tree2_1"), level: 6, price: 9, attack:  10, life: 21, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"tree3"), Role {name:utf8(b"tree3"), level: 9, price: 10, attack:  20, life: 50, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"reduce_tmp_attack"), effect_value: utf8(b"9")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1"), Role {name:utf8(b"wizard1"), level: 1, price: 3, attack:  5, life: 9, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_max_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard1_1"), Role {name:utf8(b"wizard1_1"), level: 2, price: 5, attack:  5, life: 9, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_max_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2"), Role {name:utf8(b"wizard2"), level: 3, price: 8, attack:  10, life: 18, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_max_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard2_1"), Role {name:utf8(b"wizard2_1"), level: 6, price: 9, attack:  10, life: 18, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_max_magic"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"wizard3"), Role {name:utf8(b"wizard3"), level: 9, price: 10, attack:  20, life: 45, magic: 0, max_magic: 0, effect_type: utf8(b"ring"), effect: utf8(b"add_all_tmp_max_magic"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"priest1"), Role {name:utf8(b"priest1"), level: 1, price: 3, attack:  3, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"priest1_1"), Role {name:utf8(b"priest1_1"), level: 2, price: 5, attack:  3, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"6")});
        vec_map::insert(&mut global.charactors, utf8(b"priest2"), Role {name:utf8(b"priest2"), level: 3, price: 8, attack:  6, life: 24, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"priest2_1"), Role {name:utf8(b"priest2_1"), level: 6, price: 9, attack:  6, life: 24, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"8")});
        vec_map::insert(&mut global.charactors, utf8(b"priest3"), Role {name:utf8(b"priest3"), level: 9, price: 10, attack:  12, life: 60, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"all_max_hp_to_back1"), effect_value: utf8(b"12")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi1"), Role {name:utf8(b"shinobi1"), level: 1, price: 3, attack:  4, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_life_percent"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi1_1"), Role {name:utf8(b"shinobi1_1"), level: 2, price: 5, attack:  4, life: 12, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_life_percent"), effect_value: utf8(b"1")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi2"), Role {name:utf8(b"shinobi2"), level: 3, price: 8, attack:  8, life: 24, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_life_percent"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi2_1"), Role {name:utf8(b"shinobi2_1"), level: 6, price: 9, attack:  8, life: 24, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_life_percent"), effect_value: utf8(b"2")});
        vec_map::insert(&mut global.charactors, utf8(b"shinobi3"), Role {name:utf8(b"shinobi3"), level: 9, price: 10, attack:  16, life: 60, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_by_life_percent"), effect_value: utf8(b"3")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi1"), Role {name:utf8(b"kunoichi1"), level: 1, price: 3, attack:  6, life: 9, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi1_1"), Role {name:utf8(b"kunoichi1_1"), level: 2, price: 5, attack:  6, life: 9, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi2"), Role {name:utf8(b"kunoichi2"), level: 3, price: 8, attack:  12, life: 18, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi2_1"), Role {name:utf8(b"kunoichi2_1"), level: 6, price: 9, attack:  12, life: 18, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"kunoichi3"), Role {name:utf8(b"kunoichi3"), level: 9, price: 10, attack:  24, life: 45, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_sputter_to_second_by_percent"), effect_value: utf8(b"5")});
        vec_map::insert(&mut global.charactors, utf8(b"archer1"), Role {name:utf8(b"archer1"), level: 1, price: 3, attack:  6, life: 9, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"7")});
        vec_map::insert(&mut global.charactors, utf8(b"archer1_1"), Role {name:utf8(b"archer1_1"), level: 2, price: 5, attack:  6, life: 9, magic: 0, max_magic: 3, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"7")});
        vec_map::insert(&mut global.charactors, utf8(b"archer2"), Role {name:utf8(b"archer2"), level: 3, price: 8, attack:  12, life: 18, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"14")});
        vec_map::insert(&mut global.charactors, utf8(b"archer2_1"), Role {name:utf8(b"archer2_1"), level: 6, price: 9, attack:  12, life: 18, magic: 0, max_magic: 2, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"14")});
        vec_map::insert(&mut global.charactors, utf8(b"archer3"), Role {name:utf8(b"archer3"), level: 9, price: 10, attack:  24, life: 45, magic: 0, max_magic: 1, effect_type: utf8(b"skill"), effect: utf8(b"attack_last_char"), effect_value: utf8(b"24")});
    }

    // for loop init
    public fun init_role() : Role {
        Role {
            name:utf8(b"init"),
            attack: 0,
            life: 0,
            magic : 0,
            level: 0,
            price: 0,
            max_magic: 0,
            effect: utf8(b""),
            effect_value: utf8(b""),
            effect_type: utf8(b"")
        }
    }

    public fun empty() : Role {
        Role {
            name:utf8(b"none"),
            attack: 0,
            life: 0,
            magic : 0,
            level: 0,
            price: 0,
            max_magic: 0,
            effect: utf8(b""),
            effect_value: utf8(b""),
            effect_type: utf8(b"")
        }
    }

    fun random_select_role_by_level(global: &Global, level:u64, random: u64, _ctx:&mut TxContext):Role {
        let max_roles_per_level = vec_map::size(&global.charactors) / 5;
        let index = random % max_roles_per_level;
        if (level == 1) {
            let (_name, role) = vec_map::get_entry_by_idx(&global.charactors, 5 * index);
            *role
        } else if (level == 3) {
           let (_name, role) = vec_map::get_entry_by_idx(&global.charactors, 1 + 5 * index);
            *role
        } else {
            let (_name, role) = vec_map::get_entry_by_idx(&global.charactors, 2 + 5 * index);
            *role
        }
    }

    public(friend) fun create_random_role_for_lineup(global: &Global, seed:u8, p2:u64, p3:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p3) {
            random_select_role_by_level(global, 9, random, ctx)
        } else if (random < p2) {
            random_select_role_by_level(global, 3, random, ctx)
        } else {
            random_select_role_by_level(global, 1, random, ctx)
        }
    }

    public(friend) fun create_random_role_for_cards(global: &Global, seed:u8, p2:u64, ctx: &mut TxContext) : Role {
        let random = utils::get_random_num(0, 1000, seed, ctx);
        if (random < p2) {
            random_select_role_by_level(global, 3, random, ctx)
        } else {
            random_select_role_by_level(global, 1, random, ctx)
        }
    }

    public fun get_role_by_name(global:&Global, name:String) : Role {
        print(&name);
        *vec_map::get(&global.charactors, &name)
    }

    public fun get_attack(role:&Role) : u64 {
        role.attack
    }

    public fun set_attack(role:&mut Role, attack:u64) {
        role.attack = attack;
    }

    public fun get_price(role:&Role) : u8 {
        let level = role.level;
        if (level == 1) {
            3
        } else if (level == 2) {
            5
        } else {
            6
        }
    }

    public fun get_name(role:&Role) : String {
        role.name
    }

    public fun get_life(role:&Role) : u64 {
        role.life
    }

    public fun get_level(role:&Role) : u8 {
        role.level
    }

    public fun set_life(role:&mut Role, life:u64) {
        role.life = life;
    }

    public fun set_level(role:&mut Role, level:u8) {
        role.level = level;
    }

    public fun set_name(role:&mut Role, name:String) {
        role.name = name;
    }

    public fun set_magic(role: &mut Role, value:u8) {
        role.magic = value;
    }

    public fun get_max_magic(role: &Role) : u8 {
        role.max_magic
    }

    public fun get_magic(role: &Role) : u8 {
        role.magic
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

    public fun upgrade(global:&Global, from_role: &Role, to_role: &mut Role): bool {
        let sub_name1 = string::sub_string(&from_role.name, 0, 3);
        let sub_name2 = string::sub_string(&to_role.name, 0, 3);
        if (sub_name1 != sub_name2){
            return false
        };
        let level1 = from_role.level;
        let level2 = to_role.level;
        let life1 = from_role.life;
        let life2 = to_role.life;
        let attack1 = from_role.attack;
        let attack2 = to_role.attack;
        if (level1 > level2) {
            let tmp = level2;
            let tmp_life = life2;
            let tmp_attack = attack2;
            life2 = life1;
            life1 = tmp_life;
            attack2 = attack1;
            attack1 = tmp_attack;
            level2 = level1;
            level1 = tmp;
        };
        if (level1 < 9 && level2 < 9) {
            let new_level = level1 + level2;
            if (new_level > 9) {
                new_level = 9;
            };
            to_role.level = new_level;
            let base_name = utils::removeSuffix(to_role.name);
            let old_name1 = utils::get_name_by_level(base_name, level1);
            let old_name2 = utils::get_name_by_level(base_name, level2);
            let old_role1 = get_role_by_name(global, old_name1);
            let old_role2 = get_role_by_name(global, old_name2);

            let life1_diff = life1 - old_role1.life;
            let life2_diff = life2 - old_role2.life;
            let life_diff;
            if (life1_diff > life2_diff) {
                life_diff = life1_diff;
            } else {
                life_diff = life2_diff;
            };

            let attack1_diff = attack1 - old_role1.attack;
            let attack2_diff = attack2 - old_role2.attack;
            let attack_diff;
            if (attack1_diff > attack2_diff) {
                attack_diff = attack1_diff;
            } else {
                attack_diff = attack2_diff;
            };
            let new_name = utils::get_name_by_level(base_name, new_level);
            let new_role = get_role_by_name(global, new_name);
            to_role.name = new_name;
            to_role.max_magic = new_role.max_magic;
            to_role.price = new_role.price;
            to_role.attack = new_role.attack + attack_diff;
            to_role.life = new_role.life + life_diff;
        } else {
            return false
        };
        true
    }

    public fun get_sell_price(role: &Role) : u8 {
        let level = role.level;
        if (level < 3) {
            2
        } else if (level < 9) {
            6
        } else {
            8
        }
    }

    public fun check_roles_equal(roles1: &vector<Role>, roles2: &vector<Role>) : bool {
        assert!(vector::length(roles1) == 6, ERR_WRONG_LINEUP_LENGTH);
        assert!(vector::length(roles2) == 6, ERR_WRONG_LINEUP_LENGTH);
        let i = 0;
        while (i < 6) {
            let role1 = vector::borrow(roles1, i);
            let role2 = vector::borrow(roles2, i);
            if (role1.name == utf8(b"none") && role2.name == utf8(b"none")) {
                i = i + 1;
                continue
            };
            print(&role1.name);
            print(&role2.name);
            assert!(role1.name == role2.name, ERR_DIFFERENT_NAME);
            assert!(role1.life == role2.life, ERR_DIFFERENT_LIFE);
            assert!(role1.attack == role2.attack, ERR_DIFFERENT_ATTACK);
            i = i + 1;
        };
        true
    }
}