module chess_package_main::metaIdentity {
    use std::string;
    use sui::object::{Self, UID};
    use sui::linked_table::{Self, LinkedTable};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::table::{Self};
    use std::vector::{Self};
    friend chess_package_main::chess;
    
    const ERR_ALREADY_BIND:u64 = 0x001;

    struct MetaIdentity has key {
        id:UID,
        metaId:u64,
        name:string::String,
        wallet_addr:address,
        level: u64,
        exp: u64,
        total_arena_win: u64,
        total_arena_lose: u64,
        best_challenge_rank: u64,
        init_gold: u64,
        ability1: string::String,
        ability2: string::String,
        ability3: string::String,
        ability4: string::String,
        ability5: string::String,
        inviterMetaId: u64
    }

    struct MetaInfoGlobal has key{
        id:UID,
        creator: address,
        total_players: u64,

        // wallet_addr -> meta_addr
        wallet_meta_map:table::Table<address, address>,

        // inviterMetaId -> invited players addresses list
        invited_meta_map:LinkedTable<u64, vector<address>>
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = MetaInfoGlobal {
            id: object::new(ctx),
            creator:@account,
            total_players: 0,
            wallet_meta_map:table::new<address, address>(ctx),
            invited_meta_map:linked_table::new<u64, vector<address>>(ctx),
        };
        transfer::share_object(global);
    }

    #[allow(unused_function)]
    fun init(ctx: &mut TxContext) {
        let global = MetaInfoGlobal {
            id: object::new(ctx),
            creator:@account,
            total_players: 0,
            wallet_meta_map:table::new<address, address>(ctx),
            invited_meta_map:linked_table::new<u64, vector<address>>(ctx),
        };
        transfer::share_object(global);
    }

    public entry fun mint_meta(global: &mut MetaInfoGlobal, name:string::String, ctx:&mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(!table::contains(&global.wallet_meta_map, sender), ERR_ALREADY_BIND);
        let metaId = global.total_players;
        let uid = object::new(ctx);
        let meta_addr = object::uid_to_address(&uid);
        table::add(&mut global.wallet_meta_map, sender, meta_addr);
        let meta = MetaIdentity {
            id:uid,
            metaId:metaId,
            name:name,
            wallet_addr:sender,
            level: 0,
            exp: 0,
            total_arena_win: 0,
            total_arena_lose: 0,
            best_challenge_rank: 21,
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

    public fun register_invited_meta(global: &mut MetaInfoGlobal, inviterMetaId:u64, name:string::String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(!table::contains(&global.wallet_meta_map, sender), ERR_ALREADY_BIND);
        table::add(&mut global.wallet_meta_map, sender, sender);
        let myMetaId = global.total_players;
        let uid = object::new(ctx);
        let meta_addr = object::uid_to_address(&uid);
        table::add(&mut global.wallet_meta_map, sender, meta_addr);
        let meta = MetaIdentity {
            id:uid,
            metaId:myMetaId,
            name:name,
            wallet_addr:sender,
            level: 0,
            exp: 0,
            total_arena_win: 0,
            total_arena_lose: 0,
            best_challenge_rank: 21,
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

    public(friend) fun record_invited_success(global:&mut MetaInfoGlobal, meta: &MetaIdentity) {
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

    public fun query_invited_num(global:&MetaInfoGlobal, metaId: u64) : u64 {
        if (linked_table::contains(&global.invited_meta_map, metaId)) {
            let addr_vec = linked_table::borrow(&global.invited_meta_map, metaId);
            vector::length(addr_vec)
        } else {
            0
        }
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
}
