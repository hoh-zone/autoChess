module chess_package_main::metaIdentity {
    use std::string;
    use sui::object::{Self, UID};
    use sui::linked_table::{Self, LinkedTable};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::table::{Self};
    use sui::balance::{Self, Balance};
    use std::vector::{Self};
    use sui::sui::SUI;
    use sui::coin::{Self};

    friend chess_package_main::chess;
    friend chess_package_main::challenge;
    
    const ERR_ALREADY_BIND:u64 = 0x001;
    const ERR_NO_PERMISSION:u64 = 0x002;
    const ERR_INVALID_VERSION:u64 = 0x003;
    const ERR_ALREADY_CLAMIED:u64 = 0x004;
    const EXP_LEVEL1:u64 = 20;
    const EXP_LEVEL2:u64 = 40;
    const EXP_LEVEL3:u64 = 80;
    const EXP_LEVEL4:u64 = 100;
    const EXP_LEVEL5:u64 = 200;
    const EXP_LEVEL6:u64 = 300;
    const EXP_LEVEL7:u64 = 400;
    const EXP_LEVEL8:u64 = 500;
    const EXP_LEVEL9:u64 = 600;
    const EXP_LEVEL10:u64 = 1000;
    const AMOUNT_DECIMAL:u64 = 1_000_000_000;

    const INIT_META_ID_INDEX:u64 = 10000;
    const ERR_NOT_PERMISSION:u64 = 0x01;
    const CURRENT_VERSION:u64 = 1;

    struct MetaIdentity has key {
        id:UID,
        metaId:u64,
        name:string::String,
        wallet_addr:address,

        // record the num clamied for invite activity to prevent double claim
        invited_claimed_num: u64,
        level: u64,
        exp: u64,
        total_arena_win: u64,
        total_arena_lose: u64,
        avatar_name: string::String,
        best_rank_map: table::Table<u64, u64>,
        init_gold: u64,
        ability1: string::String,
        ability2: string::String,
        ability3: string::String,
        ability4: string::String,
        ability5: string::String,
        inviterMetaId: u64
    }

    struct RewardsGlobal has key {
        id:UID,
        creator: address,
        balance_SUI: Balance<SUI>,

        // metaId -> claimed num(in people) for sui rewards
        claimed_rewards_num_map: table::Table<u64, u64>,

        // metaId -> rebateLevel
        // not in table: 2%, 1: 3%, 2:4% , 3:5%
        rebate_level: table::Table<u64, u64>,
        version: u64,
        manager: address,
    }

    struct MetaInfoGlobal has key {
        id:UID,
        creator: address,
        total_players: u64,

        // wallet_addr -> meta_addr
        wallet_meta_map:table::Table<address, address>,

        // inviterMetaId -> invited players addresses list
        invited_meta_map:LinkedTable<u64, vector<address>>,
        version: u64,
        manager: address
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = MetaInfoGlobal {
            id: object::new(ctx),
            creator: @admin,
            total_players: 0,
            wallet_meta_map:table::new<address, address>(ctx),
            invited_meta_map:linked_table::new<u64, vector<address>>(ctx),
            version: CURRENT_VERSION,
            manager: @admin
        };
        transfer::share_object(global);
    }

    #[allow(unused_function)]
    fun init(ctx: &mut TxContext) {
        let global = MetaInfoGlobal {
            id: object::new(ctx),
            creator:@admin,
            total_players: 0,
            wallet_meta_map:table::new<address, address>(ctx),
            invited_meta_map:linked_table::new<u64, vector<address>>(ctx),
            version: CURRENT_VERSION,
            manager: @admin
        };
        transfer::share_object(global);
    }

    public fun init_rewards_global(ctx: &mut TxContext) {
        let global = RewardsGlobal {
            id: object::new(ctx),
            creator: @admin,
            balance_SUI: balance::zero(),
            claimed_rewards_num_map: table::new<u64, u64>(ctx),
            rebate_level: table::new<u64, u64>(ctx),
            version: CURRENT_VERSION,
            manager: @admin
        };
        transfer::share_object(global);
    }

    public fun top_up_rewards_pool(global:&mut RewardsGlobal, balance:Balance<SUI>) {
        balance::join(&mut global.balance_SUI, balance);
    }

    #[lint_allow(self_transfer)]
    public fun airdrop_split(amount:u64, global: &mut RewardsGlobal, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NOT_PERMISSION);
        let sui_balance = balance::split(&mut global.balance_SUI, amount);
        let sui = coin::from_balance(sui_balance, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));
    }

    public entry fun mint_meta(global: &mut MetaInfoGlobal, name:string::String, avatar_name: string::String, ctx:&mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let sender = tx_context::sender(ctx);
        assert!(!table::contains(&global.wallet_meta_map, sender), ERR_ALREADY_BIND);
        let metaId = INIT_META_ID_INDEX + global.total_players;
        let uid = object::new(ctx);
        let meta_addr = object::uid_to_address(&uid);
        table::add(&mut global.wallet_meta_map, sender, meta_addr);
        let meta = MetaIdentity {
            id:uid,
            metaId:metaId,
            name:name,
            wallet_addr:sender,
            invited_claimed_num: 0,
            level: 0,
            exp: 0,
            total_arena_win: 0,
            total_arena_lose: 0,
            avatar_name: avatar_name,
            best_rank_map: table::new<u64, u64>(ctx),
            init_gold: 0,
            ability1: string::utf8(b""),
            ability2: string::utf8(b""),
            ability3: string::utf8(b""),
            ability4: string::utf8(b""),
            ability5: string::utf8(b""),
            inviterMetaId: 0
        };
        global.total_players = global.total_players + 1;
        transfer::transfer(meta, sender);
    }

    public fun register_invited_meta(global: &mut MetaInfoGlobal, inviterMetaId:u64, name:string::String, avatar_name: string::String, ctx: &mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let sender = tx_context::sender(ctx);
        assert!(!table::contains(&global.wallet_meta_map, sender), ERR_ALREADY_BIND);
        let metaId = INIT_META_ID_INDEX + global.total_players;
        let uid = object::new(ctx);
        let meta_addr = object::uid_to_address(&uid);
        table::add(&mut global.wallet_meta_map, sender, meta_addr);
        let meta = MetaIdentity {
            id:uid,
            metaId:metaId,
            name:name,
            wallet_addr:sender,
            invited_claimed_num: 0,
            level: 0,
            exp: 0,
            total_arena_win: 0,
            total_arena_lose: 0,
            avatar_name: avatar_name,
            best_rank_map: table::new<u64, u64>(ctx),
            init_gold: 0,
            ability1: string::utf8(b""),
            ability2: string::utf8(b""),
            ability3: string::utf8(b""),
            ability4: string::utf8(b""),
            ability5: string::utf8(b""),
            inviterMetaId: inviterMetaId
        };
        global.total_players = global.total_players + 1;
        transfer::transfer(meta, sender);
    }

    public fun changeMetaInfo(meta: &mut MetaIdentity, name:string::String, avatar_name: string::String) {
        meta.name = name;
        meta.avatar_name = avatar_name;
    }

    public(friend) fun record_invited_success(global:&mut MetaInfoGlobal, meta: &MetaIdentity) {
        if (meta.inviterMetaId == meta.metaId) {
            // prevent invite myself
            return
        };
        let inviterMetaId = meta.inviterMetaId;
        let user_addr = meta.wallet_addr;
        if (!linked_table::contains(&global.invited_meta_map, inviterMetaId)) {
            let newVec = vector::empty<address>();
            vector::push_back(&mut newVec, user_addr);
            linked_table::push_back(&mut global.invited_meta_map, inviterMetaId, newVec);
        } else {
            let oldVec = linked_table::borrow_mut(&mut global.invited_meta_map, inviterMetaId);
            if (!vector::contains(oldVec, &user_addr)) {
                vector::push_back(oldVec, user_addr);
            }
        };
    }

    public(friend) fun record_add_win(meta: &mut MetaIdentity) {
        meta.total_arena_win = meta.total_arena_win + 1;
        add_exp(meta, 4);
    }

    public(friend) fun record_add_lose(meta: &mut MetaIdentity) {
        meta.total_arena_lose = meta.total_arena_lose + 1;
        add_exp(meta, 1);
    }

    public(friend) fun record_update_best_rank(meta: &mut MetaIdentity, rank:u64) {
        let seasonId = 1;
        if (table::contains(&meta.best_rank_map, seasonId)) {
            let last_rank = *table::borrow(&meta.best_rank_map, seasonId);
            if (rank < last_rank) {
                table::remove(&mut meta.best_rank_map, seasonId);
                table::add(&mut meta.best_rank_map, seasonId, rank);
            };
        } else {
            table::add(&mut meta.best_rank_map, seasonId, rank);
        };
    }

    fun add_exp(meta: &mut MetaIdentity, exp:u64) {
        let current_level = meta.level;
        let current_exp = meta.exp;
        current_exp = current_exp + exp;
        if (current_level == 0 && current_exp >= EXP_LEVEL1) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL1;
        } else if (current_level == 1 && current_exp >= EXP_LEVEL2) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL2;
        } else if (current_level == 2 && current_exp >= EXP_LEVEL3) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL3;
        } else if (current_level == 3 && current_exp >= EXP_LEVEL4) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL4;
        } else if (current_level == 4 && current_exp >= EXP_LEVEL5) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL5;
        } else if (current_level == 5 && current_exp >= EXP_LEVEL6) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL6;
        } else if (current_level == 6 && current_exp >= EXP_LEVEL7) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL7;
        } else if (current_level == 7 && current_exp >= EXP_LEVEL8) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL8;
        } else if (current_level == 8 && current_exp >= EXP_LEVEL9) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL9;
        } else if (current_level == 9 && current_exp >= EXP_LEVEL10) {
            level_up(meta);
            meta.exp = current_exp - EXP_LEVEL10;
        } else {
            meta.exp = current_exp;
        }
    }

    fun level_up(meta: &mut MetaIdentity) {
        meta.level = meta.level + 1;
    }

    public fun query_best_rank_by_season(meta: &mut MetaIdentity, seasonId: u64) :u64 {
        if (table::contains(&meta.best_rank_map, seasonId)) {
            *table::borrow(&meta.best_rank_map, seasonId)
        } else {
            21
        }
    }

    // query the successfully invited num
    public fun query_invited_num(global:&MetaInfoGlobal, metaId: u64) : u64 {
        if (linked_table::contains(&global.invited_meta_map, metaId)) {
            let addr_vec = linked_table::borrow(&global.invited_meta_map, metaId);
            vector::length(addr_vec)
        } else {
            0
        }
    }

    #[lint_allow(self_transfer)]
    public fun claim_invite_rewards(global:&MetaInfoGlobal, rewardsGlobal:&mut RewardsGlobal, meta: &mut MetaIdentity, ctx:&mut TxContext) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        assert!(rewardsGlobal.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let metaId = meta.metaId;
        let invited_num = query_invited_num(global, metaId);
        let claimed_num;
        if (!table::contains(&rewardsGlobal.claimed_rewards_num_map, metaId)) {
            claimed_num = 0;
        } else {
            claimed_num = *table::borrow(&rewardsGlobal.claimed_rewards_num_map, metaId);
        };
        assert!(invited_num > claimed_num, ERR_ALREADY_CLAMIED);
        let diff_num = invited_num - claimed_num;

        // everyone can gain 2% rewards
        let amount;
        if (table::contains(&rewardsGlobal.rebate_level, metaId)) {
            let level = *table::borrow(&rewardsGlobal.rebate_level, metaId);
            if (level == 1) {
                amount = diff_num * AMOUNT_DECIMAL / 33;
            } else if (level == 2) {
                amount = diff_num * AMOUNT_DECIMAL / 25;
            } else if (level == 3) {
                amount = diff_num * AMOUNT_DECIMAL / 20;
            } else {
                amount = diff_num * AMOUNT_DECIMAL / 50;
            }
        } else {
            amount = diff_num * AMOUNT_DECIMAL / 50;
        };
        let sui_rewards = balance::split(&mut rewardsGlobal.balance_SUI, amount);
        let sui = coin::from_balance(sui_rewards, ctx);
        transfer::public_transfer(sui, tx_context::sender(ctx));

        // record num
        if (!table::contains(&rewardsGlobal.claimed_rewards_num_map, metaId)) {
            table::add(&mut rewardsGlobal.claimed_rewards_num_map, metaId, invited_num);
        } else {
            table::remove(&mut rewardsGlobal.claimed_rewards_num_map, metaId);
            table::add(&mut rewardsGlobal.claimed_rewards_num_map, metaId, invited_num);
        };
    }

    public fun set_rebate_level(rewardsGlobal: &mut RewardsGlobal, metaId: u64, level: u64, ctx:&mut TxContext) {
        assert!(tx_context::sender(ctx) == rewardsGlobal.manager, ERR_NOT_PERMISSION);
        table::add(&mut rewardsGlobal.rebate_level, metaId, level);
    }

    public fun query_rebate_level(rewardsGlobal: &mut RewardsGlobal, metaId: u64) :u64 {
        if (table::contains(&rewardsGlobal.rebate_level, metaId)) {
            *table::borrow(&rewardsGlobal.rebate_level, metaId)
        } else {
            0
        }
    }

    public fun claim_invite_exp(global:&MetaInfoGlobal, meta:&mut MetaIdentity) {
        assert!(global.version == CURRENT_VERSION, ERR_INVALID_VERSION);
        let metaId = meta.metaId;
        let invited_num = query_invited_num(global, metaId);
        let claimed_num = meta.invited_claimed_num;
        assert!(invited_num > claimed_num, ERR_ALREADY_CLAMIED);
        add_exp(meta, (invited_num - claimed_num) * 20);
        meta.invited_claimed_num = meta.invited_claimed_num + 1;
    }

    public fun get_is_registered(global: &MetaInfoGlobal, user_addr:address) : u64 {
        if (table::contains(&global.wallet_meta_map, user_addr)) {
            1
        } else {
            0
        }
    }

    public fun is_registered(global: &MetaInfoGlobal, user_addr:address) : bool {
        table::contains(&global.wallet_meta_map, user_addr)
    }
    
    public fun get_metaId(meta: &MetaIdentity) : u64 {
        meta.metaId
    }

    public fun get_level(meta: &MetaIdentity) : u64 {
        meta.level
    }

    public fun get_exp(meta: &MetaIdentity) : u64 {
        meta.exp
    }

    public fun get_arena_win(meta: &MetaIdentity) : u64 {
        meta.total_arena_win
    }

    public fun get_arena_lose(meta: &MetaIdentity) : u64 {
        meta.total_arena_lose
    }

    public fun get_name(meta: &MetaIdentity) : string::String {
        meta.name
    }

    public fun get_invited_metaId(meta: &MetaIdentity) : u64 {
        meta.inviterMetaId
    }

    public fun burn_meta(meta: MetaIdentity) {
        let MetaIdentity {
            id,
            metaId: _,
            name: _,
            wallet_addr: _,
            invited_claimed_num: _,
            level: _,
            exp: _,
            total_arena_win: _,
            total_arena_lose: _, 
            avatar_name: _,
            best_rank_map,
            init_gold: _,
            ability1: _,
            ability2: _,
            ability3: _,
            ability4: _,
            ability5: _,
            inviterMetaId: _
        } = meta;
        table::drop(best_rank_map);
        object::delete(id);
    }

    public fun upgradeVersion(global: &mut MetaInfoGlobal, version:u64, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.version = version;
    }

    public fun upgradeVersion2(global: &mut RewardsGlobal, version:u64, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.version = version;
    }

    public fun change_manager(global: &mut MetaInfoGlobal, new_manager: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.manager = new_manager;
    }

    public fun change_manager2(global: &mut RewardsGlobal, new_manager: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == global.manager, ERR_NO_PERMISSION);
        global.manager = new_manager;
    }
}
