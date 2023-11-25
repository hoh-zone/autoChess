module auto_chess::challenge {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self, public_transfer};
    use std::string::{utf8, String, Self};
    use auto_chess::lineup::{Self, LineUp};
    use sui::balance::{Self, Balance};
    use sui::pay;
    use std::vector;
    use std::ascii;
    use sui::address;
    use sui::coin;
    use std::debug::print;
    use sui::event;
    use sui::table::{Self, Table};
    use auto_chess::role;
    use sui::sui::SUI;
    friend auto_chess::chess;

    const ERR_EXCEED_LIMIT_NUMBER:u64 = 0x01;

    struct Global has key {
        id: UID,
        balance_SUI: Balance<SUI>,
        rank_20: vector<LineUp>
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            balance_SUI: balance::zero(),
            rank_20: vector::empty<LineUp>()
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            balance_SUI: balance::zero(),
            rank_20: vector::empty<LineUp>()
        };
        transfer::share_object(global);
    }

    public(friend) fun get_linup_by_rank(global: &Global, rank:u8): LineUp {
        *vector::borrow(&global.rank_20, (rank as u64))
    }

    public(friend) fun rank_forward(global: &mut Global, lineup:LineUp, rank:u8) {
        // 1 -> 20; 2 -> 19;
        vector::insert(&mut global.rank_20, lineup, (rank as u64));
        vector::pop_back(&mut global.rank_20);
    }

    public fun init_rank_20(global: &mut Global, roleGlobal: &role::Global, ctx: &mut TxContext) {
        let i = 0;
        let init_power = 40;
        let seed:u8 = 1;
        while (i < 20) {
            let lineup = lineup::generate_lineup_by_power(roleGlobal, init_power, seed, ctx);
            vector::push_back(&mut global.rank_20, lineup);
            init_power = init_power + 2;
            seed = seed + 1;
            i = i + 1;
            print(&1);
        };
    }

    public entry fun query_rank_20(global:&Global): String {
        let byte_comma = ascii::byte(ascii::char(44));
        let byte_semi = ascii::byte(ascii::char(59));
        let len = vector::length(&global.rank_20);
        let i = 0;
        let vec_out:vector<u8> = vector::empty<u8>();
        while (i < len) {
            let lineup = vector::borrow(&global.rank_20, i);
            let addr = lineup::get_creator(lineup);
            let addr_str = address::to_string(addr);
            let name = lineup::get_name(lineup);
            vector::append(&mut vec_out, *string::bytes(&addr_str));
            vector::push_back(&mut vec_out, byte_comma);
            vector::append(&mut vec_out, *string::bytes(&name));
            vector::push_back(&mut vec_out, byte_semi);
            i = i + 1;
        };
        utf8(vec_out)
    }
}