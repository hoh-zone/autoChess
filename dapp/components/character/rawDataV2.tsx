import { CharacterFieldsV2 } from "../../types/entity";
import { CharacterFields } from "../../types/nft";
import { removeSuffix } from "../../utils/TextUtils";

interface Roles {
    [key: string]: CharacterFieldsV2;
}

const roles_info: Roles = {
    "assa1": {name: "assa1",level: 1,attack:  6, life: 5, magic: 0, base_attack: 6, max_life: 5, max_magic: 3, effect_type: "skill", effect: "attack_lowest_hp", effect_value: "6"},
    "assa1_1": {name: "assa1_1",level: 2,attack:  6, life: 5, magic: 0, base_attack: 6, max_life: 5, max_magic: 3, effect_type: "skill", effect: "attack_lowest_hp", effect_value: "6"},
    "assa2": {name: "assa2",level: 3,attack:  12, life: 10, magic: 0, base_attack: 12, max_life: 10, max_magic: 2, effect_type: "skill", effect: "attack_lowest_hp", effect_value: "12"},
    "assa2_1": {name: "assa2_1",level: 6,attack:  12, life: 10, magic: 0, base_attack: 12, max_life: 10, max_magic: 2, effect_type: "skill", effect: "attack_lowest_hp", effect_value: "12"},
    "assa3": {name: "assa3",level: 9,attack:  24, life: 25, magic: 0, base_attack: 24, max_life: 25, max_magic: 1, effect_type: "skill", effect: "attack_lowest_hp", effect_value: "18"},

    "cleric1": {name: "cleric1",level: 1,attack:  3, life: 5, magic: 0, base_attack: 3, max_life: 5, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_attack", effect_value: "1"},
    "cleric1_1": {name: "cleric1_1",level: 2,attack:  3, life: 5, magic: 0, base_attack: 3, max_life: 5, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_attack", effect_value: "1"},
    "cleric2": {name: "cleric2",level: 3,attack:  6, life: 10, magic: 0, base_attack: 6, max_life: 10, max_magic: 2, effect_type: "skill", effect: "add_all_tmp_attack", effect_value: "2"},
    "cleric2_1": {name: "cleric2_1",level: 6,attack:  6, life: 10, magic: 0, base_attack: 6, max_life: 10, max_magic: 2, effect_type: "skill", effect: "add_all_tmp_attack", effect_value: "2"},
    "cleric3": {name: "cleric3",level: 9,attack:  12, life: 25, magic: 0, base_attack: 12, max_life: 25, max_magic: 1, effect_type: "skill", effect: "add_all_tmp_attack", effect_value: "4"},

    "fighter1": {name: "fighter1",level: 1,attack:  4, life: 6, magic: 0, base_attack: 4, max_life: 6, max_magic: 3, effect_type: "skill", effect: "reduce_all_tmp_attack", effect_value: "2"},
    "fighter1_1": {name: "fighter1_1",level: 2,attack:  4, life: 6, magic: 0, base_attack: 4, max_life: 6, max_magic: 3, effect_type: "skill", effect: "reduce_all_tmp_attack", effect_value: "2"},
    "fighter2": {name: "fighter2",level: 3,attack:  12, life: 12, magic: 0, base_attack: 12, max_life: 12, max_magic: 3, effect_type: "skill", effect: "reduce_all_tmp_attack", effect_value: "4"},
    "fighter2_1": {name: "fighter2_1",level: 6,attack:  12, life: 12, magic: 0, base_attack: 12, max_life: 12, max_magic: 3, effect_type: "skill", effect: "reduce_all_tmp_attack", effect_value: "4"},
    "fighter3": {name: "fighter3",level: 9,attack:  24, life: 30, magic: 0, base_attack: 24, max_life: 30, max_magic: 3, effect_type: "skill", effect: "reduce_all_tmp_attack", effect_value: "8"},

    "golem1": {name: "golem1",level: 1,attack:  4, life: 8, magic: 0, base_attack: 4, max_life: 8, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_magic", effect_value: "1"},
    "golem1_1": {name: "golem1_1",level: 2,attack:  4, life: 8, magic: 0, base_attack: 4, max_life: 8, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_magic", effect_value: "1"},
    "golem2": {name: "golem2",level: 3,attack:  8, life: 16, magic: 0, base_attack: 8, max_life: 16, max_magic: 2, effect_type: "skill", effect: "add_all_tmp_magic", effect_value: "1"},
    "golem2_1": {name: "golem2_1",level: 6,attack:  8, life: 16, magic: 0, base_attack: 8, max_life: 16, max_magic: 2, effect_type: "skill", effect: "add_all_tmp_magic", effect_value: "1"},
    "golem3": {name: "golem3",level: 9,attack:  16, life: 40, magic: 0, base_attack: 16, max_life: 40, max_magic: 1, effect_type: "skill", effect: "add_all_tmp_magic", effect_value: "1"},

    "tank1": {name: "tank1",level: 1,attack:  3, life: 8, magic: 0, base_attack: 3, max_life: 8, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_hp", effect_value: "2"},
    "tank1_1": {name: "tank1_1",level: 2,attack:  3, life: 8, magic: 0, base_attack: 3, max_life: 8, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_hp", effect_value: "2"},
    "tank2": {name: "tank2",level: 3,attack:  6, life: 16, magic: 0, base_attack: 6, max_life: 16, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_hp", effect_value: "4"},
    "tank2_1": {name: "tank2_1",level: 6,attack:  6, life: 16, magic: 0, base_attack: 6, max_life: 16, max_magic: 3, effect_type: "skill", effect: "add_all_tmp_hp", effect_value: "4"},
    "tank3": {name: "tank3",level: 9,attack:  12, life: 40, magic: 0, base_attack: 12, max_life: 40, max_magic: 2, effect_type: "skill", effect: "add_all_tmp_hp", effect_value: "8"},

    "mega1": {name: "mega1",level: 1,attack:  4, life: 7, magic: 0, base_attack: 4, max_life: 7, max_magic: 3, effect_type: "skill", effect: "aoe", effect_value: "4"},
    "mega1_1": {name: "mega1_1",level: 2,attack:  4, life: 7, magic: 0, base_attack: 4, max_life: 7, max_magic: 3, effect_type: "skill", effect: "aoe", effect_value: "4"},
    "mega2": {name: "mega2",level: 3,attack:  8, life: 14, magic: 0, base_attack: 8, max_life: 14, max_magic: 3, effect_type: "skill", effect: "aoe", effect_value: "8"},
    "mega2_1": {name: "mega2_1",level: 3,attack:  8, life: 14, magic: 0, base_attack: 8, max_life: 14, max_magic: 3, effect_type: "skill", effect: "aoe", effect_value: "8"},
    "mega3": {name: "mega3",level: 9,attack:  16, life: 35, magic: 0, base_attack: 16, max_life: 35, max_magic: 2, effect_type: "skill", effect: "aoe", effect_value: "16"},

    "shaman1": {name: "shaman1",level: 1,attack:  5, life: 6, magic: 0, base_attack: 5, max_life: 6, max_magic: 0, effect_type: "ring", effect: "forbid_debuff", effect_value: ""},
    "shaman1_1": {name: "shaman1_1",level: 2,attack:  5, life: 6, magic: 0, base_attack: 5, max_life: 6, max_magic: 0, effect_type: "ring", effect: "forbid_debuff", effect_value: ""},
    "shaman2": {name: "shaman2",level: 3,attack:  10, life: 15, magic: 0, base_attack: 10, max_life: 15, max_magic: 0, effect_type: "ring", effect: "forbid_debuff", effect_value: ""},
    "shaman2_1": {name: "shaman2_1",level: 6,attack:  10, life: 15, magic: 0, base_attack: 10, max_life: 15, max_magic: 0, effect_type: "ring", effect: "forbid_debuff", effect_value: ""},
    "shaman3": {name: "shaman3",level: 9,attack:  20, life: 45, magic: 0, base_attack: 20, max_life: 45, max_magic: 0, effect_type: "ring", effect: "forbid_debuff", effect_value: ""},

    "firemega1": {name: "firemega1",level: 1,attack:  6, life: 5, magic: 0, base_attack: 6, max_life: 5, max_magic: 3, effect_type: "skill", effect: "forbid_debuff", effect_value: ""},
    "firemega1_1": {name: "firemega1_1",level: 2,attack:  6, life: 5, magic: 0, base_attack: 6, max_life: 5, max_magic: 3, effect_type: "skill", effect: "forbid_debuff", effect_value: ""},
    "firemega2": {name: "firemega2",level: 3,attack:  12, life: 10, magic: 0, base_attack: 12, max_life: 10, max_magic: 2, effect_type: "skill", effect: "forbid_debuff", effect_value: ""},
    "firemega2_1": {name: "firemega2_1",level: 6, attack:  12, life: 10, magic: 0, base_attack: 12, max_life: 10, max_magic: 2, effect_type: "skill", effect: "forbid_debuff", effect_value: ""},
    "firemega3": {name: "firemega3",level: 9,attack:  24, life: 25, magic: 0, base_attack: 24, max_life: 25, max_magic: 1, effect_type: "skill", effect: "forbid_debuff", effect_value: ""},

    "slime1": {name: "slime1",level: 1,attack:  6, life: 6, magic: 0, base_attack: 6, max_life: 6, max_magic: 0, effect_type: "ring", effect: "forbid_buff", effect_value: "5"},
    "slime1_1": {name: "slime1_1",level: 2,attack:  6, life: 6, magic: 0, base_attack: 6, max_life: 6, max_magic: 0, effect_type: "ring", effect: "forbid_buff", effect_value: "5"},
    "slime2": {name: "slime2",level: 3,attack:  10, life: 20, magic: 0, base_attack: 10, max_life: 20, max_magic: 0, effect_type: "ring", effect: "forbid_buff", effect_value: "6"},
    "slime2_1": {name: "slime2_1",level: 6,attack:  10, life: 20, magic: 0, base_attack: 10, max_life: 20, max_magic: 0, effect_type: "ring", effect: "forbid_buff", effect_value: "6"},
    "slime3": {name: "slime3",level: 9,attack:  20, life: 45, magic: 0, base_attack: 20, max_life: 45, max_magic: 0, effect_type: "ring", effect: "forbid_buff", effect_value: "10"},
    
    "ani1": {name: "ani1",level: 1,attack:  4, life: 8, magic: 0, base_attack: 4, max_life: 8, max_magic: 3, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "3"},
    "ani1_1": {name: "ani1_1",level: 2,attack:  4, life: 8, magic: 0, base_attack: 4, max_life: 8, max_magic: 3, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "3"},
    "ani2": {name: "ani2",level: 3,attack:  8, life: 16, magic: 0, base_attack: 8, max_life: 16, max_magic: 2, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "6"},
    "ani2_1": {name: "ani2_1",level: 6,attack:  8, life: 16, magic: 0, base_attack: 8, max_life: 16, max_magic: 2, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "6"},
    "ani3": {name: "ani3",level: 9,attack:  16, life: 40, magic: 0, base_attack: 16, max_life: 40, max_magic: 1, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "9"},
    
    "tree1": {name: "tree1",level: 1,attack:  5, life: 7, magic: 0, base_attack: 5, max_life: 7, max_magic: 3, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "3"},
    "tree1_1": {name: "tree1_1",level: 2,attack:  5, life: 7, magic: 0, base_attack: 5, max_life: 7, max_magic: 3, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "3"},
    "tree2": {name: "tree2",level: 3,attack:  10, life: 14, magic: 0, base_attack: 10, max_life: 14, max_magic: 2, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "6"},
    "tree2_1": {name: "tree2_1",level: 6,attack:  10, life: 14, magic: 0, base_attack: 10, max_life: 14, max_magic: 2, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "6"},
    "tree3": {name: "tree3",level: 9,attack:  20, life: 35, magic: 0, base_attack: 20, max_life: 35, max_magic: 1, effect_type: "skill", effect: "reduce_tmp_attack", effect_value: "9"},
    
    "wizard1": {name: "wizard1",level: 1,attack:  5, life: 6, magic: 0, base_attack: 5, max_life: 6, max_magic: 0, effect_type: "ring", effect: "add_all_tmp_max_magic", effect_value: "1"},
    "wizard1_1": {name: "wizard1_1",level: 2,attack:  5, life: 6, magic: 0, base_attack: 5, max_life: 6, max_magic: 0, effect_type: "ring", effect: "add_all_tmp_max_magic", effect_value: "1"},
    "wizard2": {name: "wizard2",level: 3,attack:  10, life: 12, magic: 0, base_attack: 10, max_life: 12, max_magic: 0, effect_type: "ring", effect: "add_all_tmp_max_magic", effect_value: "1"},
    "wizard2_1": {name: "wizard2_1",level: 6,attack:  10, life: 12, magic: 0, base_attack: 10, max_life: 12, max_magic: 0, effect_type: "ring", effect: "add_all_tmp_max_magic", effect_value: "1"},
    "wizard3": {name: "wizard3",level: 9,attack:  20, life: 30, magic: 0, base_attack: 20, max_life: 30, max_magic: 0, effect_type: "ring", effect: "add_all_tmp_max_magic", effect_value: "2"},

    "priest1": {name: "priest1",level: 1,attack:  3, life: 8, magic: 0, base_attack: 3, max_life: 8, max_magic: 3, effect_type: "skill", effect: "all_max_hp_to_back1", effect_value: "6"},
    "priest1_1": {name: "priest1_1",level: 2,attack:  3, life: 8, magic: 0, base_attack: 3, max_life: 8, max_magic: 3, effect_type: "skill", effect: "all_max_hp_to_back1", effect_value: "6"},
    "priest2": {name: "priest2",level: 3,attack:  6, life: 16, magic: 0, base_attack: 6, max_life: 16, max_magic: 3, effect_type: "skill", effect: "all_max_hp_to_back1", effect_value: "8"},
    "priest2_1": {name: "priest2_1",level: 6,attack:  6, life: 16, magic: 0, base_attack: 6, max_life: 16, max_magic: 3, effect_type: "skill", effect: "all_max_hp_to_back1", effect_value: "8"},
    "priest3": {name: "priest3",level: 9,attack:  12, life: 40, magic: 0, base_attack: 12, max_life: 40, max_magic: 2, effect_type: "skill", effect: "all_max_hp_to_back1", effect_value: "12"},

    "shinobi1": {name: "shinobi1",level: 1,attack:  4, life: 8, magic: 0, base_attack: 4, max_life: 8, max_magic: 3, effect_type: "skill", effect: "attack_by_life_percent", effect_value: "1"},
    "shinobi1_1": {name: "shinobi1_1",level: 2,attack:  4, life: 8, magic: 0, base_attack: 4, max_life: 8, max_magic: 3, effect_type: "skill", effect: "attack_by_life_percent", effect_value: "1"},
    "shinobi2": {name: "shinobi2",level: 3,attack:  8, life: 16, magic: 0, base_attack: 8, max_life: 16, max_magic: 2, effect_type: "skill", effect: "attack_by_life_percent", effect_value: "2"},
    "shinobi2_1": {name: "shinobi2_1",level: 6,attack:  8, life: 16, magic: 0, base_attack: 8, max_life: 16, max_magic: 2, effect_type: "skill", effect: "attack_by_life_percent", effect_value: "2"},
    "shinobi3": {name: "shinobi3",level: 9,attack:  16, life: 40, magic: 0, base_attack: 16, max_life: 40, max_magic: 1, effect_type: "skill", effect: "attack_by_life_percent", effect_value: "3"},

    "kunoichi1": {name: "kunoichi1",level: 1,attack:  6, life: 6, magic: 0, base_attack: 6, max_life: 6, max_magic: 2, effect_type: "skill", effect: "attack_sputter_to_second_by_percent", effect_value: "5"},
    "kunoichi1_1": {name: "kunoichi1_1",level: 2,attack:  6, life: 6, magic: 0, base_attack: 6, max_life: 6, max_magic: 2, effect_type: "skill", effect: "attack_sputter_to_second_by_percent", effect_value: "5"},
    "kunoichi2": {name: "kunoichi2",level: 3,attack:  12, life: 12, magic: 0, base_attack: 12, max_life: 12, max_magic: 2, effect_type: "skill", effect: "attack_sputter_to_second_by_percent", effect_value: "5"},
    "kunoichi2_1": {name: "kunoichi2_1",level: 6,attack:  12, life: 12, magic: 0, base_attack: 12, max_life: 12, max_magic: 2, effect_type: "skill", effect: "attack_sputter_to_second_by_percent", effect_value: "5"},
    "kunoichi3": {name: "kunoichi3",level: 9,attack:  24, life: 30, magic: 0, base_attack: 24, max_life: 30, max_magic: 1, effect_type: "skill", effect: "attack_sputter_to_second_by_percent", effect_value: "5"},

    "archer1": {name: "archer1",level: 1,attack:  6, life: 6, magic: 0, base_attack: 6, max_life: 6, max_magic: 3, effect_type: "skill", effect: "attack_last_char", effect_value: "7"},
    "archer1_1": {name: "archer1_1",level: 2,attack:  6, life: 6, magic: 0, base_attack: 6, max_life: 6, max_magic: 3, effect_type: "skill", effect: "attack_last_char", effect_value: "7"},
    "archer2": {name: "archer2",level: 3,attack:  12, life: 12, magic: 0, base_attack: 12, max_life: 12, max_magic: 2, effect_type: "skill", effect: "attack_last_char", effect_value: "14"},
    "archer2_1": {name: "archer2_1",level: 6,attack:  12, life: 12, magic: 0, base_attack: 12, max_life: 12, max_magic: 2, effect_type: "skill", effect: "attack_last_char", effect_value: "14"},
    "archer3": {name: "archer3",level: 9,attack:  24, life: 30, magic: 0, base_attack: 24, max_life: 30, max_magic: 1, effect_type: "skill", effect: "attack_last_char", effect_value: "24"},
}

export function get_chars(names:string[]) : CharacterFieldsV2[] {
    let chars:CharacterFieldsV2[] = [];
    names.map((name) => {
        let role = {...roles_info[name]};
        if (role != null) {
            chars.push(role);
        }
    })
    return chars;
}


export function get_sell_price(char:CharacterFieldsV2 | null): number {
    if (!char) {
        return 0;
    }
    let level = char.level;
    if (level < 3) {
        return 2
    } else if (level < 9) {
        return 6
    } else {
        return 8
    }
}

export function get_star_num(char:CharacterFieldsV2 | null) : number {
    if (!char) {
        return 0;
    }
    let level = char.level;
    if (level >= 6) {
        return level / 3;
    }
    return level / 3 + 1;
}

export function get_base_raw_life(char:CharacterFields | null) : number {
    if (char && char.name) {
        return roles_info[char.name].life;
    } else {
        return 99;
    }
}

export function get_effect(char:CharacterFields | null) : string {
    if (char && char.name) {
        return roles_info[char.name].effect;
    } else {
        return "";
    }
}

export function get_effect_value(char:CharacterFields | null) : string {
    if (char && char.name) {
        return roles_info[char.name].effect_value;
    } else {
        return "";
    }
}

export function upgrade(char1:CharacterFieldsV2, char2:CharacterFieldsV2): CharacterFieldsV2 {
    console.log(char1);
    console.log(char2);
    // 属性受角色战场永久buff效果影响，合成属性会高于基础值
    let level1 = char1.level;
    let name1= char1.name;
    let life1 = char1.life;
    let attack1 = char1.attack;
    let base_life1 = roles_info[name1].max_life;
    let base_attack1 = roles_info[name1].attack;
    let life_buff1 = life1 - base_life1;
    let attack_buff1 = attack1 - base_attack1;

    let level2 = char2.level;
    let name2 = char2.name;
    let life2 = char2.life;
    let attack2 = char2.attack;
    let base_life2 = roles_info[name2].max_life;
    let base_attack2 = roles_info[name2].attack;
    let life_buff2 = life2- base_life2;
    let attack_buff2 = attack2 - base_attack2;

    let life_buff = Math.max(life_buff1, life_buff2);
    let attack_buff = Math.max(attack_buff1, attack_buff2);

    let level = level1 > level2 ? level1 : level2;
    let level_str = "";
    if (level == 1) {
        level_str = "1_1";
    } else if (level == 2) {
        level_str = "2";
    } else if (level == 3) {
        level_str = "2_1";
    } else if (level == 6) {
        level_str = "3";
    }
    let key = removeSuffix(name1) + level_str
    let clone = JSON.stringify(roles_info[key]);
    let res:CharacterFieldsV2 = JSON.parse(clone);
    res.attack = res.attack + attack_buff;
    res.life = res.life + life_buff;
    res.max_life = res.life;
    console.log(res);
    return res;
}