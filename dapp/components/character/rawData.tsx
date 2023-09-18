import { CharacterFields } from "../../types/nft";
import { removeSuffix } from "../../utils/TextUtils";

interface Roles {
    [key: string]: CharacterFields;
}

const roles_info: Roles = {
    "ani1": {name:"ani1", attack:6, life:4, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "ani1_1": {name:"ani1_1",attack:6, life:4, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "ani2": {name:"ani2",attack:12, life:8, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "ani2_1": {name:"ani2_1", attack:12, life:8, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "ani3": {name:"ani3", attack:20, life:20, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "archer1": {name:"archer1", attack:6, life:4, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "archer1_1": {name:"archer1_1", attack:6, life:4, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "archer2": {name:"archer2", attack:10, life:8, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "archer2_1": {name:"archer2_1", attack:10, life:8, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "archer3": {name:"archer3", attack:18, life:22, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "assa1": {name:"assa1", attack:7, life:4, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "assa1_1": {name:"assa1_1", attack:7, life: 4, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "assa2": {name:"assa2", attack:13, life:9, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "assa2_1": {name:"assa2_1", attack:13, life:9, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "assa3": {name:"assa3", attack:23, life:13, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "kunoichi1": {name:"kunoichi1", attack:5, life:5, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "kunoichi1_1": {name:"kunoichi1_1", attack:5, life:5, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "kunoichi2": {name:"kunoichi2", attack:10, life:10, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "kunoichi2_1": {name:"kunoichi2_1", attack:10, life:10, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "kunoichi3": {name:"kunoichi3", attack:20, life:23, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "shinobi1": {name:"shinobi1", attack:4, life:7, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "shinobi1_1": {name:"shinobi1_1", attack:4, life:7, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "shinobi2": {name:"shinobi2", attack:8, life:14, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "shinobi2_1": {name:"shinobi2_1", attack:8, life:14, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "shinobi3": {name:"shinobi3", attack:14, life:27, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "mega1": {name:"mega1", attack:6, life:5, level:1, price:3, sellprice:2, attacking:0 ,effect:"aoe", effect_value:"2"},
    "mega1_1": {name:"mega1_1", attack:6, life:5, level:2, price:3, sellprice:2, attacking:0 ,effect:"aoe", effect_value:"2"},
    "mega2": {name:"mega2", attack:12, life:10, level:3, price:7, sellprice:6, attacking:0 ,effect:"aoe", effect_value:"4"},
    "mega2_1": {name:"mega2_1", attack:12, life:10, level:6, price:7, sellprice:6, attacking:0 ,effect:"aoe", effect_value:"4"},
    "mega3": {name:"mega3", attack:24, life:20, level:9, price:9, sellprice:8, attacking:0 ,effect:"aoe", effect_value:"6"},

    "shaman1": {name:"shaman1", attack:6, life:5, level:1, price:3, sellprice:2, attacking:0 ,effect:"forbid_buff", effect_value:""},
    "shaman1_1": {name:"shaman1_1", attack:6, life:5, level:2, price:3, sellprice:2, attacking:0 ,effect:"forbid_buff", effect_value:""},
    "shaman2": {name:"shaman2", attack:12, life:11, level:3, price:7, sellprice:6, attacking:0 ,effect:"forbid_buff", effect_value:""},
    "shaman2_1": {name:"shaman2_1", attack:12, life:11, level:6, price:7, sellprice:6, attacking:0 ,effect:"forbid_buff", effect_value:""},
    "shaman3": {name:"shaman3", attack:22, life:22, level:9, price:9, sellprice:8, attacking:0 ,effect:"forbid_buff", effect_value:""},

    "firemega1": {name:"firemega1", attack:7, life:4, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "firemega1_1": {name:"firemega1_1", attack:7, life:4, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "firemega2": {name:"firemega2", attack:10, life:10, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "firemega2_1": {name:"firemega2_1", attack:10, life:10, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "firemega3": {name:"firemega3", attack:18, life:25, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "wizard1": {name:"wizard1", attack:4, life:9, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "wizard1_1": {name:"wizard1_1", attack:4, life:9, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "wizard2": {name:"wizard2", attack:8, life:13, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "wizard2_1": {name:"wizard2_1", attack:8, life:13, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "wizard3": {name:"wizard3", attack:10, life:40, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "cleric1": {name:"cleric1", attack:3, life:8, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "cleric1_1": {name:"cleric1_1", attack:3, life:8, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "cleric2": {name:"cleric2", attack:6, life:18, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "cleric2_1": {name:"cleric2_1", attack:6, life:18, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "cleric3": {name:"cleric3", attack:15, life:45, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "fighter1": {name:"fighter1", attack:5, life:5, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "fighter1_1": {name:"fighter1_1", attack:5, life:5, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "fighter2": {name:"fighter2", attack:10, life:10, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "fighter2_1": {name:"fighter2_1", attack:10, life:10, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "fighter3": {name:"fighter3", attack:25, life:25, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "golem1": {name:"golem1", attack:4, life:7, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "golem1_1": {name:"golem1_1", attack:4, life:7, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "golem2": {name:"golem2", attack:8, life:16, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "golem2_1": {name:"golem2_1", attack:8, life:16, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "golem3": {name:"golem3", attack:19, life:40, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "slime1": {name:"slime1", attack:5, life:6, level:1, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "slime1_1": {name:"slime1_1", attack:5, life:6, level:2, price:3, sellprice:2, attacking:0 ,effect:"", effect_value:""},
    "slime2": {name:"slime2", attack:8, life:15, level:3, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "slime2_1": {name:"slime2_1", attack:8, life:15, level:6, price:7, sellprice:6, attacking:0 ,effect:"", effect_value:""},
    "slime3": {name:"slime3", attack:24, life:26, level:9, price:9, sellprice:8, attacking:0 ,effect:"", effect_value:""},

    "tank1": {name:"tank1", attack:3, life:8, level:1, price:3, sellprice:2, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"1"},
    "tank1_1": {name:"tank1_1", attack:3, life:8, level:2, price:3, sellprice:2, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"1"},
    "tank2": {name:"tank2", attack:5, life:22, level:3, price:7, sellprice:6, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"2"},
    "tank2_1": {name:"tank2_1", attack:5, life:22, level:6, price:7, sellprice:6, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"2"},
    "tank3": {name:"tank3", attack:10, life:44, level:9, price:9, sellprice:8, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"3"},

    "priest1": {name:"priest1", attack:3, life:10, level:1, price:3, sellprice:2, attacking:0 ,effect:"add_all_hp", effect_value:"1"},
    "priest1_1": {name:"priest1_1", attack:3, life:10, level:2, price:4, sellprice:3, attacking:0 ,effect:"add_all_hp", effect_value:"1"},
    "priest2": {name:"priest2", attack:5, life:23, level:3, price:7, sellprice:6, attacking:0 ,effect:"add_all_hp", effect_value:"2"},
    "priest2_1": {name:"priest2_1", attack:5, life:23, level:6, price:7, sellprice:6, attacking:0 ,effect:"add_all_hp", effect_value:"2"},
    "priest3": {name:"priest3", attack:8, life:40, level:9, price:9, sellprice:8, attacking:0 ,effect:"add_all_hp", effect_value:"3"},

    "tree1": {name:"tree1", attack:3, life:8, level:1, price:3, sellprice:2, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"3"},
    "tree1_1": {name:"tree1_1", attack:3, life:8, level:2, price:3, sellprice:2, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"3"},
    "tree2": {name:"tree2", attack:5, life:18, level:3, price:7, sellprice:6, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"6"},
    "tree2_1": {name:"tree2_1", attack:5, life:18, level:6, price:7, sellprice:6, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"6"},
    "tree3": {name:"tree3", attack:12, life:40, level:9, price:9, sellprice: 8, attacking:0 ,effect:"add_all_tmp_hp", effect_value:"12"},
}

export function get_sell_price(name:string | undefined): number {
    if (name) {
        return roles_info[name].sellprice;
    } else {
        return 2;
    }
}

export function get_star_num(char:CharacterFields | null) : number {
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

export function upgrade(char:CharacterFields): CharacterFields {
    // 属性受角色战场永久buff效果影响，合成属性会高于基础值
    let level_str = "";
    let level = char.level;
    let name = char.name;
    let life = char.life;
    let base_life = roles_info[name].life;
    let life_buff = life - base_life;
    if (level == 1) {
        level_str = "1_1";
    } else if (level == 2) {
        level_str = "2";
    } else if (level == 3) {
        level_str = "2_1";
    } else if (level == 6) {
        level_str = "3";
    }
    let key = removeSuffix(name) + level_str
    let clone = JSON.stringify(roles_info[key]);
    let res:CharacterFields = JSON.parse(clone);
    res.life = res.life + life_buff;
    res.base_life = res.life;
    return res;
}