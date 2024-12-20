module util_packagev3::utils {
    use std::string::{Self, utf8, String};
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self};
    use sui::hash;
    use std::vector;
    use sui::bcs;
    use std::debug::print;

    const AMOUNT_DECIMAL:u64 = 1_000_000_000;
    const ERR_EXCEED_VEC_LENGTH:u64 = 0x001;

    struct Int_wrapper has copy, drop, store {
        value: u64
    }
 
    public fun generate_wrapper_with_value(value:u64): Int_wrapper{
        Int_wrapper{
            value
        }
    }


    public fun get_int(wrapper:&Int_wrapper): u64 {
        wrapper.value
    }

    public fun set_int(wrapper:&mut Int_wrapper, updated_value:u64){
        wrapper.value = updated_value;
    }

    public fun u8_to_string(num: u8) : String {
        let vec = vector::empty<u8>();
        let cur;
        cur = num % 10;
        vector::insert(&mut vec, cur + 48, 0);
        num = num / 10;
        while(num > 0){
            cur = num % 10;
            vector::insert(&mut vec, cur + 48, 0);
            num = num / 10;
        };
        string::utf8(vec)
    }

    // example: passed in a string 3-5, the function returns (3,5)
    //if the string is like 3 or 3 withou - then from_index is the number, to_index is 0
    public fun get_left_right_number(input:String) : (u64, u64) {
        let comma_index = string::index_of(&input, &utf8(b"-"));
        let from_index = utf8_to_u64(string::sub_string(&input, 0, comma_index));
        if(comma_index == string::length(&input)) return (from_index, 0);
        let to_index = utf8_to_u64(string::sub_string(&input, comma_index + 1, string::length(&input)));
        (from_index, to_index)
    }

    public fun  get_left_string_right_number(input:&String) : (String, u64) {
        let comma_index = string::index_of(input, &utf8(b"-"));
        let from_string = string::sub_string(input, 0, comma_index);
        if(comma_index == string::length(input)) return (from_string, 0);
        let to_index = utf8_to_u64(string::sub_string(input, comma_index + 1, string::length(input)));
        (from_string, to_index)
    }

    public fun utf8_to_u64(str: String): u64 {
        let bytes = *string::bytes(&str);
        let len = vector::length(&bytes);
        let i = 0;
        let res = 0;
        while (i < len) {
            assert!(vector::length(&bytes) > i, ERR_EXCEED_VEC_LENGTH);
            res = res * 10 + ((*vector::borrow(&bytes, i) as u64) - 48);
            i = i + 1;
        };
        res
    }

    public fun u64_to_string(num: u64) : String {
        let vec = vector::empty<u8>();
        let cur;
        cur = num % 10;
        vector::insert(&mut vec, (cur as u8) + 48, 0);
        num = num / 10;
        while(num > 0){
            cur = num % 10;
            vector::insert(&mut vec, (cur as u8) + 48, 0);
            num = num / 10;
        };
        string::utf8(vec)
    }

    public fun get_random_num(min:u64, max:u64, seed_u:u8, ctx:&mut TxContext) :u64 {
        (min + tx_bytes_to_u64(seed(ctx, seed_u))) % (max + 1)
    }

    fun tx_bytes_to_u64(bytes: vector<u8>): u64 {
        let value = 0u64;
        let i = 0u64;
        while (i < 8) {
            assert!(vector::length(&bytes) > i, ERR_EXCEED_VEC_LENGTH);
            value = value | ((*vector::borrow(&bytes, i) as u64) << ((8 * (7 - i)) as u8));
            i = i + 1;
        };
        return value
    }

    public fun print2(str1:String, str2:String) {
        string::append(&mut str1, str2);
        print(&str1);
    }

    // use context to generate the random seed
    public fun seed(ctx: &mut TxContext, seed_u:u8): vector<u8> {
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
            11 * power
        }
    }

    // 0-1000 represents prop
    public fun get_lineup_level2_prop_by_lineup_power(power:u64): u64 {
        35 * power
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

    public fun numbers_to_ascii_vector(val: u64): vector<u8> {
        let vec = vector<u8>[];
        loop {
            let b = val % 10;
            vector::push_back(&mut vec, (48 + b as u8));
            val = val / 10;
            if (val <= 0) break;
        };
        vector::reverse(&mut vec);
        vec
    }

    public fun removeSuffix(class:String) : String {
        // ani1 -> ani
        if (string::index_of(&class, &utf8(b"3")) < string::length(&class)) {
            return string::sub_string(&class, 0, string::index_of(&class, &utf8(b"3")))
        } else if (string::index_of(&class, &utf8(b"2_1")) < string::length(&class)) {
            return string::sub_string(&class, 0, string::index_of(&class, &utf8(b"2_1")))
        } else if (string::index_of(&class, &utf8(b"2")) < string::length(&class)) {
            return string::sub_string(&class, 0, string::index_of(&class, &utf8(b"2")))
        } else if (string::index_of(&class, &utf8(b"1_1")) < string::length(&class)) {
            return string::sub_string(&class, 0, string::index_of(&class, &utf8(b"1_1")))
        } else if (string::index_of(&class, &utf8(b"1")) < string::length(&class)) {
            return string::sub_string(&class, 0, string::index_of(&class, &utf8(b"1")))
        } else {
            return class
        }
    }

    public fun check_ticket_gold_cost(value: u64) : bool {
        ((value == 1 * AMOUNT_DECIMAL) || (value == 5 * AMOUNT_DECIMAL) || (value == 10 * AMOUNT_DECIMAL) || (value == 100 * AMOUNT_DECIMAL) || (value == 500 * AMOUNT_DECIMAL))
    }

    public fun get_class_by_level(base_class:String, level:u8) : String {
        let class = *&base_class;
        let level_str;
        if (level == 1) {
            level_str = utf8(b"1");
        } else if (level == 2) {
            level_str = utf8(b"1_1");
        } else if (level >= 3 && level <= 5) {
            level_str = utf8(b"2");
        } else if (level >= 6 && level <= 8) {
            level_str = utf8(b"2_1");
        } else {
            level_str = utf8(b"3");
        };
        string::append(&mut class, level_str);
        class
    }

    public fun estimate_reward(total_amount:u64, gold_cost:u64, win:u8) : u64 {
        let base_gold_cost = (win as u64) * gold_cost * 3 / 10;
        let max_reward = total_amount * 9 / 10;
        if (base_gold_cost > max_reward) {
            base_gold_cost = max_reward;
        };
        base_gold_cost
    }
}