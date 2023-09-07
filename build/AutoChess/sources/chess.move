module auto_chess::chess {
    // use auto_chess::role;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use sui::table::{Self, Table};
    use std::string::{utf8, String};
    use std::vector::{Self};
    use auto_chess::lineup::{Self, LineUp};
    use std::debug::print;
    use auto_chess::role::{Self};

    const INIT_LIFE:u64 = 100;
    const ERR_YOU_ARE_DEAD:u64 = 0x01;

    struct Global has key {
        id: UID,
        total_chesses: u64,
        total_match:u64,
        // "3-1" -> random list 
        configs: table::Table<String, vector<LineUp>>
    }

    struct Chess has key, store {
        id:UID,
        lineup: LineUp,
        life: u64,
        won: u8,
        lose: u8,
        creator: address
    }

    fun init_virtual_configs(role_global: &role::Global, ctx: &mut TxContext): Table<String, vector<LineUp>> {
        let configs = table::new<String, vector<LineUp>>(ctx);
        if (!table::contains(&configs, utf8(b"0-0"))) {
            let vec = vector::empty<LineUp>();
            vector::push_back(&mut vec, lineup::create_lineup(role_global, ctx));
            table::add(&mut configs, utf8(b"0-0"), vec);
        };
        configs
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
            configs: table::new<String, vector<LineUp>>(ctx)
        };
        transfer::share_object(global);
    }

    
    #[test_only]
    public fun init_for_test(role_global:&role::Global, ctx: &mut TxContext) {
        let virtual_configs = init_virtual_configs(role_global, ctx);
        let global = Global {
            id: object::new(ctx),
            total_chesses: 0,
            total_match: 0,
            configs:virtual_configs
        };
        transfer::share_object(global);
    }

    public entry fun mint_chess(role_global: &role::Global, global: &mut Global, ctx: &mut TxContext) {
        print(&utf8(b"mint new chess"));
        let sender = tx_context::sender(ctx);
        let game = Chess {
            id: object::new(ctx),
            lineup: lineup::create_lineup(role_global, ctx),
            life: INIT_LIFE,
            won: 0,
            lose: 0,
            creator: sender
        };
        global.total_chesses = global.total_chesses + 1;
        public_transfer(game, sender);
    }

    fun select_lineup(configs: &Table<String, vector<LineUp>>, ctx: &mut TxContext): &LineUp {
        print(&utf8(b"randomly choose a 0-0 opponent"));
        let vec = table::borrow(configs, utf8(b"0-0"));
        vector::borrow(vec, 0)
    }

    public fun match(global: &mut Global, chess:&mut Chess, ctx: &mut TxContext) {
        print(&utf8(b"start match chess"));
        assert!(chess.life > 0, ERR_YOU_ARE_DEAD);

        // match an opponent config
        let lineup = select_lineup(&global.configs, ctx);

        // fight
        fight(chess, lineup);

        // record
        global.total_match = global.total_match + 1;
        print(&utf8(b"match finish"));
    }

    public fun fight(chess: &mut Chess, lineup: &LineUp) {
        let (all_attacks, all_defense) = lineup::get_fight_info(lineup);
        let (my_attacks, my_defense) = lineup::get_fight_info(&chess.lineup);
        if (all_attacks > my_defense) {
            let lose_life = (all_attacks - my_defense);
            chess.life = chess.life - lose_life;
            print(&utf8(b"lose life"));
            print(&lose_life);
            print(&utf8(b"left life"));
            print(&chess.life);
        };
        if (my_attacks > all_defense) {
            print(&utf8(b"I win"));
        } else if (my_attacks == all_defense) {
            print(&utf8(b"even fight"));
        } else {
            print(&utf8(b"I lose"));
        };
    }

    public fun get_total_chesses(global: &Global) : u64 {
        global.total_chesses
    }
     
    public fun get_total_matches(global: &Global) : u64 {
        global.total_match
    }
}