export interface GameNft {
    cards_pool:    CardsPool;
    creator:       string;
    even:          number;
    gold:          string;
    id:            ID;
    hp:          number;
    lineup:        CardsPool;
    win:           number;
    lose:          number;
    challenge_win: number;
    challenge_lose:number;
    name:          string;
    refresh_price: string;
    arena:         boolean;
    arena_checked: boolean;
    hash0: number;
}

export interface CardsPool {
    type:   string;
    fields: CardsPoolFields;
}

export interface CardsPoolFields {
    creator:  string;
    name:     string;
    role_num: string;
    roles:    Role[];
}

export interface Role {
    type:   string;
    fields: CharacterFields;
}

export interface ID {
    id: string;
}

export interface CharacterFields {
    class:    string;
    level:   number;

    attack:  number;
    hp: number;
    sp: number;
    speed: number;

    base_attack: number;
    max_hp: number;
    base_speed: number;
    sp_cap: number | undefined;
    effect_type: string; // 常驻触发，主动释放，被动触发
    effect: string; // 可能有亡语，需要读取释放
    effect_value: string | undefined;
    attacking?: 0 | 1 | 2;
}


//Effect: increase HP, Attack or increase some stats while decreasing some stats
//Range: 1 or 6 (All)
//Duration: One battle or permanent
export interface ItemFields {
    name: string;
    effect: string; 
    range: number;
    duration: string;
    effect_value: number;
    cost: number;
    selling_price: number;
}

// Example:
// {
//     "cards_pool": {
//         "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::lineup::LineUp",
//         "fields": {
//             "creator": "0xb8ff2d5dcaf6fdf2ec111696d2c350a6a4dd07267f5a5ceae644dbbcde6cc1ba",
//             "name": "random cards pool",
//             "role_num": "20",
//             "roles": [
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "4",
//                         "life": "25",
//                         "level": 1,
//                         "name": "warrior1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "2",
//                         "life": "30",
//                         "level": 1,
//                         "name": "priest1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "7",
//                         "life": "15",
//                         "level": 1,
//                         "name": "wizard1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "10",
//                         "life": "20",
//                         "level": 1,
//                         "name": "wizard2",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "2",
//                         "life": "30",
//                         "level": 1,
//                         "name": "priest1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "2",
//                         "life": "30",
//                         "level": 1,
//                         "name": "priest1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "4",
//                         "life": "25",
//                         "level": 1,
//                         "name": "warrior1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "2",
//                         "life": "30",
//                         "level": 1,
//                         "name": "priest1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "4",
//                         "life": "25",
//                         "level": 1,
//                         "name": "warrior1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "7",
//                         "life": "15",
//                         "level": 1,
//                         "name": "wizard1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "5",
//                         "life": "18",
//                         "level": 1,
//                         "name": "assassin1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "4",
//                         "life": "25",
//                         "level": 1,
//                         "name": "warrior1",
//                         "price": 1
//                     }
//                 },
//                 {
//                     "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::role::Role",
//                     "fields": {
//                         "attack": "4",
//                         "life": "25",
//                         "level": 1,
//                         "name": "warrior1",
//                         "price": 1
//                     }
//                 }
//             ]
//         }
//     },
//     "creator": "0xb8ff2d5dcaf6fdf2ec111696d2c350a6a4dd07267f5a5ceae644dbbcde6cc1ba",
//     "even": 0,
//     "gold": "10",
//     "id": {
//         "id": "0xa6db83dc93fcb9f8e3ee47f18d71f816edf7f8f4a137f1e4f6564e2c1cf489a7"
//     },
//     "life": "3",
//     "lineup": {
//         "type": "0xa50dadac76f6e6619dae1bec599d9310fb5d2f03e498b0857bd57de94676ed08::lineup::LineUp",
//         "fields": {
//             "creator": "0xb8ff2d5dcaf6fdf2ec111696d2c350a6a4dd07267f5a5ceae644dbbcde6cc1ba",
//             "name": "",
//             "role_num": "0",
//             "roles": []
//         }
//     },
//     "lose": 0,
//     "name": "",
//     "refresh_price": "3",
//     "win": 0
// }