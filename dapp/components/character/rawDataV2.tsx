import { CharacterFieldsV2 } from "../../types/entity";
import { CharacterFields } from "../../types/nft";
import { removeSuffix } from "../../utils/TextUtils";

interface Roles {
    [key: string]: CharacterFieldsV2;
}

const roles_info: Roles = {
    "char1": {name: "char1",level: 1,attack:  2, life: 10,magic: 0, max_life: 10,max_magic: 3,effect_type: "skill", effect: "aoe", effect_value: "2"},
    "char2": {name: "char2",level: 1,attack:  2, life: 10,magic: 0, max_life: 10,max_magic: 3,effect_type: "skill", effect: "aoe", effect_value: "2"},
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