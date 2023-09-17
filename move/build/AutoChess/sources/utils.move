module auto_chess::utils {
    use std::string::{Self, utf8, String};
    use sui::tx_context::{Self, TxContext};
    use sui::object::{UID, Self};
    use sui::transfer::{Self};
    use sui::hash;
    use std::vector;
    use sui::bcs;
    use std::debug::print;

    public fun u8_to_string(num: u8) : String {
        let vec = vector::empty<u8>();
        vector::push_back(&mut vec, num + 48);
        string::utf8(vec)
    }

    public fun utf8_to_u64(str: String): u64 {
        let bytes = *string::bytes(&str);
        let len = vector::length(&bytes);
        let i = 0;
        let res = 0;
        while (i < len) {
            res = res + i * 10 + ((*vector::borrow(&bytes, i) as u64) - 48);
            i = i + 1;
        };
        res
    }

    public fun u64_to_string(num: u64) : String {
        let vec = vector::empty<u8>();
        vector::push_back(&mut vec, (num as u8) + 48);
        string::utf8(vec)
    }

    public fun get_random_num(min:u64, max:u64, seed_u:u8, ctx:&mut TxContext) :u64 {
        (min + tx_bytes_to_u64(seed(ctx, seed_u))) % (max + 1)
    }

    fun tx_bytes_to_u64(bytes: vector<u8>): u64 {
        let value = 0u64;
        let i = 0u64;
        while (i < 8) {
            value = value | ((*vector::borrow(&bytes, i) as u64) << ((8 * (7 - i)) as u8));
            i = i + 1;
        };
        return value
    }

    public fun print2(str1:String, str2:String) {
        string::append(&mut str1, str2);
        print(&str1);
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

    public fun get_role_num_by_lineup_power(power:u64):u64 {
        if (power >= 6) {
            6
        } else if (power >= 4) {
            5
        } else if (power >= 3) {
            4
        } else {
            3
        }
    }

    public fun get_lineup_power_by_tag(win:u8, lose:u8): u64 {
        ((2 + win * 2 - lose) as u64)
    }

    // 0-1000 represents prop
    public fun get_lineup_level3_prop_by_lineup_power(power:u64): u64 {
        if (power <= 16) {
            0
        } else {
            3 * power
        }
    }

    // 0-1000 represents prop
    public fun get_lineup_level2_prop_by_lineup_power(power:u64): u64 {
        40 * power
    }

    // 0-1000 represents prop
    public fun get_cards_level2_prop_by_lineup_power(power:u64): u64 {
        25 * power
    }

    public fun get_pool_tag(win:u8, lose:u8) : String {
        let tag = u8_to_string(win);
        string::append(&mut tag, string::utf8(b"-"));
        string::append(&mut tag, u8_to_string(lose));
        tag
    }
}