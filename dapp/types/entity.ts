export interface Buff {
    name: string;
    desc: string;
    effect: string;
    effect_value: number;
    left_loop: number;
}

export interface CharacterFieldsV2 {
    name:    string;
    level:   number;

    attack:  number;
    life: number;
    magic: number;
    buffs: Buff[];
    debuffs: Buff[];


    // max-life
    max_life: number;
    max_magic: number;
    effect_type: string; // 常驻触发，主动释放，被动触发
    effect: string; // 可能有亡语，需要读取释放
    effect_value: string;
}