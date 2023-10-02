import { useCallback } from "react"
import { enemyCharacterV2, enemyFightingIndex, enemyHpChangeA, fightResultEffectA, fightingIndex, hpChangeA, operationsA, slotCharacterV2, stageAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { CharacterFieldsV2 } from "../types/entity";
export const useFightV2 = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacterV2);
    const [chars, setChars] = useAtom(slotCharacterV2);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);
    const [operations, setOperations] = useAtom(operationsA);
    
    const call_attack = (char: CharacterFieldsV2, enemyChar: CharacterFieldsV2, enemyIndex:number, is_opponent: boolean) => {
        let attack = char.attack;
        enemyChar.life -= attack;
        if (is_opponent) {
            console.log("敌人：", char.name, " 普攻: ", attack , "生命:", char.life, " 攻击", enemyChar.name, "攻击后生命:", enemyChar.life);
        } else {
            console.log("我军：", char.name, " 普攻: ", attack , "生命:", char.life, " 攻击", enemyChar.name,  "攻击后生命:", enemyChar.life);
        }
    }

    const get_target_group = (is_opponent:boolean, is_attack:boolean) => {
        if (is_opponent && is_attack) {
            return chars;
        } else if (!is_opponent && is_attack) {
            return enemyChars;
        } else if (is_opponent && !is_attack) {
            return enemyChars;
        } else if (!is_opponent && !is_attack) {
            return chars;
        } else {
            return chars;
        }
    }

    const set_target_group = (group: (CharacterFieldsV2 | null)[],is_opponent:boolean, is_attack:boolean) => {
        if (is_opponent && is_attack) {
            setChars(group);
        } else if (!is_opponent && is_attack) {
            setEnemyChars(enemyChars);
        } else if (is_opponent && !is_attack) {
            setEnemyChars(enemyChars);
        } else if (!is_opponent && !is_attack) {
            setChars(group);
        } else {
            setChars(group);
        }
    }

    const has_effect = (is_opponent:boolean, key:string) => {
        let target_group;
        if (is_opponent) {
            target_group = chars;
        } else {
            target_group = enemyChars;
        }
        for (const character of target_group) {
            if (character != null && character.life > 0) {
                if (character.effect === key) {
                    return true
                }
            }
        }
        return false;
    }

    const find_next_alive_char_index = (is_opponent:boolean) => {
        if (is_opponent) {
            if (enemy_fight_index == enemyChars.length - 1) {
                return null;
            }
            for (let i = enemy_fight_index; i < enemyChars.length; i++) {
                let role = enemyChars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.life > 0) {
                    return i;
                }
            }
        } else {
            if (fight_index == chars.length - 1) {
                return null;
            }
            for (let i = fight_index; i < chars.length; i++) {
                let role = chars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.life > 0) {
                    return i;
                }
            }
        }
    }

    const find_last_one_index = (is_opponent:boolean) => {
        if (is_opponent) {
            for (let i = enemyChars.length - 1; i > 0; i--) {
                let role = enemyChars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.life > 0) {
                    return i;
                }
            }
        } else {
            for (let i = chars.length; i > 0; i--) {
                let role = chars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.life > 0) {
                    return i;
                }
            }
        }
    }

    const call_skill = (char: CharacterFieldsV2, enemy: CharacterFieldsV2, is_opponent:boolean) => {
        let effect = char.effect;
        let value = parseInt(char.effect_value);
        let is_forbid_buff = false;
        let is_forbid_debuff = false;

        let target_group;
        if (is_opponent) {
            target_group = chars;
        } else {
            target_group = enemyChars;
        }
        for (const character of target_group) {
            if (character != null && character.life > 0) {
                if (character.effect === "forbid_buff") {
                    is_forbid_buff = true;
                };
                if (character.effect === "forbid_debuff") {
                    is_forbid_debuff = true;
                };
            }
            if (is_forbid_debuff && is_forbid_buff) {
                break;
            };
        }

        if (is_opponent) {
            console.log("敌人:",char.name, " 释放技能:", char.effect, ":", value);
        } else {
            console.log("我军:", char.name, " 释放技能:", char.effect, ":", value);
        }

        if (effect == "aoe") {
            target_group = get_target_group(is_opponent, true);
            target_group.map((ele:CharacterFieldsV2 | null, index:number) => {
                if (ele == null) {
                    return;
                }
                call_attack(char, ele, index, is_opponent);
            });
            set_target_group(target_group, is_opponent, true);
        } else if (effect == "add_all_tmp_hp") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            target_group = get_target_group(is_opponent, false);
            target_group.map((ele:CharacterFieldsV2 | null, index:number)=>{
                if (ele == null || ele.life <= 0) {
                    return;
                };
                ele.life += value;
            });
            console.log("全体加血:", value);
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "add_all_tmp_attack") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            target_group = get_target_group(is_opponent, false);
            target_group.map((ele:CharacterFieldsV2 | null, index:number)=>{
                if (ele == null) {
                    return;
                }
                ele.attack += value;
            });
            console.log("全体加攻:", value);
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "all_max_hp_to_back1") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            let next_one = find_next_alive_char_index(is_opponent);
            if (next_one == null) {
                return;
            }
            target_group = get_target_group(is_opponent, false);
            target_group[next_one]!.max_life += value;
            target_group[next_one]!.life += value;
            console.log("触发后一个角色永久生命值增加:", value);
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "reduce_all_tmp_attack") {
            if (is_forbid_debuff) {
                console.log("触发特效: 加debuff失败")
                return;
            }
            target_group = get_target_group(is_opponent, true);
            target_group.map((ele:CharacterFieldsV2 | null, index:number)=>{
                if (ele == null) {
                    return;
                }
                ele.attack -= value;
                if (ele.attack <= 0) {
                    ele.attack = 1;
                }
            });
            console.log("全体降攻:", value);
            set_target_group(target_group, is_opponent, true);
        } else if (effect == "attack_sputter_to_second_by_percent") {
            target_group = get_target_group(is_opponent, true);
            let suppter_attack = Math.round(value / 10 * char.attack);
            enemy.life -= char.attack;
            let next_one_index = find_next_alive_char_index(!is_opponent);
            if (next_one_index == null) {
                return;
            }
            target_group[next_one_index]!.life -= suppter_attack;
            console.log("造成溅射伤害:", suppter_attack);
        } else if (effect == "attack_last_char") {
            target_group = get_target_group(is_opponent, true);
            // 如果对手第一个就是最后一个，则基础伤害+效果伤害。
            let last_one_index = find_last_one_index(!is_opponent);
            if (last_one_index == null) {
                return;
            }
            target_group[last_one_index]!.life -= value;
            console.log("攻击最后一名角色:", target_group[last_one_index]?.name, value);
        } else if (effect == "reduce_tmp_attack") {
            if (is_forbid_debuff) {
                console.log("触发特效: 加debuff失败")
                return;
            }
            enemy.attack -= value;
            if (enemy.attack <= 0) {
                enemy.attack = 1;
            }
            console.log("触发单体降攻:", value);
        } else if (effect == "add_all_tmp_magic") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            target_group = get_target_group(is_opponent, false);
            target_group.map((ele:CharacterFieldsV2 | null, index:number)=>{
                if (ele == null || index == fight_index) {
                    return;
                }
                ele.magic += value;
                if (ele.magic >= ele.max_magic) {
                    ele.magic = ele.max_magic;
                }
            });
            console.log("全体加魔法值:", value);
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "attack_lowest_hp") {
            target_group = get_target_group(is_opponent, true);
            let min_hp_index = 0;
            target_group.map((character, index) => {
                if (character == null || character.life == null) {
                    return
                }
                if (min_hp_index < character.life) {
                    min_hp_index = index;
                }
            });
            console.log("目标：", target_group[min_hp_index]?.name, " 攻击前生命:", target_group[min_hp_index]?.life);
            if (target_group[min_hp_index] != null) {
                target_group[min_hp_index]!.life = target_group[min_hp_index]!.life - value < 0? 0 : target_group[min_hp_index]!.life - value;
                if (target_group[min_hp_index]!.life == 0) {
                    console.log("对方死亡");
                    target_group[min_hp_index] = null
                }
            }
            set_target_group(target_group, is_opponent, true);
        } else if (effect == "attack_by_life_percent") {
            target_group = get_target_group(is_opponent, true);
            let life = enemy.max_life;
            let extra_attack = Math.round(value / 10 * life);
            enemy.life -= (char.attack + extra_attack);
            console.log("造成额外百分比伤害:", char.attack, " + ", extra_attack);
        }
    }

    const died_check = (charactors: (CharacterFieldsV2 | null)[], is_opponent:boolean) => {
        if (charactors == null) {
            return;
        }
        charactors.map((ele, index)=>{
            if (ele == null) {
                return;
            }
            if (ele.life <= 0) {
                if (is_opponent) {
                    console.log("敌人:", ele.name, " 死亡");
                    enemyChars[index] = null
                } else {
                    console.log("我军：", ele.name, " 死亡");
                    chars[index] = null
                }
            }
        })
    }

    const get_extra_max_magic_debuff = (is_opponent:boolean) => {
        let value = 0;
        if (is_opponent) {
            chars.map((ele)=> {
                if (ele == null) {
                    return;
                }
                if (ele.effect === "add_all_tmp_max_magic") {
                    value = parseInt(ele.effect_value) > value ? parseInt(ele.effect_value) : value;
                }
             })
        } else {
            enemyChars.map((ele)=> {
                if (ele == null) {
                    return;
                }
                if (ele.effect === "add_all_tmp_max_magic") {
                    value = parseInt(ele.effect_value) > value ? parseInt(ele.effect_value) : value;
                }
             })
        }
        if (is_opponent && value > 0) {
            console.log("敌人:最大魔法值+", value);
        } 
        if (!is_opponent && value > 0){
            console.log("我军:最大魔法值+", value);
        }
        return value;
    }

    const action = (char:CharacterFieldsV2, enemy:CharacterFieldsV2, enemyIndex:number, is_opponent:boolean) => {
        let extra_max_magic_debuff = get_extra_max_magic_debuff(is_opponent);
        if (char.magic >= (char.max_magic + extra_max_magic_debuff) && char.effect_type === "skill") {
            call_skill(char, enemy, is_opponent);
            char.magic = 0;
        } else {
            call_attack(char, enemy, enemyIndex, is_opponent);
            char.magic = char.magic + 1;
        }
    }

    const reset_status = () => {
        chars.map((chr, index)=> {
            if (chr == null) {
                return;
            }
            chars[index]!.life = chr.max_life;
            chars[index]!.attack = chr.base_attack;
            chars[index]!.magic = 0;
        })
        enemyChars.map((chr, index)=> {
            if (chr == null) {
                return;
            }
            enemyChars[index]!.life = chr.max_life;
            enemyChars[index]!.attack = chr.base_attack;
            enemyChars[index]!.magic = 0;
        })
        setOperations([]);
        operations.push(chars.toString());
    }

    return useCallback(async () => {
        console.log("--------开始战斗-------");
        console.log(chars);
        let loop = 10;
        while (some(chars, Boolean) && some(enemyChars, Boolean)) {
            // 出战1v1
            const charIndex = chars.findIndex(Boolean);
            setFightingIndex(charIndex);
            let char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            let enemyChar = enemyChars[enemyCharIndex]!;

            // 同时攻击
            let max_loop = 20;
            while (char.life > 0 && enemyChar.life > 0) {
                action(char, enemyChar, enemyCharIndex, false);
                action(enemyChar, char, charIndex, true);
    
                died_check(chars, false);
                died_check(enemyChars, true);
                max_loop -= 1;
                if (max_loop == 0) {
                    console.log("异常循环保护");
                    break;
                }
            }
            loop -= 1;
            if (loop == 0) {
                console.log("外部异常循环保护");
                break;
            }
        }

        if (some(chars, Boolean)) {
            console.log("you win");
        } else {
            console.log("you lose");
        }
        reset_status();
    }, []);
}