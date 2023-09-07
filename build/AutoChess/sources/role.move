module auto_chess::role {
    use std::string::{Self, utf8, String};
    use sui::tx_context::{Self, TxContext};
    use std::debug::print;
    use sui::table::{Self, Table};
    use sui::object::{UID, Self};
    use sui::transfer::{Self};
    use sui::hash;
    use std::vector;
    use sui::bcs;

    friend auto_chess::chess;
    friend auto_chess::lineup;

    struct Global has key {
        id: UID,
        charactors: Table<String, Role>
    }

    struct Role has store, copy, drop {
        name:String,
        attack: u64,
        defense: u64
    }

    fun init(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: table::new<String, Role>(ctx)
        };
        transfer::share_object(global);
    }

    #[test_only]
    public fun init_for_test(ctx: &mut TxContext) {
        let global = Global {
            id: object::new(ctx),
            charactors: table::new<String, Role>(ctx)
        };
        transfer::share_object(global);
    }

    public fun init_charactos(global: &mut Global) {
        table::add(&mut global.charactors, utf8(b"warrior1"), Role {name:utf8(b"warrior1"), attack:4, defense:25});
        table::add(&mut global.charactors, utf8(b"warrior2"), Role {name:utf8(b"warrior2"), attack:6, defense:30});
        table::add(&mut global.charactors, utf8(b"warrior3"), Role {name:utf8(b"warrior3"), attack:8, defense:40});
        table::add(&mut global.charactors, utf8(b"wizard1"), Role {name:utf8(b"wizard1"), attack:7, defense:15});
        table::add(&mut global.charactors, utf8(b"wizard2"), Role {name:utf8(b"wizard2"), attack:10, defense:20});
        table::add(&mut global.charactors, utf8(b"wizard3"), Role {name:utf8(b"wizard3"), attack:14, defense:25});
        table::add(&mut global.charactors, utf8(b"priest1"), Role {name:utf8(b"priest1"), attack:2, defense:30});
        table::add(&mut global.charactors, utf8(b"priest2"), Role {name:utf8(b"priest2"), attack:4, defense:45});
        table::add(&mut global.charactors, utf8(b"priest3"), Role {name:utf8(b"priest3"), attack:6, defense:60});
        table::add(&mut global.charactors, utf8(b"assassin1"), Role {name:utf8(b"assassin1"), attack:5, defense:18});
        table::add(&mut global.charactors, utf8(b"assassin2"), Role {name:utf8(b"assassin2"), attack:7, defense:25});
        table::add(&mut global.charactors, utf8(b"assassin3"), Role {name:utf8(b"assassin3"), attack:9, defense:30});
    }

    public fun get_random_num(min:u64, max:u64, seed_u:u8, ctx:&mut TxContext) :u64 {
        (min + bytes_to_u64(seed(ctx, seed_u))) % (max + 1)
    }

    fun bytes_to_u64(bytes: vector<u8>): u64 {
        let value = 0u64;
        let i = 0u64;
        while (i < 8) {
            value = value | ((*vector::borrow(&bytes, i) as u64) << ((8 * (7 - i)) as u8));
            i = i + 1;
        };
        return value
    }

    fun seed(ctx: &mut TxContext, seed_u:u8): vector<u8> {
        let ctx_bytes = bcs::to_bytes(ctx);
        let seed_vec = vector::empty();
        vector::push_back(&mut seed_vec, seed_u);
        let uid = object::new(ctx);
        let uid_bytes: vector<u8> = object::uid_to_bytes(&uid);
        object::delete(uid);
        let info: vector<u8> = vector::empty<u8>();
        vector::append<u8>(&mut info, ctx_bytes);
        vector::append<u8>(&mut info, seed_vec);
        vector::append<u8>(&mut info, uid_bytes);
        vector::append<u8>(&mut info, bcs::to_bytes(&tx_context::epoch_timestamp_ms(ctx)));
        let hash: vector<u8> = hash::keccak256(&info);
        hash
    }

    public(friend) fun create_role(global: &Global, _ctx: &mut TxContext) : Role {
        let role = table::borrow(&global.charactors, utf8(b"warrior1"));
        Role {
            name: utf8(b"warrior1"),
            attack: 1,
            defense: 2
        }
    }

    public fun get_attack(role:&Role) : u64 {
        role.attack
    }

    public fun get_defense(role:&Role) : u64 {
        role.defense
    }
}