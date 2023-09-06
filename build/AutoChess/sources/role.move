module auto_chess::role {
    use std::string::{utf8, String};
    use sui::tx_context::{TxContext};
    use std::debug::print;
    
    friend auto_chess::chess;
    friend auto_chess::lineup;


    struct Role has store, copy, drop{
        name:String,
        attack: u64,
        defense: u64
    }

    public(friend) fun create_role(_ctx: &mut TxContext) : Role {
        Role {
            name:utf8(b"checken1"),
            attack: 10,
            defense: 5
        }
    }

    public fun get_attack(role:&Role) : u64 {
        role.attack
    }

    public fun get_defense(role:&Role) : u64 {
        role.defense
    }
}