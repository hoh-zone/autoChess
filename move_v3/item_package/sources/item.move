module item_packagev3::item {
    use std::string::{utf8, String};
    use std::debug::print;
    use std::vector;
    use sui::transfer;

    use sui::tx_context::{TxContext};
    use sui::object::{UID, Self};
    use sui::vec_map::{Self, VecMap};

    use role_packagev3::role::{Self, Role};
    use util_packagev3::utils::{Self};

    struct ItemsGlobal has key {
        id: UID,
        items: VecMap<String, Item>,
    }

    struct Item has store, copy, drop {
        name:String,
        effect: String,
        duration: String,
        range: u8,
        effect_value: u64,
        cost: u8
    }

    public fun init_items(global: &mut ItemsGlobal) {
        vec_map::insert(&mut global.items, utf8(b"rice_ball"), Item{name: utf8(b"rice_ball"), effect: utf8(b"hp"), duration: utf8(b"permanent"), range:1, effect_value:3, cost:2});
        vec_map::insert(&mut global.items, utf8(b"dragon_fruit"), Item{name: utf8(b"dragon_fruit"), effect: utf8(b"attack"), duration: utf8(b"permanent"), range:1, effect_value:3, cost:2});
        vec_map::insert(&mut global.items, utf8(b"boot"), Item{name: utf8(b"boot"), effect: utf8(b"speed"), duration: utf8(b"permanent"), range:1, effect_value:2, cost:2});
        vec_map::insert(&mut global.items, utf8(b"devil_fruit"), Item{name: utf8(b"devil_fruit"), effect: utf8(b"-hp+attack"), duration: utf8(b"permanent"), range: 1, effect_value: 20, cost:2});
        vec_map::insert(&mut global.items, utf8(b"magic_potion"), Item{name: utf8(b"magic_potion"), effect: utf8(b"sp"), duration: utf8(b"once"), range: 1, effect_value:10, cost:2});
        vec_map::insert(&mut global.items, utf8(b"red_potion"), Item{name: utf8(b"red_potion"), effect: utf8(b"hp"), duration: utf8(b"once"), range: 6, effect_value: 3, cost:3});
        vec_map::insert(&mut global.items, utf8(b"purple_potion"), Item{name: utf8(b"purple_potion"), effect: utf8(b"sp"), duration: utf8(b"once"), range: 6, effect_value:1, cost:3});
        vec_map::insert(&mut global.items, utf8(b"whet_stone"), Item{name: utf8(b"whet_stone"), effect: utf8(b"attack"), duration: utf8(b"once"), range: 6, effect_value: 2, cost:3});
        vec_map::insert(&mut global.items, utf8(b"chicken_drumstick"), Item{name: utf8(b"chicken_drumstick"), effect: utf8(b"speed"), duration: utf8(b"once"), range: 6, effect_value: 1, cost:3});
        vec_map::insert(&mut global.items, utf8(b"thick_cloak"), Item{name: utf8(b"thick_cloak"), effect: utf8(b"hp"), duration: utf8(b"permanent"), range: 1, effect_value:5, cost:3});
        vec_map::insert(&mut global.items, utf8(b"chess"), Item{name: utf8(b"chess"), effect: utf8(b"other"), duration: utf8(b"once"), range: 1, effect_value: 0, cost:3});
    }

    fun init(ctx: &mut TxContext) {
        let global = ItemsGlobal {
            id: object::new(ctx),
            items:vec_map::empty<String, Item>()
        };
        init_items(&mut global);
        transfer::share_object(global);
    }


    public fun get_items_keys(global: &ItemsGlobal): vector<String>{
        vec_map::keys(&global.items)
    }

    public fun get_item_by_name(items:&ItemsGlobal, name:&String) : Item {
        //print(&name);
        *vec_map::get(&items.items, name)
    }

    public fun get_item_price(item: &Item): u8
    {
        item.cost
    }

    public fun apply_item_single(role: &mut Role, item: &Item){
        if(item.name == utf8(b"rice_ball"))
            use_rice_ball(role, item)
        else if(item.name == utf8(b"dragon_fruit"))
            use_dragon_fruit(role, item)
        else if(item.name == utf8(b"boot"))
            use_boot(role, item)
        else if(item.name == utf8(b"devil_fruit"))
            use_devil_fruit(role)
        else if(item.name == utf8(b"magic_potion"))
            use_magic_potion(role)
        else if(item.name == utf8(b"thick_cloak"))
            use_thick_cloak(role, item)
    }

    public fun generate_random_items(itemsGlobal: &ItemsGlobal, ctx: &mut TxContext) : vector<String> {
        let vec = vector::empty<String>();
        let max_items = 9;
        let seed = 10;
        while (max_items > 0) {
            seed = seed + 1;
            vector::push_back(&mut vec, create_random_item(itemsGlobal, seed, ctx));
            max_items = max_items - 1;
        };
        vec
    }

    public fun create_random_item(itemsGlobal: &ItemsGlobal, seed:u8, ctx: &mut TxContext) : String {
        let random = utils::get_random_num(0, 10, seed, ctx);
        get_random_item(itemsGlobal, random, ctx)
    }

    fun get_random_item(itemsGlobal: &ItemsGlobal, random: u64, _ctx:&mut TxContext) :String {
        let max_items_size = vec_map::size(&itemsGlobal.items);
        let index = random % max_items_size;
        let (name, _item) = vec_map::get_entry_by_idx(&itemsGlobal.items, index);
        *name
    }

    public fun apply_item_group(roles: &mut vector<Role>, item: &Item){
        if(item.name == utf8(b"red_potion"))
            use_red_potion(roles, item)
        else if(item.name == utf8(b"purple_potion"))
            use_purple_potion(roles, item)
        else if(item.name == utf8(b"whet_stone"))
            use_whet_stone(roles, item)
        else if(item.name == utf8(b"chicken_drumstick"))
            use_chicken_drumstick(roles, item)
     }

     fun use_rice_ball(role: &mut Role, item: &Item){
        role::increase_hp(role, item.effect_value);
     }

     fun use_thick_cloak(role: &mut Role, item: &Item){
        role::increase_hp(role, item.effect_value);
     }

     fun use_dragon_fruit(role: &mut Role, item: &Item){
         role::increase_attack(role, item.effect_value);
     }
     fun use_boot(role: &mut Role, item: &Item){
        role::increase_speed(role, item.effect_value);
     }

    //Figure hard coded
     fun use_devil_fruit(role: &mut Role){
        let increased_value = role::get_attack(role)*20/100;
        let decreased_value = role::get_hp(role)*20/100;
        role::increase_attack(role, increased_value);
        role::decrease_hp(role, decreased_value);
     }

     fun use_magic_potion(role: &mut Role){
        let sp_max = role::get_sp_cap(role);
        role::set_sp(role, sp_max);
     }

     fun use_red_potion(roles: &mut vector<Role>, item: &Item){
        let len = vector::length(roles);
        let i = 0;
        while(i < len){         
            let role = vector::borrow_mut(roles, i);
            role::increase_hp(role, item.effect_value);
            i = i + 1;
        };
     }

     //hard coded to be 1 because its u8
     fun use_purple_potion(roles: &mut vector<Role>, item: &Item){
        let len = vector::length(roles);
        let i = 0;
        while(i < len){         
            let role = vector::borrow_mut(roles, i);
            role::set_sp(role, (item.effect_value as u8));
            i = i + 1;
        };

     }
     fun use_whet_stone(roles: &mut vector<Role>, item: &Item){
        let len = vector::length(roles);
        let i = 0;
        while(i < len){         
            let role = vector::borrow_mut(roles, i);
             role::increase_attack(role, item.effect_value);
            i = i + 1;
        };
     }
     fun use_chicken_drumstick(roles: &mut vector<Role>, item: &Item){
        let len = vector::length(roles);
        let i = 0;
        while(i < len){         
            let role = vector::borrow_mut(roles, i);
            role::increase_speed(role, item.effect_value);
            i = i + 1;
        };
     }

     //need ctx because it needs to use a random number
     /*
     fun use_chess(role: &mut Role, clock:&Clock, roleGlobal: &role::Global,): Role{
        let random = utils::get_random_u8_with_range(1, NUMBER_CHARS, clock);
        let level = role::get_level(role);
        let level_index;
        if(level == 1)
            level_index = 0;
        else if(level == 2)
            level_index = 1;
        else if(level >= 3 && level < 6)
            level_index = 2;
        else if(level >= 9 && level < 9)
            level_index = 3;
        else
            level_index = 4;
        let index = (random-1)*5 + level_index;
        role::get_role_by_index(roleGlobal, index)
     }*/

     ////////////////////////////// Test
    public fun generate_item_global(ctx: &mut TxContext): ItemsGlobal{
        let item_global = ItemsGlobal {
            id: object::new(ctx),
            items: vec_map::empty<String, Item>()
        };
        init_items(&mut item_global);
        item_global
    }

    public fun delete_item_global(item_global:ItemsGlobal){
        let ItemsGlobal{
            id: id1,
            items: _items,         
        } = item_global;
        object::delete(id1);
    }

    public fun print_items_vec_map(current_items: &VecMap<String, u8>){
        let keys = vec_map::keys(current_items);
        let len = vector::length(&keys);
         while (len > 0){
            let item_name = vector::borrow(&keys,len - 1);
            let item_num = vec_map::get(current_items, item_name);
            print(item_name);
            print(item_num);
            len = len - 1;
         };
    }
}
