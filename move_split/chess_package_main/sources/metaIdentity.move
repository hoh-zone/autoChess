module chess_package_main::metaIdentity {
    use std::string;
    use sui::object::{Self, UID};
    use sui::linked_table::{Self, LinkedTable};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::table::{Self};
    use std::vector::{Self};
    
    const ERR_ALREADY_BIND:u64 = 0x008;
    const ERR_HAS_BEEN_INVITED_BY_MYSELF:u64 = 0x015;
    const ERR_HAS_BEEN_INVITED:u64 = 0x016;

    struct MetaIdentity has key {
        id:UID,
        metaId:u64,
        name:string::String,
        wallet_addr:address,
        level: u64,
        exp: u64,
        init_gold: u64,
        ability1: string::String,
        ability2: string::String,
        ability3: string::String,
        ability4: string::String,
        ability5: string::String
    }

    struct MetaInfoGlobal has key{
        id:UID,
        creator: address,
        total_players: u64,

        // wallet_addr -> meta_addr
        wallet_meta_map:table::Table<address, address>,

        inviteMap:LinkedTable<u64, vector<address>>,

        // invitorMetaId -> invited addresses list
        invitedMap:LinkedTable<u64, vector<address>>
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = MetaInfoGlobal {
            id: object::new(ctx),
            creator:@account,
            total_players: 0,
            inviteMap:linked_table::new<u64, vector<address>>(ctx),
            invitedMap:linked_table::new<u64, vector<address>>(ctx),
            wallet_meta_map:table::new<address, address>(ctx),
        };
        transfer::share_object(global);
    }

    #[allow(unused_function)]
    fun init(ctx: &mut TxContext) {
        let global = MetaInfoGlobal {
            id: object::new(ctx),
            creator:@account,
            total_players: 0,
            inviteMap:linked_table::new<u64, vector<address>>(ctx),
            invitedMap:linked_table::new<u64, vector<address>>(ctx),
            wallet_meta_map:table::new<address, address>(ctx),
        };
        transfer::share_object(global);
    }

    public fun register_meta(global: &mut MetaInfoGlobal, name:string::String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(!table::contains(&global.wallet_meta_map, sender), ERR_ALREADY_BIND);
        table::add(&mut global.wallet_meta_map, sender, sender);
        let uid = object::new(ctx);
        let meta = MetaIdentity {
            id:uid,
            metaId:global.total_players,
            name:name,
            wallet_addr:sender,
            level: 0,
            exp: 0,
            init_gold: 0,
            ability1: string::utf8(b""),
            ability2: string::utf8(b""),
            ability3: string::utf8(b""),
            ability4: string::utf8(b""),
            ability5: string::utf8(b"")
        };
        global.total_players = global.total_players + 1;
        transfer::transfer(meta, sender);
    }

    public fun invite_players(global: &mut MetaInfoGlobal, inviteMetaId:u64, receiver:address, _ctx:&mut TxContext) {
        assert!(!is_registered(global, receiver), ERR_HAS_BEEN_INVITED);

        // add to map
        if(linked_table::contains(&global.inviteMap, inviteMetaId)) {
            let invite_players = linked_table::borrow_mut(&mut global.inviteMap, inviteMetaId);
            assert!(!vector::contains(invite_players, &receiver), ERR_HAS_BEEN_INVITED_BY_MYSELF);
            vector::push_back(invite_players, receiver);
        } else {
            let invite_players = vector::empty<address>();
            vector::push_back(&mut invite_players, receiver);
            linked_table::push_back(&mut global.inviteMap, inviteMetaId, invite_players);
        };
    }

    public fun query_invited_num(global:&MetaInfoGlobal, metaId: u64) : u64 {
        if (linked_table::contains(&global.invitedMap, metaId)) {
            let addr_vec = linked_table::borrow(&global.invitedMap, metaId);
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

    // todo: claim area chess and add invited num
}
