// player's lineup, it contains some roles.
module lineup_packagev3::lineup {
    use std::vector::{Self};
    use std::string::{Self, utf8, String};
    use std::debug::print;

    use sui::tx_context::{Self, TxContext};
    use sui::vec_map::{Self, VecMap};
    use sui::transfer;
    use sui::random::{ Random};
    use sui::object::{Self, UID};

    use role_packagev3::role::{Role, Self};
    use util_packagev3::utils;

    const ERR_WRONG_ROLES_NUMBER:u64 = 0x001;
    const ERR_TAG_NOT_IN_TABLE:u64 = 0x002;
    const ERR_ELE_NOT_CONTAINS:u64 = 0x003;
    const ERR_EXCEED_VEC_LENGTH:u64 = 0x004;
    const ERR_NO_PERMISSION:u64 = 0x005;
    const CURRENT_VERSION:u64 = 1;

    // lineup_pools save at most 10 newest lineups for each win-loss tag in the standard mode
    // arena_lineup_pools at most 10 newest lineups for each win-loss tag in the arena mode
    struct Global has key {
        id: UID,
        // used for fight
        standard_mood_pools: VecMap<WinLose, vector<LineUp>>,
        arena_mood_pools: VecMap<WinLose, vector<LineUp>>,
        version:u64,
        manager: address
    }

    // One lineup has up to 6 roles
    // address is the player's address
    // name is the chosen name of the player
    // price is the ticket paid
    struct LineUp has store, copy, drop {
        creator: address,
        name:String,
        role_num: u64,
        roles: vector<Role>,
        gold_cost: u64,
        hash: vector<u8>
    }

    struct WinLose has store, copy, drop{
        win: u8,
        lose: u8
    }

    public fun new_lineUP(creator:address, name:String, role_num: u64, roles: vector<Role>,  gold_cost: u64,
        hash: vector<u8>):LineUp{
        LineUp {
            creator,
            name,
            role_num,
            roles,
            gold_cost,
            hash
        }
    }

    //deep copy,from a borrowed lineup
    public fun new_lineup_from_reference(copy_from: &LineUp): LineUp{
        let new_roles = vector::empty<role::Role>();
        let roles_copy_from = &copy_from.roles;
        let i = 0;
        let len = vector::length(roles_copy_from);
        while( i < len){
            let new_role = role::new_role_from_reference(vector::borrow(roles_copy_from, i));
            vector::push_back(&mut new_roles, new_role);
            i = i + 1;
        };

        let new_hash = vector::empty<u8>();
        let hash_copy_from = &copy_from.hash;
        i = 0;
        len = vector::length(hash_copy_from);
        while( i < len){
            vector::push_back(&mut new_hash, *vector::borrow(hash_copy_from, i));
             i = i + 1;
        };

        LineUp {
            creator: copy_from.creator,
            name: copy_from.name,
            role_num: copy_from.role_num,
            roles: new_roles,
            gold_cost: copy_from.gold_cost,
            hash: new_hash
        }
    }




    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            standard_mood_pools: vec_map::empty<WinLose, vector<LineUp>>(),
            arena_mood_pools: vec_map::empty<WinLose, vector<LineUp>>(),
            version:CURRENT_VERSION,
            manager: @manager
        };
        transfer::share_object(global);
    }

    public fun empty(ctx: &mut TxContext) : LineUp {
        let vec = vector::empty<Role>();
        let i = 0;
        let seed = 12;
        while (i < 6) {
            vector::push_back(&mut vec, role::empty());
            i = i + 1;
        };
        new_lineUP(tx_context::sender(ctx),utf8(b""), 0, vec, 0, utils::seed(ctx, seed))
    }

    public fun get_roles(lineup:&LineUp): &vector<Role> {
        &lineup.roles
    }

    public fun get_mut_roles(lineup:&mut LineUp) : &mut vector<Role>{
        &mut lineup.roles
    }

    public fun get_name(lineup:&LineUp): String {
        *&lineup.name
    }

    public fun get_creator(lineup:&LineUp): address {
        *&lineup.creator
    }

    public fun get_gold_cost(lineup:&LineUp): u64 {
        *&lineup.gold_cost
    }

    public fun get_hash(lineup:&LineUp): vector<u8> {
        lineup.hash
    }

    public fun set_hash(lineup:&mut LineUp, hash:vector<u8>) {
        lineup.hash = hash;
    }

    public fun get_WinLose_win(win_lose: &WinLose): u8{
        win_lose.win
    }

    public fun get_WinLose_lose(win_lose: &WinLose): u8{
        win_lose.lose
    }

    // Generate a system (robot) lineup for all the possible live win-lose and there is only one lineup in each 
    // win-lose slot
    #[allow(lint(public_random))]
    public entry fun init_lineup_pools(r:&Random, global: &mut Global, roleGlobal: &role::Global, ctx: &mut TxContext) {
        let win = 0;
        let lose = 0;
        while (win < 10) {
            while (true) {
                let tag = WinLose{
                    win: win,
                    lose: lose
                };
                let power = utils::get_lineup_power_by_tag(win, lose);
                let vec = vector::empty<LineUp>();
                let lineup = generate_lineup_by_power(roleGlobal, power, r, ctx);
                vector::push_back(&mut vec, lineup);
                assert!(!vec_map::contains(&global.standard_mood_pools, &tag), ERR_TAG_NOT_IN_TABLE);
                assert!(!vec_map::contains(&global.arena_mood_pools, &tag), ERR_TAG_NOT_IN_TABLE);
                vec_map::insert(&mut global.standard_mood_pools, tag, vec);
                vec_map::insert(&mut global.arena_mood_pools, tag, vec);
                lose = lose + 1;
                if (lose == 3) {
                    lose = 0;
                    break
                };
            };
            win = win + 1;
        };
    }

    // Return a lineup with 30 relatively low level charactors
    entry fun generate_random_cards(r:&Random, role_global:&role::Global, ctx:&mut TxContext) : LineUp {
        let max_cards = 30;
        let seed = 20;
        let vec = vector::empty<Role>();
        while (max_cards != 0) {    
            seed = seed + 1;
            vector::push_back(&mut vec, role::create_random_role_for_cards(role_global, r, ctx));
            max_cards = max_cards - 1;
        };
        new_lineUP(tx_context::sender(ctx),utf8(b"random cards pool"), vector::length(&vec), vec, 0, utils::seed(ctx, 20))
    }

    // put a player's lineup in the pool, there are at most 10 lineups in a win-lost slot
    // It is recorded as the resources to be selected as system generated rivals for the players
    //If there are less than 10 lineups in the win-lose tag the new lineup will be added to the end of the
    //VecMap. If there are exactly 10 lineups in the win-lose tag, the earliest added one at index 0 is removed and the
    //the new lineup will be added to the end of the VecMap
    public fun record_player_lineup(win:u8, lose:u8, global:&mut Global, lineup:LineUp, is_arena: bool) {
        // if win:3; lose:5 get pool tag 3_5
        let lineup_pool_tag = WinLose{
                               win: win,
                               lose: lose
                              };
        if (is_arena) {
            do_record_player_lineup(lineup_pool_tag,&mut global.arena_mood_pools, lineup)
        } else {
            do_record_player_lineup(lineup_pool_tag,&mut global.standard_mood_pools, lineup)
        };
    }

    fun do_record_player_lineup(win_lose_tag:WinLose, pools:&mut VecMap<WinLose, vector<LineUp>>, lineup:LineUp){
        if (vec_map::contains(pools, &win_lose_tag)) {
                let lineup_vec = vec_map::get_mut(pools, &win_lose_tag);
                if (vector::length(lineup_vec) >= 10) {
                    vector::remove(lineup_vec, 0);
                    vector::push_back(lineup_vec, lineup);
                } else {
                    vector::push_back(lineup_vec, lineup);
                };
            } else {
                let lineup_vec = vector::empty<LineUp>();
                vector::push_back(&mut lineup_vec, lineup);
                vec_map::insert(pools, win_lose_tag, lineup_vec);
            };
    }

    // Returns a random lineup in the global pool with the same win-loss tag, standard mode or arena mode depending on the flag passed
    // If the vec_map contains no lineup with the win-loss tag,it returns a random lineup from win-0 slot
    public fun select_random_lineup(win:u8, lose:u8, global:&Global, is_arena:bool, ctx: &mut TxContext) : LineUp {
        let win_lose_tag = WinLose {
            win: win,
            lose: lose
        };
        let pools;
        let vec;
        if(is_arena) {
            pools = &global.arena_mood_pools;
            if (vec_map::contains(pools, &win_lose_tag)) {
                vec = vec_map::get(pools, &win_lose_tag);
            } else {
                let tag = WinLose{
                    win: win,
                    lose: 0
                };
                assert!(vec_map::contains(pools, &tag), ERR_ELE_NOT_CONTAINS);
                vec = vec_map::get(pools, &tag);
            };
        } else {
            pools = &global.standard_mood_pools;
            if (vec_map::contains(pools, &win_lose_tag)) {
                vec = vec_map::get(pools, &win_lose_tag);
            } else {
                let tag = WinLose{
                    win: win,
                    lose: 0
                };
                assert!(vec_map::contains(pools, &tag), ERR_ELE_NOT_CONTAINS);
                vec = vec_map::get(pools, &tag);
            };
        };
        let len = vector::length(vec);
        let random = utils::get_random_num(0, len, 10, ctx);
        let index = random % len;
        assert!(len > index, ERR_EXCEED_VEC_LENGTH);
        *vector::borrow(vec, index)
    }

    // Generate a system (robot) lineup according to the power(win vs lose index), the more win weights, the 
    // stronger the lineup is
    // The higher the power is the more powerful the lineup is supposed to be
    public fun generate_lineup_by_power(roleGlobal:&role::Global, power:u64, r:&Random, ctx: &mut TxContext) : LineUp {
        // between 3 and 6 (when power >= 6)
        let max_role_num = utils::get_role_num_by_lineup_power(power);
        let roles = vector::empty<Role>();
        let p2 = utils::get_lineup_level2_prop_by_lineup_power(power);
        let p3 = utils::get_lineup_level3_prop_by_lineup_power(power);
        while (max_role_num > 0) {
            let role = role::get_random_role_by_power(roleGlobal, r, p2, p3, ctx);
            vector::push_back(&mut roles, role);
            max_role_num = max_role_num - 1;
        };
        let seed = 12;
        new_lineUP(tx_context::sender(ctx),utf8(b"I'm a super robot"), vector::length(&roles), roles, 0, utils::seed(ctx, seed))
    }

    // return the attack sum and hp sum of all the charactors in the lineup
    public fun get_attack_hp_sum(lineup:&LineUp):(u64, u64) {
        let vec = lineup.roles;
        let (i, len) = (0u64, vector::length(&vec));
        let attack_sum = 0;
        let hp_sum = 0;
        while (i < len) {
            // drop fragments
            let cur_role = vector::borrow(&vec, i);
            attack_sum = attack_sum + role::get_attack(cur_role);
            hp_sum = hp_sum + role::get_hp(cur_role);
            i = i + 1;
        };
        (attack_sum, hp_sum)
    }

    // Each vector has 6 entries and each entry is a string.
    // parse the string in the format:
    // Return the lineup described by the string
    public fun parse_lineup_str_vec(name:String, role_global:&role::Global, str_vec:vector<String>, gold_cost:u64, ctx:&mut TxContext) : LineUp {
        let len = vector::length(&str_vec);
        let vec = vector::empty<Role>();
        assert!(len == 6, ERR_WRONG_ROLES_NUMBER);
        vector::reverse<String>(&mut str_vec);
        while (len > 0) {
            // role description example: priest1_1-6:3:1'
            // role description format: name-level:life:attack
            let role_info = vector::borrow_mut(&mut str_vec,len - 1);
            let info_len = string::length(role_info);
            if (info_len == 0) {
                vector::push_back(&mut vec, role::empty());
                len = len - 1;
                continue
            };
            let index_from = 0;
            let index_to = string::index_of(role_info, &utf8(b"-"));
            let role_class = string::sub_string(role_info, index_from, index_to);
            index_from = index_to + 1;
            index_to = index_from + 1;  //level is less than 10 so only 1 in length
            let level = utils::utf8_to_u64(string::sub_string(role_info, index_from, index_to));
            index_from = index_to + 1;
            index_to = index_from + string::index_of(&string::sub_string(role_info, index_from, info_len), &utf8(b":"));
            let attack = utils::utf8_to_u64(string::sub_string(role_info, index_from, index_to));
            index_from = index_to + 1;
            index_to = info_len;
            let hp = utils::utf8_to_u64(string::sub_string(role_info, index_from, index_to));


            let role = role::get_role_by_class(role_global, role_class);
            role::set_hp(&mut role, hp);
            role::set_attack(&mut role, attack);
            role::set_level(&mut role, (level as u8));
            vector::push_back(&mut vec, role);
            len = len - 1;
        };
        new_lineUP(tx_context::sender(ctx), name, 6, vec, gold_cost, utils::seed(ctx, 123))
    }
    
    public fun upgradeVersion(global: &mut Global, version:u64, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.version = version;
    }

    public fun change_manager(global: &mut Global, new_manager: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.manager = new_manager;
    }

//////////////////////////////////Mainly for test ////////////////////////////////Mainly for test ////////////////////////////////Mainly for test
//////////////////////////////Mainly for test////////////////////////////////Mainly for test////////////////////////////////Mainly for test


    #[test_only]
    public fun generate_lineup_global(ctx: &mut TxContext): Global{
        Global {
            id: object::new(ctx),
            standard_mood_pools: vec_map::empty<WinLose, vector<LineUp>>(),
            arena_mood_pools: vec_map::empty<WinLose, vector<LineUp>>(),
            version:CURRENT_VERSION,
            manager: @manager
        }
    }

    public fun delete_lineup_global(global:Global){
        let Global{
            id: id1,
            standard_mood_pools: _s,     
            arena_mood_pools: _a,
            version: _v,
            manager: _m
        } = global;
        //table::drop(s);
        object::delete(id1);
    }

    public fun print_tag(tag: &WinLose){
        let tag_info = utf8(b"Win-Lose tag: ");
        string::append(&mut tag_info, utils::u8_to_string(tag.win));
        string::append(&mut tag_info, utf8(b"-"));
        string::append(&mut tag_info, utils::u8_to_string(tag.lose));
        print(&tag_info);
    }

    //pools: vec_map::empty<WinLose, vector<LineUp>>
     public fun print_pools(pools: &VecMap<WinLose, vector<LineUp>>){
        let len = vec_map::size(pools);
        let i = 0;
        while(i < len){
            let (cur_tag, cur_lineups) = vec_map::get_entry_by_idx(pools, i);
            print_tag(cur_tag);
            let len_lineup = vector::length(cur_lineups);
            print(&len_lineup);
            /*
            let j = 0;
            while(j < len_lineup){
                 print_lineup(vector::borrow(cur_lineups,j));
                 j = j + 1;
            }; 
            */
            i = i + 1;
        }
        //let tags = 
/*
        let cur1 = vector::empty<u8>();
        vector::push_back(&mut cur1, 1);
        vector::push_back(&mut cur1, 2);
        let cur2 = vector::empty<u8>();
        vector::push_back(&mut cur1, 1);
        vector::push_back(&mut cur1, 2);
        let cur1 = WinLose{
            win: 1,
            lose: 0
        };
        let cur2 = WinLose{
            win: 1,
            lose: 0
        };
        if(cur1 == cur2) print(&utf8(b"Equal!")) else  print(&utf8(b"Not Equal!"));
*/
     }

    public fun print_lineup(lineup: &LineUp){
        print(&utf8(b"Lineup: "));
        let lineup_info = lineup.name;
        string::append(&mut lineup_info, utf8(b", role number: "));
        string::append(&mut lineup_info, utils::u64_to_string(lineup.role_num));
        print(&lineup_info);
        let roles = &lineup.roles;
        let len = vector::length(roles);
        let i = 0;
        while(i < len){
            role::print_role(vector::borrow(roles, i));
            i = i + 1;
        };
        lineup_info = utf8(b"gold cost: ");
        string::append(&mut lineup_info, utils::u64_to_string(lineup.gold_cost));
        //print hash or not?
        //hash: vector<u8>
        print(&lineup_info);
    }

    #[test]
    fun generate_all_win_lose_tags(): vector<WinLose>{
        let result_vector = vector::empty<WinLose>();
        let win:u8 = 0;
        let lose:u8 = 0;
        while (win < 10) {
            while (true) {
                let tag = WinLose{
                            win: win,
                            lose: lose
                         };
                vector::push_back(&mut result_vector, tag);
                lose = lose + 1;
                if (lose == 3) {
                    lose = 0;
                    break
                };
            };
            win = win + 1;
        };
        result_vector
    }

    #[test]
    #[allow(unused_assignment)]
    fun test_parse_lineup_str_vec(){
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        let roles_info = vector::empty<String>();
        // role description example: priest1_1-6:3:1'
        // role description format: name-level:attack:hp
        //vector::push_back(&mut roles_info, utf8(b"priest1_1-2:13:11"));
        //none
        vector::push_back(&mut roles_info, utf8(b""));
        vector::push_back(&mut roles_info, utf8(b"fighter2_1-6:22:21"));
        vector::push_back(&mut roles_info, utf8(b"golem2_1-6:33:31"));
        vector::push_back(&mut roles_info, utf8(b"tank1-1:15:10"));
        vector::push_back(&mut roles_info, utf8(b"mega3-9:50:18"));
        vector::push_back(&mut roles_info, utf8(b"shaman2-3:23:16"));
        //(name:String, role_global:&role::Global, str_vec:vector<String>, gold_cost:u64, ctx:&mut TxContext) &mut tx_context::dummy()
        let lineup = parse_lineup_str_vec(utf8(b"My_Test"), &role_global, roles_info, 45, &mut tx_context::dummy());
        print_lineup(&lineup);
        role::delete_role_global(role_global);
    }

    //public fun generate_random_cards(role_global:&role::Global, ctx:&mut TxContext) : LineUp
    //The generated lineup should have 30 l1 roles with randomly chosen class
    // #[test]
    // #[allow(unused_assignment)]
    // fun test_generate_random_cards(){
    //     let role_global = role::generate_role_global(&mut tx_context::dummy());
    //     let lineup = generate_random_cards(&role_global, &mut tx_context::dummy());
    //     print_lineup(&lineup);
    //     role::delete_role_global(role_global);
    // }

    // Generate a system (robot) lineup for all the possible live win-lose and there is only one lineup in each 
    // win-lose slot
    // init_lineup_pools(global: &mut Global, roleGlobal: &role::Global, ctx: &mut TxContext) 
    //Result: one line up for each win-lose slot, each lineup contains between 3 and 6 chars
    #[test]
    #[allow(unused_assignment)]
    fun test_init_lineup_pools(){
        let ctx = tx_context::dummy();
        let lineup_global = generate_lineup_global(&mut ctx);
        let role_global = role::generate_role_global(&mut tx_context::dummy());
        init_lineup_pools(&mut lineup_global, &role_global, &mut ctx);
        let s_pools = lineup_global.standard_mood_pools;
        let a_pools = lineup_global.arena_mood_pools;
        let s_keys = vec_map::keys(&s_pools);
        let a_keys = vec_map::keys(&a_pools);
        print_pools(&s_pools);
        role::delete_role_global(role_global);
        delete_lineup_global(lineup_global);
    }

    // Put a player's lineup in the pool, there are at most 10 lineups in a win-lost slot
    // It is recorded as the resources to be selected as system generated rivals for the players
    //If there are less than 10 lineups in the win-lose tag the new lineup will be added to the end of the
    //VecMap. If there are exactly 10 lineups in the win-lose tag, the earliest added one at index 0 is removed and the
    //the new lineup will be added to the end of the VecMap
    // public fun record_player_lineup(win:u8, lose:u8, global:&mut Global, lineup:LineUp, is_arena: bool)
    // #[test]
    // #[allow(unused_assignment)]
    // fun test_record_player_lineup(){
    //     let ctx = tx_context::dummy();
    //     let lineup_global = generate_lineup_global(&mut ctx);
    //     let role_global = role::generate_role_global(&mut ctx);
    //     let lineup_to_test = generate_lineup_by_power(&role_global, 13, 5, &mut ctx);
    //     init_lineup_pools(&mut lineup_global, &role_global, &mut ctx);
    //     add_test_lineups_to_pools(&mut lineup_global, lineup_to_test, 10);
    //     //here only need to know how many lineups in one tag slot
    //     print_pools(&lineup_global.standard_mood_pools);
    //     let tag = WinLose{
    //               win: 5,
    //               lose: 1
    //               };
    //     let lineups = vec_map::get(&lineup_global.standard_mood_pools, &tag);
    //     let lineup0 = vector::borrow(lineups, 0);
    //     let lineup9 = vector::borrow(lineups, 9);
    //     print_lineup(lineup0);
    //     print_lineup(lineup9);

    //     role::delete_role_global(role_global);
    //     delete_lineup_global(lineup_global);
    // }

    // Returns a random lineup in the global pool with the same win-loss tag, standard mode or arena mode depending on the flag passed
    // If the vec_map contains no lineup with the win-loss tag,it returns a random lineup from win-0 slot
    //select_random_lineup(win:u8, lose:u8, global:&Global, is_arena:bool, ctx: &mut TxContext) : LineUp
    // #[test]
    // #[allow(unused_assignment)]
    // fun test_select_random_lineup(){
    //     let ctx = tx_context::dummy();
    //     let lineup_global = generate_lineup_global(&mut ctx);
    //     let role_global = role::generate_role_global(&mut tx_context::dummy());
    //     init_lineup_pools(&mut lineup_global, &role_global, &mut ctx);
    //     let lineup_to_test1 = generate_lineup_by_power(&role_global, 13, 5, &mut ctx);
    //     add_test_lineups_to_pools(&mut lineup_global, lineup_to_test1, 1);
    //     let lineup_to_test2 = generate_lineup_by_power(&role_global, 3, 1, &mut ctx);
    //     add_test_lineups_to_pools(&mut lineup_global, lineup_to_test2, 2);
    //     let lineup_to_test3 = generate_lineup_by_power(&role_global, 19, 8, &mut ctx);
    //     add_test_lineups_to_pools(&mut lineup_global, lineup_to_test3, 1);


    //     let tag = WinLose{
    //               win: 8,
    //               lose: 2
    //               };
    //     let lineups = vec_map::get(&lineup_global.standard_mood_pools, &tag);
    //     let i = 0;
    //     let len = vector::length(lineups);
    //     while(i < len){
    //         let cur = vector::borrow(lineups, i);
    //         print_lineup(cur);
    //         i = i + 1;
    //     };

    //     let result = select_random_lineup(8, 6, &lineup_global, false, &mut ctx);
    //     print_lineup(&result);
    //     role::delete_role_global(role_global);
    //     delete_lineup_global(lineup_global);
    // }

    #[test_only]
    fun add_test_lineups_to_pools(lineup_global:&mut Global, lineup_to_test:LineUp, rounds:u8){
        let all_tags = generate_all_win_lose_tags();
        let number_of_tags = vector::length(&all_tags);
        let i = 0;
        let cur_win;
        let cur_lose;
        while(i < rounds){
            let j = 0;
            while(j < number_of_tags){
                //print_tag(vector::borrow(&all_tags, j));
                cur_win = vector::borrow(&all_tags, j).win;
                cur_lose = vector::borrow(&all_tags, j).lose;
                record_player_lineup(cur_win, cur_lose, lineup_global, lineup_to_test, false);
                j = j + 1;
            };
            i = i + 1;
        }
    }

}