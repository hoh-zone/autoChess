module auto_chess::chess {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use std::string::{utf8, String, Self};
    use auto_chess::lineup::{Self, LineUp};
    use sui::balance::{Self, Balance};
    use sui::pay;
    use sui::coin::{Self, Coin, destroy_zero};
    use std::vector;
    use std::debug::print;
    use sui::event;
    use auto_chess::role;
    use auto_chess::utils;
    use sui::sui::SUI;
  
    const INIT_LIFE:u64 = 3;
    const INIT_GOLD:u64 = 10;
    const REFRESH_PRICE:u64 = 3;
    const ARENA_CHESS_PRICE:u64 = 1;
    const AMOUNT_DECIMAL:u64 = 1_000_000_000;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;
    const ERR_EXCEED_NUM_LIMIT:u64 = 0x02;
    const ERR_PAYMENT_NOT_ENOUGH:u64 = 0x03;
    const ERR_NOT_ARENA_CHESS:u64 = 0x04;
    const ERR_POOL_NOT_ENOUGH:u64 = 0x05;
    const ERR_NOT_PERMISSION:u64 = 0x06;

    struct Global has key {
        id: UID,
        total_chesses: u64,
        total_match:u64,
        balance_SUI: Balance<SUI>,
    }

    struct Chess has key, store {
        id:UID,
        name:String,
        lineup: LineUp,
        cards_pool: LineUp,
        gold: u64,
        refresh_price: u64,
        life: u64,
        win: u8,
        lose: u8,
        even: u8,
        creator: address,
        arena: bool
    }

    struct FightEvent has copy, drop {
        chess_id: address,
        v1: address,
        v1_name: String,
        v1_win: u8,
        v1_lose: u8,
        v2_name: String,
        v2_lineup:lineup::LineUp,
        res: u8 // even:0, win:1, lose:2
    }

    struct ArenaCheckOut has copy, drop {
        chess_id: address,
        owner: address,
        name: String,
        win: u8,
        lose: u8,
        reward: u64,
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
            balance_SUI: balance::zero(),
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
            balance_SUI: balance::zero(),
        };
        transfer::share_object(global);
    }

    public entry fun mint_arena_chess(role_global:&role::Global, global: &mut Global, name:String, coins:vector<Coin<SUI>>, ctx: &mut TxContext) {
        print(&utf8(b"mint new arena chess"));
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(0,0), ctx),
            gold: INIT_GOLD,
            refresh_price: REFRESH_PRICE,
            life: INIT_LIFE,
            win: 0,
            lose: 0,
            even: 0,
            creator: sender,
            arena: true
        };
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        assert!(coin::value(&merged_coin) >= ARENA_CHESS_PRICE * AMOUNT_DECIMAL, ERR_PAYMENT_NOT_ENOUGH);
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, ARENA_CHESS_PRICE * AMOUNT_DECIMAL, ctx)
        );
        balance::join(&mut global.balance_SUI, balance);
        if (coin::value(&merged_coin) > 0) {
            transfer::public_transfer(merged_coin, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(merged_coin);
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }


    public entry fun mint_chess(role_global:&role::Global, global: &mut Global, name:String, ctx: &mut TxContext) {
        print(&utf8(b"mint new chess"));
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(0,0), ctx),
            gold: INIT_GOLD,
            refresh_price: REFRESH_PRICE,
            life: INIT_LIFE,
            win: 0,
            lose: 0,
            even: 0,
            creator: sender,
            arena: false
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    public entry fun check_out_arena(global: &mut Global, chess: Chess, ctx: &mut TxContext) {
        assert!(chess.arena, ERR_NOT_ARENA_CHESS);
        let reward_amount = estimate_reward(global, chess.win, chess.lose);
        event::emit(ArenaCheckOut {
            chess_id: object::id_address(&chess),
            owner: chess.creator,
            name: chess.name,
            win: chess.win,
            lose: chess.lose,
            reward: reward_amount,
        });
        let Chess {id, name, lineup, cards_pool, gold, refresh_price, life, win, lose, even, creator, arena} = chess;
       
        let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
        object::delete(id);
    }

    

    public entry fun operate_and_match(global:&mut Global, role_global:&role::Global, lineup_global:&lineup::Global, gold:u64, lineup_str_vec: vector<String>, chess:&mut Chess, ctx:&mut TxContext) {
        // todo: for safety, verify the data.
        assert!(vector::length(&lineup_str_vec) <= 7, ERR_EXCEED_NUM_LIMIT);
        

        let initial_gold = *&chess.gold;
        //&vector<Role>
        let initial_lineup = *lineup::get_roles(&chess.lineup);
        //change these 2 fields ^^ according to the action list, then compare against gold and lineup_str_vec
        //iterate thru action_list, set each string as base_str
        //let base_str = string::utf8(b"BU:assa1");
        let base_str = string::utf8(b"BU:assa1");
        let search = string::utf8(b":");

        //TODO: GET ONLY NAME VECTOR
        let names = vector::empty();

        let initial_lineup_len = vector::length(&initial_lineup);

        let i: u64 = 0;

        while(i < initial_lineup_len) {
            let role = vector::pop_back(&mut initial_lineup);
            vector::push_back(&mut names, role::get_name(&role));
            i = i + 1;
        };


        if (string::index_of(&base_str,&search) == 2){
            //BUY "BU:nameOfCharacter"

            //1. gold-- [price]
            //1.1 get nameOfCharacter
            let j = string::length(&base_str);
            let sub_str = string::sub_string(&base_str, 2, j);
            
 
            //sub_string(s: &String, i: u64, j: u64):
            //print(&utf8(b"substring:"));
            //print(sub_str);
            //1.2 search for gold of character
            let this_role = role::get_role_by_name(role_global, sub_str);
            let this_price = role::get_price(&this_role);

            initial_gold = initial_gold - (this_price as u64);

            //2. chess.lineup_global++
            //PUSH ONLY NAME ONTO INITIAL_LINEUP
            vector::push_back(&mut names, role::get_name(&this_role));


        } else if (string::index_of(&base_str,&search) == 3){
            //SELL "SEL:5"   
            
            //get index
            let j = string::length(&base_str);
            let num_string = string::sub_string(&base_str, 2, j);
            //check if index i is null
            //TODO: Error handling and check method for parse
            //let num_sell: u64 = num_string.parse().unwrap();

            //vector::remove(&mut names, num_sell);
            //TODO: insert null at the same index

            

        } else if (string::index_of(&base_str,&search) == 4){
            //SWAP "SWAP:idx1,idx2"
            let j = string::length(&base_str);
            let num_string = string::sub_string(&base_str, 2, j);

            //use native public fun swap<Element>(v: &mut vector<Element>, i: u64, j: u64);

        } else if (string::index_of(&base_str,&search) == 5){
            //MERGE "MERGE:nameOfCharacter"

        } else {
            //ERR: invalid 

        };

        chess.gold = gold;
        chess.lineup = lineup::parse_lineup_str_vec(chess.name, role_global, lineup_str_vec, ctx);
        match(global, role_global, lineup_global, chess, ctx);
    }

    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    fun match(global: &mut Global, role_global:&role::Global, lineup_global:&lineup::Global, chess:&mut Chess, ctx: &mut TxContext) {
        print(&utf8(b"start match chess"));
        assert!(chess.life > 0, ERR_YOU_ARE_DEAD);

        // match an enemy config
        let lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, ctx);

        // fight
        fight(chess, &lineup, ctx);

        // record
        if (chess.life > 0) {
            refresh_cards_pools(role_global, chess, ctx);
        };
        chess.gold = INIT_GOLD;
        global.total_match = global.total_match + 1;
        print(&utf8(b"match finish"));
    }

    fun refresh_cards_pools(role_global:&role::Global, chess:&mut Chess, ctx:&mut TxContext) {
        let seed = 20;
        chess.cards_pool = lineup::generate_random_cards(role_global, utils::get_lineup_power_by_tag(chess.win,chess.lose), ctx);
    }

    public fun fight(chess: &mut Chess, enemy_lineup: &LineUp, ctx:&mut TxContext):bool {
        print(&utf8(b"enemy lineup"));
        print(enemy_lineup);
        let my_lineup = &chess.lineup;
        let my_roles = *lineup::get_roles(my_lineup);
        let my_num = vector::length(&my_roles);
        let enemy_roles = *lineup::get_roles(enemy_lineup);
        let enemy_num = vector::length(&enemy_roles);
        if (my_num == 0) {
            return false
        };
        let my_first_role = role::empty();
        let enemy_first_role = role::empty();
        while (true) {
            if (vector::length(&my_roles) == 0 && role::get_life(&my_first_role) == 0) {
                print(&utf8(b"I lose"));
                chess.lose = chess.lose + 1;
                chess.life = chess.life - 1;
                event::emit(FightEvent {
                    chess_id: object::id_address(chess),
                    v1: tx_context::sender(ctx),
                    v1_name: chess.name,
                    v1_win: chess.win,
                    v1_lose: chess.lose,
                    v2_name: lineup::get_name(enemy_lineup),
                    v2_lineup:*enemy_lineup,
                    res: 2
                });
                return false
            };
            if (vector::length(&enemy_roles) == 0 && role::get_life(&enemy_first_role) == 0) {
                chess.win = chess.win + 1;
                print(&utf8(b"I win, my left lineup:"));
                event::emit(FightEvent {
                    chess_id: object::id_address(chess),
                    v1: tx_context::sender(ctx),
                    v1_name: chess.name,
                    v1_win: chess.win,
                    v1_lose: chess.lose, 
                    v2_name: lineup::get_name(enemy_lineup),
                    v2_lineup:*enemy_lineup,
                    res: 1
                });
                return true
            };
            if (role::get_life(&my_first_role) == 0) {
                my_first_role = vector::pop_back(&mut my_roles);
            };
            if (role::get_life(&enemy_first_role) == 0) {
                enemy_first_role = vector::pop_back(&mut enemy_roles);
            };
            combat(&mut my_first_role, &mut enemy_first_role);
        };
        false
    }

    fun combat(role1:&mut role::Role, role2:&mut role::Role) {
        let life1 = 1;
        let life2 = 1;
        let attack1 = role::get_attack(role1);
        let attack2 = role::get_attack(role2);
        while (life1 != 0 && life2 != 0) {
            life1 = role::get_life(role1);
            life2 = role::get_life(role2);
            if (life1 > attack2 && attack1 >= life2) {
                role::set_life(role1, life1 - attack2);
                role::set_life(role2, 0);
            } else if (life2 > attack1 && attack2 >= life1) {
                role::set_life(role1, 0);
                role::set_life(role2, life2 - attack1);
            } else if (life1 > attack2 && life2 > attack1) {
                role::set_life(role1, life1 - attack2);
                role::set_life(role2, life2 - attack1);
            } else if (attack1 >= life2 && attack2 >= life1) {
                role::set_life(role1, 0);
                role::set_life(role2, 0);
            }
        };
    }

    public fun get_total_chesses(global: &Global) : u64 {
        global.total_chesses
    }
     
    public fun get_total_matches(global: &Global) : u64 {
        global.total_match
    }

    public fun get_total_shui_amount(global: &Global) : u64 {
        balance::value(&global.balance_SUI)
    }

    fun estimate_reward(global: &Global, win:u8, lose:u8) : u64 {
        let base_price = (win as u64)* 300_000_000;
        let max_reward = get_total_shui_amount(global) / 2;
        if (base_price > max_reward) {
            base_price = max_reward;
        };
        base_price
    }

    public fun withdraw(amount:u64, global: &mut Global, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @account, ERR_NOT_PERMISSION);
        let sui_balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }
}