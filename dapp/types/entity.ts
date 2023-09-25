export interface Buff {
    name: string;
    desc: string;
    effect: string;
    effect_value: number;
    left_loop: number;
}

export interface CharacterFieldsV2 {
    attack:  number;
    life: number;
    defense: number;
    magic: number;
    speed: number;
    buffs: Buff[];
    

    // max-life
    max_life?: number;
    max_magic: number;
    level:   number;
    name:    string;
    price:   number;
    sellprice:   number;
    effect_type: string; // 常驻触发，主动释放，被动触发
    effect: string; // 可能有亡语，需要读取释放
    effect_value: string;
    attacking: 0 | 1 | 2;
}