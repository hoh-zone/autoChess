// every game is a chess nft, it functions as a game saver, you can lose at most 3 times, you can check out any time
// to exchange some reward, the reward depends on your ticket price and the times of winning.
// every match will be recoreded in the chain, so we can randomly pk with other players's lineup with similar level.
// standard mode is free, but you can't win sui. In arena mode, players have to buy a ticket to start the game and check out to win some sui.
// before each battle, roles present in hero pool is determined, it costs gold to refresh to see the next five heros in the hero pool with 30 heros generated at the end of last battle
// There is no dynamic generation on frontend when you click "refresh" button.
module chess_packagev2::chess {
    use std::vector;
    use std::string::{utf8, String};
    use std::debug::print;

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::sui::SUI;
    use sui::transfer::{Self, public_transfer};  
    use sui::balance::{Self, Balance};
    use sui::pay;
    use sui::coin::{Self, Coin};
    use sui::clock::{Clock};
    use sui::event;
    use sui::vec_map::{Self};

    use lineup_packagev2::lineup::{Self, LineUp};
    use role_packagev2::role::{Self,Role};
    use challenge_packagev2::challenge;
    use fight_packagev2::fight;
    use util_packagev2::utils::{Self, Int_wrapper};
    use chess_packagev2::metaIdentity;

    const INIT_GOLD:u64 = 10;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;
    const ERR_EXCEED_NUM_LIMIT:u64 = 0x02;
    const ERR_PAYMENT_NOT_ENOUGH:u64 = 0x03;
    const ERR_NOT_ARENA_CHESS:u64 = 0x04;
    const ERR_NOT_PERMISSION:u64 = 0x06;
    const ERR_ONLY_ARENA_MODE_ALLOWED:u64 = 0x12;
    const ERR_CHALLENGE_NOT_END:u64 = 0x013;
    const ERR_ARENA_FEE_HAS_CHECKED_OUT:u64 = 0x014;
    const REFRESH_gold_cost:u8 = 2;
    const CARDS_IN_ONE_REFRESH:u64 = 5;
    const ERR_INVALID_CHARACTOR:u64 = 0x001;
    const ERR_CHARACTOR_IS_NONE:u64 = 0x002;
    const ERR_UPGRADE_FAILED:u64 = 0x003;
    const ERR_SAME_INDEX_UPGRADE:u64 = 0x004;
    const ERR_CHECK_ROLES_NOT_EQUAL:u64 = 0x005;
    const ERR_WRONG_LEFT_GOLD:u64 = 0x006;
    const ERR_EXCEED_VEC_LENGTH:u64 = 0x007;
    const ERR_NO_PERMISSION:u64 = 0x008;
    const ERR_INVALID_VERSION:u64 = 0x009;
    const CURRENT_VERSION: u64 = 1;

    struct Global has key {
        id: UID,
        total_chesses: u64,
        total_battle:u64,
        balance_SUI: Balance<SUI>,
        version: u64,
        manager: address
    }

    // Each chess is the round(s) of game with 3-20 something battles in line
    // name is the chosen name by the player
    // lineup is the current lineup
    // cards_pool contains 30 roles, it is generated when the chess nft is minted and sent to player and updated in the end of each battle.
    // some heroes in the cards_pool(hero pool) could be removed and set to 'none' in the operations before each battle but
    // refreshed after the battle for the operation in the next battle
    // gold is the given points for the operations before each battle, set to be 10
    // creator is the player's address
    // price is the ticket paid for the challenge/arena mode (?) one or both (?) it is 0 in standard mode
    // arena_checked is set to be false when a arena chess is minted and true when the chess is burned and rewards paid
    /*
    todo: Suggestion:
    struct Chess has key, store {
        id:UID,
        name:String,
        lineup: LineUp,
        creator: address,
        win: u8,
        lose: u8,
        type: CHESSTYPE
    }
    CHESSTYPE{
        standard, challenge, arena
    }
    if arena, add dynamic field price
    gold is a constant, it is not needed to be kept in the nft
    cards_pool: LineUp, is re-generated before each battle's operation and no need to be recorded in chess
    */
    struct Chess has key, store {
        id:UID,
        name:String,
        lineup: LineUp,
        cards_pool: LineUp,
        gold: u64,
        win: u8,
        lose: u8,
        challenge_win:u8,
        challenge_lose:u8,
        creator: address,
        gold_cost: u64,
        arena: bool,
        arena_checked: bool
    }

    // one round of battle event
    struct FightEvent has copy, drop {
        chess_id: address,
        v1: address,
        v1_name: String,
        v1_win: u8,
        v1_lose: u8,
        v1_challenge_win: u8,
        v1_challenge_lose: u8,
        v2_name: String,
        v2_lineup:lineup::LineUp,
        // even:0, win:1 why not bool : reserve for even situation
        res: u8
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_battle: 0,
            balance_SUI: balance::zero(),
            version: CURRENT_VERSION,
            manager: @manager
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    #[test_only]
    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    // Withdraw a the 'amount' of SUI from the chess shop balance and transfer to the local account
    // who publishes the package
    #[lint_allow(self_transfer)]
    public fun split_amount(amount:u64, global: &mut Global, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @manager, ERR_NOT_PERMISSION);
        let sui_balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    // The function sends 1/10 of the SUI in the chess game shop to the challenge rewards pool when the challenge period is about to due.
    // Then it calculates the rewards for the top 20 respectively.
    // Finally it locks the challenge rewards pool
    public fun lock_reward(global: &mut Global, challengeGlobal: &mut challenge::Global, clock:&Clock, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == @manager, ERR_NOT_PERMISSION);
        assert!(challenge::query_left_challenge_time(challengeGlobal, clock) == 0, ERR_CHALLENGE_NOT_END);
        let challenge_mode_rewards = balance::value(&global.balance_SUI) / 10;
        let balance = balance::split(&mut global.balance_SUI, challenge_mode_rewards);
        challenge::top_up_challenge_pool(challengeGlobal, balance);
        let i = 1;
        let total_scores = challenge::calculate_scores(challengeGlobal);

        // Calculate and generate the  reward_20 vector in the challenge admin
        while (i <= 20) {
            let amount = challenge::get_reward_amount_by_rank(challengeGlobal, challenge_mode_rewards, total_scores, i);
            challenge::push_reward_amount(challengeGlobal, amount);
            i = i + 1;
        };
        challenge::lock_pool(challengeGlobal);
    }


    // For the player in the challenge mode when challenge period due
    // Sends the rewards to the player and burns the chess nft
    #[lint_allow(self_transfer)]
    public entry fun claim_rank_reward(challengeGlobal: &mut challenge::Global, chess:Chess, clock:&Clock, rank:u8, ctx: &mut TxContext) {
        assert!(challenge::query_left_challenge_time(challengeGlobal, clock) == 0, ERR_CHALLENGE_NOT_END);
        let sender = tx_context::sender(ctx);
        let tmp_lineup = challenge::get_lineup_by_rank(challengeGlobal, rank);
        if (lineup::get_creator(tmp_lineup) == sender) {
            let Chess {id, name:_, lineup:_, cards_pool:_, gold:_, win:_, lose:_, challenge_win:_, challenge_lose:_, creator:_, gold_cost:_, arena:_, arena_checked:_} = chess;
            challenge::send_reward_by_rank(challengeGlobal, rank, ctx);
            object::delete(id);
        } else {
            public_transfer(chess, sender);
        };
    }

    #[lint_allow(self_transfer)]
    entry fun mint_arena_chess(role_global:&role::Global, global: &mut Global, rewardsGlobal: &mut metaIdentity::RewardsGlobal, name:String, coins:vector<Coin<SUI>>, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let sender = tx_context::sender(ctx);
        // merge the coin payment together (coin smashing) as the ticket price and make sure that it is more than the min 
        // ticket price
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        let paid_price = coin::value(&merged_coin);
        let split_value = paid_price / 10;
        let left_value = paid_price - split_value;
        assert!(utils::check_ticket_gold_cost(paid_price), ERR_PAYMENT_NOT_ENOUGH);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, ctx),
            gold: INIT_GOLD,
            win: 0,
            lose: 0,
            challenge_win:0,
            challenge_lose:0,
            creator: sender,
            gold_cost: paid_price,
            arena: true,
            arena_checked: false
        };
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, left_value, ctx)
        );
        balance::join(&mut global.balance_SUI, balance);

        let balance_for_invite = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, split_value, ctx)
        );
        metaIdentity::top_up_balance_pool(rewardsGlobal, balance_for_invite);
        if (coin::value(&merged_coin) > 0) {
            // send the left coin back to the player after paying the ticket
            transfer::public_transfer(merged_coin, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(merged_coin);
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    #[lint_allow(self_transfer)]
    entry fun mint_invite_arena_chess(role_global:&role::Global, global: &mut Global, rewardsGlobal: &mut metaIdentity::RewardsGlobal, name:String, coins:vector<Coin<SUI>>, 
        metaGlobal:&mut metaIdentity::MetaInfoGlobal, meta: &metaIdentity::MetaIdentity, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let sender = tx_context::sender(ctx);
        // merge the coin payment together (coin smashing) as the ticket price and make sure that it is more than the min 
        // ticket price
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        let paid_price = coin::value(&merged_coin);
        let split_value = paid_price / 10;
        let left_value = paid_price - split_value;
        assert!(utils::check_ticket_gold_cost(paid_price), ERR_PAYMENT_NOT_ENOUGH);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, ctx),
            gold: INIT_GOLD,
            win: 0,
            lose: 0,
            challenge_win:0,
            challenge_lose:0,
            creator: sender,
            gold_cost: paid_price,
            arena: true,
            arena_checked: false
        };
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, left_value, ctx)
        );
        balance::join(&mut global.balance_SUI, balance);

        let balance_for_invite = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, split_value, ctx)
        );
        let inviter_meta_id = metaIdentity::get_invited_metaId(meta);
        metaIdentity::top_up_rewards_pool(rewardsGlobal, balance_for_invite, inviter_meta_id, split_value);
        if (coin::value(&merged_coin) > 0) {
            // send the left coin back to the player after paying the ticket
            transfer::public_transfer(merged_coin, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(merged_coin);
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
        metaIdentity::record_invited_success(metaGlobal, meta);
    }

    // mint a chess nft
    #[lint_allow(self_transfer)]
    entry fun mint_chess(role_global:&role::Global, global: &mut Global, name:String, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            name:name,
            lineup: lineup::empty(ctx),
            cards_pool: lineup::generate_random_cards(role_global, ctx),
            gold: INIT_GOLD,
            win: 0,
            lose: 0,
            challenge_win:0,
            challenge_lose:0,
            creator: sender,
            gold_cost: 0,
            arena: false,
            arena_checked: true
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    // Pay the arena rewards to the player, the ctx is player add
    #[lint_allow(self_transfer)]
    entry fun check_out_arena_fee(global: &mut Global, chess: &mut Chess, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        assert!(chess.arena, ERR_NOT_ARENA_CHESS);
        assert!(!chess.arena_checked, ERR_ARENA_FEE_HAS_CHECKED_OUT);
        chess.arena_checked = true;
        let total_amount = get_total_sui_amount(global);
        // rewards = 0.3*wins*ticket price, has to be less than 90% of the total coins in the chess shop
        let reward_amount = utils::estimate_reward(total_amount, chess.gold_cost, chess.win);
        let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    // Burn the arena nft, the ctx is player add
    // ???  why not call check_out_arena_fee and then burn the arena nft??? : because check_out_arena_fee only check out arena mood reward
    // but he may still has challenge mood reward to be checked out
    #[lint_allow(self_transfer)]
    entry fun check_out_arena(global: &mut Global, chess: Chess, ctx: &mut TxContext) {
        assert!(chess.arena, ERR_NOT_ARENA_CHESS);
        let total_amount = get_total_sui_amount(global);
        let reward_amount = utils::estimate_reward(total_amount, chess.gold_cost, chess.win);
        let Chess {id, name:_, lineup:_, cards_pool:_, gold:_, win:_, lose:_, challenge_win:_, challenge_lose:_, creator:_, gold_cost:_, arena:_, arena_checked: arena_checked} = chess;
        if (!arena_checked) {
            let sui_balance = balance::split(&mut global.balance_SUI, reward_amount);
            let sui = coin::from_balance(sui_balance, ctx);
            transfer::public_transfer(sui, tx_context::sender(ctx));
        };
        object::delete(id);
    }

    public fun get_total_sui_amount(global: &Global) : u64 {
        balance::value(&global.balance_SUI)
    }

    // The function is called before the next battle, the player adjusts(swap, upgrade, change role) the lineup and starts a battle
    // param chess is the same chess nft existing before the operations, in this function, it will be altered by the player's operations.
    // param operations is a string from frontend, which records the operations(buy role, sell role, exchange position, upgrade role ...) in order
    // param lineup_str_vec is the new lineup descriptions after the operations, it contains 6 entries corresponding to the description of the 6 chosen heroes
    // lineup_str_vec is purely the frontend result and needs to be verified
    // The function verifies that the operations are valid and the left SUI balance is correct
    // After verification, the function excutes the round of battle and records the battle result
    public entry fun operate_and_battle(global:&mut Global, role_global:&role::Global, lineup_global:&mut lineup::Global, 
        challengeGlobal:&mut challenge::Global, chess:&mut Chess, operations: vector<String>, left_gold:u8, 
        lineup_str_vec: vector<String>, ctx:&mut TxContext) {
        assert!(vector::length(&lineup_str_vec) == 6, ERR_EXCEED_NUM_LIMIT);
        let current_roles = lineup::get_mut_roles(&mut *&chess.lineup);
        let cards_pool_roles = lineup::get_mut_roles(&mut chess.cards_pool);

        // todo: how to resolve the gas limit problem when publishing
        let expected_lineup = verify_operation(role_global, current_roles, cards_pool_roles, operations, left_gold, lineup_str_vec, chess.name, (chess.gold as u8), chess.gold_cost, ctx);

        // Player normally wins max 20 times because at the 20th win it is ranked num 1
        // If it keeps winning it get no more gold before the next battle to upgrade the team
        if (chess.challenge_win + chess.challenge_lose >= 20) {
            // prevent from unlimited strength upon its lineup
            chess.gold = 0;
        } else {
            // Operation done and the chess.gold is recovered to be 10(INIT_GOLD) for the next round of battle
            chess.gold = INIT_GOLD;
        };
        lineup::set_hash(&mut expected_lineup, lineup::get_hash(&chess.lineup));
        chess.lineup = expected_lineup; 
        
        // challenge mode, arena mode or standard mode will be processed in match function
        battle(role_global, lineup_global, challengeGlobal, chess, ctx);
        global.total_battle = global.total_battle + 1;
    }

    // Operations record the orders made by the play from the interaction with the frontend game portal.
    // Commands include: buy_upgrade; upgrade; buy; sell; swap;
    // Operations are a list of commands and each entry is one command
    // buy upgrade means players drag(buy) a role from shop, and put it in the same role in his lineup, "buy and upgrade your role"
    // swap means swap the postion of 2 roles
    // refresh means refresh your cards in shop, it actually shifts/rotates the index by 5
    // current_roles refers to the current roles in the lineup
    // gold is the action point given for the operations, supposely 10, 
    // left gold is the frontend left gold after the operations, the function needs to make sure that:
    // left_gold = gold - operation_spending to make sure that operations are not tampered
    // lineup_str_vec is the description of the lineup after operations on the frontend, the function updates the lineup
    // after prosessing the operations recorded from frontend and makes sure that it is the same as the pure frontend result
    fun verify_operation(role_global:&role::Global, current_roles:&mut vector<Role>, cards_pool_roles: &mut vector<Role>, operations: vector<String>,
        left_gold:u8, lineup_str_vec: vector<String>, name:String, gold:u8, ticket_gold_cost:u64, 
        ctx:&mut TxContext): LineUp {
        // more like rounds of role rotation
        let refresh_time = 0;
        vector::reverse(&mut operations);
        let gold_cost;
        while(vector::length(&operations) > 0) {
            let operate = vector::pop_back(&mut operations);
            if (operate == utf8(b"refresh")) {
                // rotate the hero pool, each rotation action costs 2 gold
                gold = gold - REFRESH_gold_cost;
                refresh_time = refresh_time + 1;
                if(refresh_time == 6) refresh_time = 0;
                 //test  
                print(&operate);
            }else{
                let sub_str = vector::pop_back(&mut operations);
                let (from_index, to_index) = utils::get_left_right_number(sub_str);
                assert!(vector::length(current_roles) > to_index, ERR_EXCEED_VEC_LENGTH);
                if (operate == utf8(b"buy_upgrade")) {
                    // Buy a hero from the card pool and merge with a compatible hero in player lineup to upgrade the hero   
                    let from_role;        
                    // return the chosen hero in the hero pool, current index is the position of the present 5 heros
                    // hero_pool_index = current_index + rotation_times*number_of_hero_present_in_each_rotation      
                    let index_in_cards_pool = from_index + CARDS_IN_ONE_REFRESH * refresh_time;
                    //test  
                    print(&operate);
                    print(&index_in_cards_pool);
                    print(&to_index); 
                    print(&vector::length(cards_pool_roles)); 
                    //test 

                    assert!(vector::length(cards_pool_roles) > index_in_cards_pool, ERR_EXCEED_VEC_LENGTH);          
                    from_role = vector::borrow_mut<role::Role>(cards_pool_roles, index_in_cards_pool);
                    assert!(role::get_class(from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                    gold_cost = role::get_gold_cost(from_role);
                   
                    let to_role = vector::borrow_mut<role::Role>(current_roles, to_index);
                    assert!(role::get_class(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                    let res = role::upgrade(role_global, from_role, to_role);
                    assert!(res, ERR_UPGRADE_FAILED);
                    // The chosen hero in the hero pool is removed by setting it's name to "none"
                    role::set_class(from_role, utf8(b"none"));
                    gold = gold - gold_cost;
                } else if (operate == utf8(b"buy")) {
                    // buy the chosen hero in the hero pool, has to be placed in an 'empty' lineup position  
                    let index_in_cards_pool = from_index + CARDS_IN_ONE_REFRESH * refresh_time;

                    //test  
                    print(&operate);
                    print(&from_index);
                    print(&index_in_cards_pool);
                    print(&to_index); 
                    //test 

                    assert!(vector::length(cards_pool_roles) > index_in_cards_pool, ERR_EXCEED_VEC_LENGTH);
                    let from_role = vector::borrow_mut<role::Role>(cards_pool_roles, index_in_cards_pool);
                    assert!(role::get_class(from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                    gold_cost = role::get_gold_cost(from_role);
                    let empty = vector::borrow_mut(current_roles, to_index);
                    assert!(role::get_class(empty) == utf8(b"none"), ERR_INVALID_CHARACTOR);
                    role::set_role(empty, from_role);
                    role::set_class(from_role, utf8(b"none"));                
                    gold = gold - gold_cost;
                } else if (operate == utf8(b"swap")) {
                    // swap the two chose heroes in the player lineup (why??? should not affect much) 

                    //test   
                    print(&operate);
                    print(&from_index);
                    print(&to_index);
                    //test   

                    vector::swap(current_roles, from_index, to_index);
                } else if (operate == utf8(b"sell")) {
                    // sell the chosen hero in the player's lineup and remove it form the player lineup by setting to 'none' 
                    assert!(vector::length(current_roles) > from_index, ERR_EXCEED_VEC_LENGTH);
                    let from_role = vector::borrow_mut<role::Role>(current_roles, from_index);

                    //test   
                    print(&operate);
                    print(&from_index);
                    print(&to_index);
                    //test   

                    assert!(role::get_class(from_role) != utf8(b"none"), ERR_INVALID_CHARACTOR);
                    role::set_class(from_role, utf8(b"none"));
                    gold = gold + role::get_sell_gold_cost(from_role);
                } else if (operate == utf8(b"upgrade")) {
                    // merge(upgrade) the two chosen heroes in the player lineup into one and remove the hero corressponding to
                    // from index, the operation does not cost
                    assert!(from_index != to_index, ERR_SAME_INDEX_UPGRADE);
                    assert!(vector::length(current_roles) > from_index, ERR_EXCEED_VEC_LENGTH);                  
                    let from_role = *vector::borrow<role::Role>(current_roles, from_index);
                    let to_role = vector::borrow_mut<role::Role>(current_roles, to_index);

                    //test  
                    print(&operate);
                    print(&from_index);
                    print(&to_index); 
                    //test   

                    assert!(role::get_class(&from_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);                 
                    assert!(role::get_class(to_role) != utf8(b"none"), ERR_CHARACTOR_IS_NONE);
                    let res = role::upgrade(role_global, &from_role, to_role);
                    assert!(res, ERR_UPGRADE_FAILED);
                    role::set_class(vector::borrow_mut<role::Role>(current_roles, from_index), utf8(b"none"));
                }
            }
        };
        let expected_lineup = lineup::parse_lineup_str_vec(name, role_global, lineup_str_vec, ticket_gold_cost, ctx);
        let expected_roles = lineup::get_roles(&expected_lineup);
        //may need to commend out when doing unit test
        assert!(role::check_roles_equality(current_roles, expected_roles), ERR_CHECK_ROLES_NOT_EQUAL);
        assert!(gold == left_gold, ERR_WRONG_LEFT_GOLD);
        
        //test 
        print(&utf8(b"Gold left: "));
        print(&gold);
        //test 

        expected_lineup
    }

    //1. Makes sure the auto_checkout is not triggered, which is at 3 loses from the start of the chess round
    //2. Generates the opponent lineup based on the player's winning time if challenge mode and win-lose tag if standard mode
    //3. Calls fight functions to complete the rounds of actions till one team has no hero alive.
    //4. Processes the battle result, record both winning and losing time 
    //Returns true if player wines the battle and false othwewise
    fun battle(role_global:&role::Global, lineup_global:&mut lineup::Global, challengeGlobal:&mut challenge::Global, chess:&mut Chess, ctx: &mut TxContext) {
        assert!(chess.lose <= 2, ERR_YOU_ARE_DEAD);
        // match an enemy config
        let enemy_lineup;
        let chanllenge_on = false;
        if (chess.win >= 10) {
            assert!(chess.arena, ERR_ONLY_ARENA_MODE_ALLOWED);
            assert!(chess.challenge_lose <= 2, ERR_YOU_ARE_DEAD);
            chanllenge_on = true;
            enemy_lineup = *challenge::get_lineup_by_rank(challengeGlobal, (20 - chess.challenge_win));
        } else {
            enemy_lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, chess.arena, ctx);
        };

        // fight and record lineup
        if (fight(chess, &enemy_lineup, chanllenge_on, ctx)) {
            if (chanllenge_on) {
                // challenge_win is 1 when chess.win is 0, it stays 0 till the 10th win on standard mode
                challenge::rank_forward(challengeGlobal, chess.lineup);
            } else {
                lineup::record_player_lineup(chess.win - 1, chess.lose, lineup_global, chess.lineup, chess.arena);
                if (chess.win == 10) {
                    lineup::record_player_lineup(chess.win, chess.lose, lineup_global, chess.lineup, chess.arena);
                };
            };
        } else {
            // player losses
            if (!chanllenge_on) {
                lineup::record_player_lineup(chess.win, chess.lose - 1, lineup_global, chess.lineup, chess.arena);
            }
        };
        if (chess.lose <= 2) {
            refresh_cards_pools(role_global, chess, ctx);
        };
    }

    fun refresh_cards_pools(role_global:&role::Global, chess:&mut Chess, ctx:&mut TxContext) {
        chess.cards_pool = lineup::generate_random_cards(role_global, ctx);
    }

    // Performs the battle between the player and the rival by rounds of attacks and conter-attacks
    // Return true if player wins and false if play loses
    fun fight(chess: &mut Chess, enemy_lineup: &LineUp, is_challenge:bool, ctx:&TxContext) :bool {
        let my_lineup_fight = *&chess.lineup;

        // backup to avoid base_hp to be changed
        let enemy_lineup_fight = *enemy_lineup;
        let my_roles = *lineup::get_roles(&my_lineup_fight);
        vector::reverse<role::Role>(&mut my_roles);
        let enemy_roles = *lineup::get_roles(&enemy_lineup_fight);
        vector::reverse<role::Role>(&mut enemy_roles);

        let my_acting_role = &mut vector::pop_back(&mut my_roles);
        let enemy_acting_role = &mut vector::pop_back(&mut enemy_roles);
        role::remove_none_roles(&mut my_roles);
        role::remove_none_roles(&mut enemy_roles);

        let permenant_increase_hp_info = vec_map::empty<String, Int_wrapper>();
        //place holder when the opponent(instead of the player) is taking acting
        let increase_hp_info_place_holder = vec_map::empty<String, Int_wrapper>();
        vec_map::insert(&mut increase_hp_info_place_holder, utf8(b"invalid"), utils::generate_wrapper_with_value(0));

        loop {
            /*
            //test
            print(&utf8(b"My acting hero"));
            role::print_role_short(my_acting_role);
            print(&utf8(b"Enmey acting hero"));
            role::print_role_short(enemy_acting_role);
            print(&utf8(b"My rest team"));
            role::print_roles_short(&my_roles);
            print(&utf8(b"Enmey rest team"));
            role::print_roles_short(&enemy_roles);
            */
            //test

            if(role::get_speed(my_acting_role) >= role::get_speed(enemy_acting_role)){
                fight::action(my_acting_role, enemy_acting_role, &mut my_roles,  &mut enemy_roles, &mut permenant_increase_hp_info);
                if(role::get_hp(enemy_acting_role) == 0 && vector::length(&enemy_roles) > 0){
                    enemy_acting_role = &mut vector::pop_back(&mut enemy_roles);
                    continue
                };
                if(role::get_hp(enemy_acting_role) == 0) break;

                fight::action(enemy_acting_role, my_acting_role, &mut enemy_roles,  &mut my_roles, &mut increase_hp_info_place_holder);
                if(role::get_hp(my_acting_role) == 0 && vector::length(&my_roles) > 0)
                    my_acting_role = &mut vector::pop_back(&mut my_roles);
                if(role::get_hp(my_acting_role) == 0) break;
            }else{
                fight::action(enemy_acting_role, my_acting_role, &mut enemy_roles,  &mut my_roles, &mut increase_hp_info_place_holder);
                if(role::get_hp(my_acting_role) == 0 && vector::length(&my_roles) > 0){
                    my_acting_role = &mut vector::pop_back(&mut my_roles);
                    continue
                };
                if(role::get_hp(my_acting_role) == 0) break;

                fight::action(my_acting_role, enemy_acting_role, &mut my_roles,  &mut enemy_roles, &mut permenant_increase_hp_info);
                if(role::get_hp(enemy_acting_role) == 0 && vector::length(&enemy_roles) > 0)
                    enemy_acting_role = &mut vector::pop_back(&mut enemy_roles);
                if(role::get_hp(enemy_acting_role) == 0) break;
            }           
        };

        print(&utf8(b"--------After the battle---------"));
        print(&utf8(b"My acting hero"));
        role::print_role_short(my_acting_role);
        print(&utf8(b"My rest team"));
        role::print_roles_short(&my_roles);
        print(&utf8(b"Enmey acting hero"));
        role::print_role_short(enemy_acting_role);
        print(&utf8(b"Enmey rest team"));
        role::print_roles_short(&enemy_roles);
        //permenant increase hp when the skill is triggered in the battle
        let permenant_roles = lineup::get_mut_roles(&mut chess.lineup);
        if(vec_map::size(&permenant_increase_hp_info) > 0){
            print(&utf8(b"--------miao--------"));
            role::permenant_increase_role_hp(permenant_roles, &permenant_increase_hp_info);
        };
        //test
        print(&utf8(b"--------Permenant roles After the battle---------"));
        role::print_roles_short(permenant_roles);
        //test

        let res;
        if (role::get_hp(my_acting_role) > 0) {
            if (is_challenge){
                chess.challenge_win = chess.challenge_win + 1;           
            } else {
                chess.win = chess.win + 1;              
            };
            res = true;
        } else {
            if (is_challenge){
                chess.challenge_lose = chess.challenge_lose + 1;
            } else {
                chess.lose = chess.lose + 1;              
            };
            res = false
        } ;
        event::emit(FightEvent {
            chess_id: object::id_address(chess),
            v1: tx_context::sender(ctx),
            v1_name: chess.name,
            v1_win: chess.win,
            v1_lose: chess.lose,
            v1_challenge_win: chess.challenge_win,
            v1_challenge_lose: chess.challenge_lose,
            v2_name: lineup::get_name(enemy_lineup),
            v2_lineup:*enemy_lineup,
            res: 2
        });
        res
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
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_battle: 0,
            balance_SUI: balance::zero(),
            version: CURRENT_VERSION,
            manager: @manager
        };
        transfer::share_object(global);
    }

    //326
    #[test]
    fun test_verify_operation(){
        let ctx = tx_context::dummy();
        let role_global = role::generate_role_global(&mut ctx);
        //My roles before operation
        let attacking_roles = vector::empty<Role>();
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1_1")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter1")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1_1")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank1")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter1_1")));
        vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1_1")));

        let cards_pool_roles = lineup::get_mut_roles(&mut lineup::generate_random_cards(&role_global, &mut ctx));
        //role::print_roles_short(cards_pool_roles);

        //The expected results from front end, this is an sample, not verified yet
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

        let operations = vector::empty<String>();
        vector::push_back(&mut operations, utf8(b"sell"));
        vector::push_back(&mut operations, utf8(b"3"));   
        vector::push_back(&mut operations, utf8(b"upgrade"));  
        //vector::push_back(&mut operations, utf8(b"2-4")); //for error test
        vector::push_back(&mut operations, utf8(b"1-4"));
        vector::push_back(&mut operations, utf8(b"upgrade"));
        vector::push_back(&mut operations, utf8(b"2-5"));

        vector::push_back(&mut operations, utf8(b"buy"));
        vector::push_back(&mut operations, utf8(b"2-1"));
        vector::push_back(&mut operations, utf8(b"buy"));
        //vector::push_back(&mut operations, utf8(b"2-2")); //for error test
        //vector::push_back(&mut operations, utf8(b"3-1")); //for error test
        vector::push_back(&mut operations, utf8(b"3-2"));
        vector::push_back(&mut operations, utf8(b"refresh"));
        vector::push_back(&mut operations, utf8(b"refresh"));
        vector::push_back(&mut operations, utf8(b"refresh"));
        vector::push_back(&mut operations, utf8(b"buy"));
        vector::push_back(&mut operations, utf8(b"4-3"));

        vector::push_back(&mut operations, utf8(b"buy_upgrade"));
        vector::push_back(&mut operations, utf8(b"3-4"));
        vector::push_back(&mut operations, utf8(b"refresh"));
        vector::push_back(&mut operations, utf8(b"buy_upgrade"));
        vector::push_back(&mut operations, utf8(b"1-5"));
        vector::push_back(&mut operations, utf8(b"refresh"));
        vector::push_back(&mut operations, utf8(b"buy_upgrade"));
        vector::push_back(&mut operations, utf8(b"0-2"));
        vector::push_back(&mut operations, utf8(b"refresh"));
        vector::push_back(&mut operations, utf8(b"buy_upgrade"));
        vector::push_back(&mut operations, utf8(b"4-2"));

        vector::push_back(&mut operations, utf8(b"sell"));
        vector::push_back(&mut operations, utf8(b"1"));   
        vector::push_back(&mut operations, utf8(b"sell"));
        vector::push_back(&mut operations, utf8(b"3"));  
        vector::push_back(&mut operations, utf8(b"swap")); 
        vector::push_back(&mut operations, utf8(b"0-1"));
        vector::push_back(&mut operations, utf8(b"swap")); 
        vector::push_back(&mut operations, utf8(b"4-5"));

        //All are wrong operations to test 
        //vector::push_back(&mut operations, utf8(b"sell"));
        //vector::push_back(&mut operations, utf8(b"0"));      
        //vector::push_back(&mut operations, utf8(b"buy_upgrade"));
       // vector::push_back(&mut operations, utf8(b"2-5"));     
       //vector::push_back(&mut operations, utf8(b"buy_upgrade"));
        //vector::push_back(&mut operations, utf8(b"buy"));
        //vector::push_back(&mut operations, utf8(b"1-1")); 
        //vector::push_back(&mut operations, utf8(b"upgrade"));
        //vector::push_back(&mut operations, utf8(b"1-2"));

        //verify_operation(role_global:&role::Global, current_roles:&mut vector<Role>, cards_pool_roles: &mut vector<Role>, operations: vector<String>,
        //left_gold:u8, lineup_str_vec: vector<String>, name:String, gold:u8, ticket_gold_cost:u64, 
        //ctx:&mut TxContext)
        let result_lineup = verify_operation(&role_global, &mut attacking_roles, cards_pool_roles, operations, 10, roles_info, utf8(b"Tiff's Test"), 50, 3, &mut ctx); 
        //role::print_roles_short(cards_pool_roles);  

        let result_roles = vector::empty<Role>();
        vector::push_back(&mut result_roles, role::empty());
        vector::push_back(&mut result_roles, role::get_role_by_class(&role_global, utf8(b"priest1_1")));
        vector::push_back(&mut result_roles, role::get_role_by_class(&role_global, utf8(b"wizard2")));
        vector::push_back(&mut result_roles, role::empty());
        //change to level 4
        vector::push_back(&mut result_roles, role::get_role_by_class(&role_global, utf8(b"golem2")));
        //change to level 5
        vector::push_back(&mut result_roles, role::get_role_by_class(&role_global, utf8(b"fighter2")));
        role::set_level(vector::borrow_mut(&mut result_roles, 4), 5);
        role::set_level(vector::borrow_mut(&mut result_roles, 5), 4);

        //role::print_roles_short(&result_roles);
        //role::print_roles_short(&attacking_roles);
        //ERR_NOT_PERMISSION
        assert!(role::check_roles_equality(&result_roles, &attacking_roles), ERR_NOT_PERMISSION);   

        role::delete_role_global(role_global);
    }

    #[test]
    #[allow(unused_assignment,unused_variable)]
    fun test_fight(){
        let ctx = tx_context::dummy();
        let role_global = role::generate_role_global(&mut ctx);
        let attacking_roles = vector::empty<Role>();
        let attacked_roles = vector::empty<Role>();

        let test_group_choice = 8;

        if(test_group_choice == 1){
            //Group 1
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tree3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
        }else if(test_group_choice == 2){
            //Group 2
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"wizard2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"firemega2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter2_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"wizard3")));
        }else if(test_group_choice == 3){
            //Group 3
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tank3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"wizard3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi2_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"wizard2_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime2_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"firemega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi3")));
        }else if(test_group_choice == 4){
            //Group 4
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shaman2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"slime1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"firemega2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"fighter1_1")));
        }else if(test_group_choice == 5){
            //Group 5
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shaman2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"golem1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest1_1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"firemega2")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi1_1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"wizard1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"slime2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"cleric1_1")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani1_1")));
        }else if(test_group_choice == 6){
            //Group 6
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"slime3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"fighter3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"tree3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"firemega3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"cleric3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shaman3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"wizard3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"ani3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"priest3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"golem3")));
        }else if(test_group_choice == 7){
            //Group 7
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"kunoichi3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"archer3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa3")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"archer3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"mega3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"assa3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"shinobi3")));
        }else if(test_group_choice == 8){
            //Group 7
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"assa1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"mega1")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"priest3")));
            vector::push_back(&mut attacking_roles, role::get_role_by_class(&role_global, utf8(b"shinobi1")));

            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank3")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank2")));
            vector::push_back(&mut attacked_roles, role::get_role_by_class(&role_global, utf8(b"tank3")));
        };
        
        //role::print_roles(&attacking_roles);
        //role::print_roles(&attacked_roles);
        let myLineup = lineup::new_lineUP(@0xFACE, utf8(b"tiff"), 6, attacking_roles,  20, utils::seed(&mut ctx, 12));
        let enemy_Lineup = lineup::new_lineUP(@0xCAFE, utf8(b"liyu"), 6, attacked_roles,  20, utils::seed(&mut ctx, 12));

        let game = Chess {
            id: object::new(&mut ctx),
            name:utf8(b"tiff"),
            lineup: myLineup,
            cards_pool: lineup::generate_random_cards(&role_global, &mut ctx),
            gold: INIT_GOLD,
            win: 0,
            lose: 0,
            challenge_win:0,
            challenge_lose:0,
            creator: @0xCAFE,
            gold_cost: 0,
            arena: false,
            arena_checked: true
        };
        fight(&mut game, &mut enemy_Lineup, false, &mut ctx);

/*
        let result_team = vector::empty<Role>();
        if(test_group_choice == 1){
            vector::push_back(&mut result_team, role::get_role_by_class(&role_global, utf8(b"priest2_1")));
            let role = role::get_role_by_class(&role_global, utf8(b"mega3"));
            role::set_hp(&mut role, 26);
            vector::push_back(&mut result_team, role);
            //priest2_1	6	24	6	0
            //mega3	16	26	10	0
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }else if(test_group_choice == 2){
            Class name	attack	hp	speed	sp
            fighter2_1	12	18	8	0
            cleric2	    6	15	7	0
            mega2_1	    8	21	8	0
            firemega2_1	12	15	9	0
            wizard2_1	10	18	9	0
            kunoichi3	24	15	12	0
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }else if(test_group_choice == 3){
            Class name	attack	hp	speed	sp
            kunoichi3	  24	45	12	    1
            firemega3	  24	5	11	    6
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }else if(test_group_choice == 4){
            Class name	attack	hp	speed	sp
            fighter1_1	    4	 9	  6	    0
                assa2	   12	15	  12	1
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }else if(test_group_choice == 5){
            firemega2	12	5	9	4
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }else if(test_group_choice == 6){
            cleric3	12	37	10	0
        firemega3	24	37	11	0
            priest3	12	60	9	0
            tree3	20	43	10	1
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }else if(test_group_choice == 7){
            assa3	24	1	14	1
            assert!(role::check_roles_equality(&result_team, &), ERR_NOT_PERMISSION); 
        }
*/
        role::delete_role_global(role_global);
        transfer::share_object(game);
    }

    #[test]
    fun test_operate_and_battle(){}

    #[test]
    fun test_battle(){}
}