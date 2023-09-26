import { CharacterFieldsV2 } from "../../types/entity";
import { CharacterFields } from "../../types/nft";
import { removeSuffix } from "../../utils/TextUtils";

interface Roles {
    [key: string]: CharacterFieldsV2;
}

const roles_info: Roles = {
    "char1": {
        name: "char1",
        level: 1,

        attack:  2,
        defense: 2,
        life: 10,
        magic: 0,
        speed: 5,
        buffs: [],
        debuffs: [],

        // max-life
        max_life: 10,
        max_magic: 3,
        effect_type: "skill", // 常驻触发，主动释放，被动触发
        effect: "aoe", // 可能有亡语，需要读取释放
        effect_value: "2",
    },
    "char2": {
        name: "char2",
        level: 1,

        attack:  2,
        defense: 2,
        life: 10,
        magic: 0,
        speed: 5,
        buffs: [],
        debuffs: [],

        // max-life
        max_life: 10,
        max_magic: 3,
        effect_type: "skill", // 常驻触发，主动释放，被动触发
        effect: "add_all_tmp_hp", // 可能有亡语，需要读取释放
        effect_value: "2",
    },
    "char3": {
        name: "char3",
        level: 3,

        attack:  2,
        defense: 2,
        life: 10,
        magic: 0,
        speed: 5,
        buffs: [],
        debuffs: [],

        // max-life
        max_life: 10,
        max_magic: 3,
        effect_type: "skill", // 常驻触发，主动释放，被动触发
        effect: "aoe", // 可能有亡语，需要读取释放
        effect_value: "3",
    }
}

export function get_chars(names:string[]) : CharacterFieldsV2[] {
    let chars:CharacterFieldsV2[] = [];
    names.map((name) => {
        let role = roles_info[name];
        if (role != null) {
            chars.push(role);
        }
    })
    return chars;
}