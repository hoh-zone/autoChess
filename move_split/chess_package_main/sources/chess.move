// every game is a chess nft, it functions as a game saver, you can lose at most 3 times, you can check out any time
// to exchange some reward, the reward depends on your ticket price and the times of winning.
// every match will be recoreded in the chain, so we can randomly pk with other players's lineup with similar level.
// standard mode is free, but you can't win sui. In arena mode, players have to buy a ticket to start the game and check out to win some sui.
// before each battle, roles present in hero pool is determined, it costs gold to refresh to see the next five heros in the hero pool with 30 heros generated at the end of last battle
// There is no dynamic generation on frontend when you click "refresh" button.
module chess_package_main::chess {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use std::string::{utf8, String};
    use lineup_package::lineup::{Self, LineUp};
    use sui::balance::{Self, Balance};
    use sui::pay;
    use sui::coin::{Self, Coin};
    use std::vector;
    use sui::clock::{Clock};
    use sui::event;
    use role_package::role::{Self};
    use util_package::utils;
    use chess_package_main::challenge;
    use fight_package::fight;
    use chess_package_main::metaIdentity;

    use sui::sui::SUI;
    use verify_package::verify;

    const INIT_GOLD:u64 = 10;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;
    const ERR_EXCEED_NUM_LIMIT:u64 = 0x02;
    const ERR_PAYMENT_NOT_ENOUGH:u64 = 0x03;
    const ERR_NOT_ARENA_CHESS:u64 = 0x04;
    const ERR_NOT_PERMISSION:u64 = 0x06;
    const ERR_ONLY_ARENA_MODE_ALLOWED:u64 = 0x12;
    const ERR_CHALLENGE_NOT_END:u64 = 0x013;
    const ERR_ARENA_FEE_HAS_CHECKED_OUT:u64 = 0x014;
    const ERR_NO_PERMISSION:u64 = 0x015;
    const ERR_INVALID_VERSION:u64 = 0x016;
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
            manager: @admin
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_battle: 0,
            balance_SUI: balance::zero(),
            version: CURRENT_VERSION,
            manager: @admin
        };
        transfer::share_object(global);
    }

    // Withdraw a the 'amount' of SUI from the chess shop balance and transfer to the local account
    // who publishes the package
    #[lint_allow(self_transfer)]
    public fun withdraw(amount:u64, global: &mut Global, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NOT_PERMISSION);
        let sui_balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    #[lint_allow(self_transfer)]
    public fun top_up_arena_pool(global:&mut Global, coins:vector<Coin<SUI>>, ctx: &mut TxContext) {
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        let amount = coin::value(&merged_coin);
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, amount, ctx)
        );
        balance::join(&mut global.balance_SUI, balance);
        if (coin::value(&merged_coin) > 0) {
            // send the left coin back to the player after paying the ticket
            transfer::public_transfer(merged_coin, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(merged_coin);
        };
    }

    #[lint_allow(self_transfer)]
    public fun top_up_challenge_pool(challengeGlobal: &mut challenge::Global, coins:vector<Coin<SUI>>, ctx: &mut TxContext) {
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        let amount = coin::value(&merged_coin);
        let balance = coin::into_balance<SUI>(
            coin::split<SUI>(&mut merged_coin, amount, ctx)
        );
        challenge::top_up_challenge_pool(challengeGlobal, balance);
        if (coin::value(&merged_coin) > 0) {
            // send the left coin back to the player after paying the ticket
            transfer::public_transfer(merged_coin, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(merged_coin);
        };
    }

    // For the player in the challenge mode when challenge period due
    // Sends the rewards to the player and burns the chess nft
    #[lint_allow(self_transfer)]
    public entry fun claim_rank_reward(challengeGlobal: &mut challenge::Global, chess:Chess, clock:&Clock, rank:u8, ctx: &mut TxContext) {
        assert!(challenge::query_left_challenge_time(challengeGlobal, clock) == 0, ERR_CHALLENGE_NOT_END);
        let sender = tx_context::sender(ctx);
        let tmp_lineup = challenge::get_lineup_by_rank(challengeGlobal, rank);
        assert!((lineup::get_creator(tmp_lineup) == sender && lineup::get_hash(tmp_lineup) == lineup::get_hash(&chess.lineup)), ERR_NOT_PERMISSION);
        let Chess {id, name:_, lineup:_, cards_pool:_, gold:_, win:_, lose:_, challenge_win:_, challenge_lose:_, creator:_, gold_cost:_, arena:_, arena_checked:_} = chess;
        challenge::send_reward_by_rank(challengeGlobal, rank, ctx);
        object::delete(id);
    }

    #[lint_allow(self_transfer)]
    public entry fun mint_arena_chess(role_global:&role::Global, global: &mut Global, name:String, coins:vector<Coin<SUI>>, 
    metaGlobal:&mut metaIdentity::MetaInfoGlobal, meta: &mut metaIdentity::MetaIdentity, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let sender = tx_context::sender(ctx);
        // merge the coin payment together (coin smashing) as the ticket price and make sure that it is more than the min 
        // ticket price
        let merged_coin = vector::pop_back(&mut coins);
        pay::join_vec(&mut merged_coin, coins);
        let paid_price = coin::value(&merged_coin);
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
            coin::split<SUI>(&mut merged_coin, paid_price, ctx)
        );
        balance::join(&mut global.balance_SUI, balance);
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
    public entry fun mint_chess(role_global:&role::Global, global: &mut Global, name:String, ctx: &mut TxContext) {
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
    public entry fun check_out_arena_fee(global: &mut Global, chess: &mut Chess, ctx: &mut TxContext) {
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
    public entry fun check_out_arena(global: &mut Global, chess: Chess, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
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

    #[test_only]
    public fun get_lineup(chess:&Chess): &LineUp {
        &chess.lineup
    }

    #[test_only]
    public fun get_cards_pool(chess:&Chess): &LineUp {
        &chess.cards_pool
    }

    //1. Makes sure the auto_checkout is not triggered, which is at 3 loses from the start of the chess round
    //2. Generates the opponent lineup based on the player's winning time if challenge mode and win-lose tag if standard mode
    //3. Calls fight functions to complete the rounds of actions till one team has no hero alive.
    //4. Processes the battle result, record both winning and losing time 
    //Returns true if player wines the battle and false othwewise
    /*
    match->battle
    */
    fun battle(role_global:&role::Global, lineup_global:&mut lineup::Global, challengeGlobal:&mut challenge::Global, 
    chess:&mut Chess, meta:&mut metaIdentity::MetaIdentity, ctx: &mut TxContext) {
        assert!(chess.lose <= 2, ERR_YOU_ARE_DEAD);

        // match an enemy config
        let enemy_lineup;
        let chanllenge_on = false;
        if (chess.win >= 10) {
            assert!(chess.arena, ERR_ONLY_ARENA_MODE_ALLOWED);
            assert!(chess.challenge_lose <= 2, ERR_YOU_ARE_DEAD);
            chanllenge_on = true;
            enemy_lineup = *challenge::get_lineup_by_rank(challengeGlobal, (19 - chess.challenge_win));
        } else {
            enemy_lineup = lineup::select_random_lineup(chess.win, chess.lose, lineup_global, chess.arena, ctx);
        };

        // fight and record lineup
        if (fight(chess, &mut enemy_lineup, chanllenge_on, ctx)) {
            if (chanllenge_on) {
                // challenge_win is 1 when chess.win is 0, it stays 0 till the 10th win on standard mode
                chess.challenge_win = chess.challenge_win + 1;
                challenge::rank_forward(challengeGlobal, chess.lineup, meta);
                metaIdentity::record_add_win(meta);
            } else {
                chess.win = chess.win + 1;
                lineup::record_player_lineup(chess.win - 1, chess.lose, lineup_global, chess.lineup, chess.arena);
                if (chess.win == 10) {
                    lineup::record_player_lineup(chess.win, chess.lose, lineup_global, chess.lineup, chess.arena);
                };
            };
        } else {
            // player losses
            if (chanllenge_on) {
                chess.challenge_lose = chess.challenge_lose + 1;
                metaIdentity::record_add_lose(meta);
            } else {
                chess.lose = chess.lose + 1;
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
    public fun fight(chess: &mut Chess, enemy_lineup: &mut LineUp, is_challenge:bool, ctx:&mut TxContext) :bool {
        let my_lineup_fight = *&chess.lineup;

        // backup to avoid base_hp to be changed
        let enemy_lineup_fight = *enemy_lineup;

        // records the states of the lineup before the battle
        let my_lineup_permanent = &mut chess.lineup;
        let my_roles = *lineup::get_roles(&my_lineup_fight);
        vector::reverse<role::Role>(&mut my_roles);
        let my_num = vector::length(&my_roles);
        let enemy_roles = *lineup::get_roles(&enemy_lineup_fight);
        vector::reverse<role::Role>(&mut enemy_roles);
        if (my_num == 0) {
            return false
        };

        let my_first_role = role::init_role();
        let enemy_first_role = role::init_role();
        let my_fist_role_index = 0;
        let enemy_first_role_index = 0;

        // Do rounds of player-action and opponent conter-action till one team contains no living charactor
        while (fight::some_alive(&my_first_role, &my_roles) && fight::some_alive(&enemy_first_role, &enemy_roles)) {

            // get the next living player role and remove dead herosQ
            while (vector::length(&my_roles) > 0 && (role::get_hp(&my_first_role) == 0 || (role::get_class(&my_first_role) == utf8(b"none") || role::get_class(&my_first_role) == utf8(b"init")))) {
                my_first_role = vector::pop_back(&mut my_roles);
                if (vector::length(&my_roles) < 5) {
                    my_fist_role_index = my_fist_role_index + 1;
                };
            };

            // get the next living opponent role and remove dead heros
            while (vector::length(&enemy_roles) > 0 && (role::get_hp(&enemy_first_role) == 0 || (role::get_class(&enemy_first_role) == utf8(b"none") || role::get_class(&enemy_first_role) == utf8(b"init")))) {
                enemy_first_role = vector::pop_back(&mut enemy_roles);
                if (vector::length(&enemy_roles) < 5) {
                    enemy_first_role_index = enemy_first_role_index + 1;
                };
            };

            // When both my acting role and opponent charactor are alive, both take actions (always player first?) till one is dead
            while(role::get_hp(&my_first_role) > 0 && role::get_hp(&enemy_first_role) > 0) {
                fight::action(my_fist_role_index, &mut my_first_role, &mut enemy_first_role, &mut my_roles, &mut enemy_roles, my_lineup_permanent);
                fight::action(enemy_first_role_index, &mut enemy_first_role, &mut my_first_role, &mut enemy_roles, &mut my_roles, my_lineup_permanent);
            };
        };

        let win = chess.win;
        let lose = chess.lose;
        let challenge_win = chess.challenge_win;
        let challenge_lose = chess.challenge_lose;
        let res;
        if (fight::some_alive(&enemy_first_role, &enemy_roles)) {
            if (is_challenge) {
                challenge_lose = challenge_lose + 1;
            } else {
                lose = lose + 1;
            };
            res = false
        } else {
            if (is_challenge) {
                challenge_win = challenge_win + 1;
            } else {
                win = win + 1;
            };
            res = true;
        };
        event::emit(FightEvent {
            chess_id: object::id_address(chess),
            v1: tx_context::sender(ctx),
            v1_name: chess.name,
            v1_win: win,
            v1_lose: lose,
            v1_challenge_win: challenge_win,
            v1_challenge_lose: challenge_lose,
            v2_name: lineup::get_name(enemy_lineup),
            v2_lineup:*enemy_lineup,
            res: 2
        });
        res
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
        lineup_str_vec: vector<String>, meta: &mut metaIdentity::MetaIdentity, ctx:&mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        assert!(vector::length(&lineup_str_vec) == 6, ERR_EXCEED_NUM_LIMIT);
        let current_lineup = *&chess.lineup;
        let current_roles = lineup::get_mut_roles(&mut current_lineup);
        let cards_pool = chess.cards_pool;
        let cards_pool_roles = lineup::get_mut_roles(&mut cards_pool);

        // todo: how to resolve the gas limit problem when publishing
        verify::verify_operation(role_global, current_roles, cards_pool_roles, operations, left_gold, lineup_str_vec, chess.name, (chess.gold as u8), chess.gold_cost, ctx);
        let expected_lineup = lineup::parse_lineup_str_vec(chess.name, role_global, lineup_str_vec, chess.gold_cost, ctx);

        // Player normally wins max 20 times because at the 20th win it is ranked num 1
        // If it keeps winning it get no more gold before the next battle to upgrade the team
        if (chess.challenge_win + chess.challenge_lose >= 20) {
            // prevent from unlimited strength upon its lineup
            chess.gold = 0;
        } else {
            // Operation done and the chess.gold is recovered to be 10(INIT_GOLD) for the next round of battle
            chess.gold = INIT_GOLD;
        };
        let tmp_hash = lineup::get_hash(&chess.lineup);
        chess.lineup = expected_lineup; 
        lineup::set_hash(&mut chess.lineup, tmp_hash);
        // challenge mode, arena mode or standard mode will be processed in match function
        battle(role_global, lineup_global, challengeGlobal, chess, meta, ctx);
        global.total_battle = global.total_battle + 1;
    }

    public fun upgradeVersion(global: &mut Global, version:u64, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.version = version;
    }

    public fun change_manager(global: &mut Global, new_manager: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.manager = new_manager;
    }
}