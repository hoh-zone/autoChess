import { useCallback } from "react"
import { enemyCharacterV2, enemyFightingIndex, enemyHpChangeA, fightResultEffectA, fightingIndex, hpChangeA, slotCharacterV2, stageAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { Buff, CharacterFieldsV2 } from "../types/entity";

export const useFightV2 = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacterV2);
    const [chars, setChars] = useAtom(slotCharacterV2);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);

    const get_attack_with_buff = (char: CharacterFieldsV2, consumeBuff:boolean) => {
        let attack = char.attack;
        let buffs = char.buffs;
        let debuffs = char.debuffs;
        let new_buffs:Buff[] = buffs.map((buff)=> {
            if (buff.name == "attack_increase" && buff.left_loop >= 1) {
                let buff_value = buff.effect_value;
                attack += buff_value;
            }
            if (consumeBuff) {
                buff.left_loop -= 1;
            }
            return buff;
        }).filter((ele:Buff) => ele != null && ele.left_loop >= 1);
        const new_debuffs:Buff[] = debuffs.map((debuff)=> {
            if (debuff.name == "attack_decrease" && debuff.left_loop >= 1) {
                let buff_value = debuff.effect_value;
                attack -= buff_value;
            }
            if (consumeBuff) {
                debuff.left_loop -= 1;
            }
            return debuff;
        }).filter((ele:Buff) => ele != null && ele.left_loop >= 1);

        char.buffs = new_buffs;
        char.debuffs = new_debuffs;
        return attack;
    }

    const call_attack = (char: CharacterFieldsV2, enemyChar: CharacterFieldsV2, enemyIndex:number, is_opponent: boolean) => {
        let attack = get_attack_with_buff(char, true);
        console.log("attack:", attack, ":", enemyChar.life);
        enemyChar.life -= attack;
        if (is_opponent) {
            console.log("敌人：", char.name, " 普攻: 攻击", enemyChar.name);
        } else {
            console.log("我军：", char.name, " 普攻: 攻击", enemyChar.name);
        }
        
        died_check(enemyChar, enemyIndex, !is_opponent);
    }

    const add_buff = (char: CharacterFieldsV2, new_buff:Buff) => {
        let buffs = char.buffs;
        let is_contain = false;
        buffs.map((buff) => {
            if (buff.name == new_buff.name) {
                is_contain = true;
                buff.left_loop += 1;
                buff.effect_value = new_buff.effect_value;
            }
        });
        if (!is_contain) {

            buffs.push(new_buff);
        }
        // todo:检查下这个赋值是否多余
        // char.buffs = buffs;
    }

    const call_skill = (char: CharacterFieldsV2, is_opponent:boolean) => {
        let effect = char.effect;
        let value = parseInt(char.effect_value);
        console.log(char.name, " 释放技能:", char.effect);
        if (effect == "aoe") {
            enemyChars.map((ele:CharacterFieldsV2 | null, index:number) => {
                if (ele == null) {
                    return;
                }
                call_attack(char, ele, index, is_opponent);
            })
        } else if (effect = "add_all_tmp_hp") {
            chars.map((ele:CharacterFieldsV2 | null)=>{
                if (ele == null) {
                    return;
                }
                let new_buff = {
                    name:"hp_increase",
                    desc: "HP上升",
                    left_loop: 2,
                    effect: "hp_increase",
                    effect_value: value
                };
                add_buff(ele, new_buff);
            })
        }
    }

    const died_check = (char: CharacterFieldsV2, enemyIndex:number, is_opponent:boolean) => {
        console.log("敌人生命:", char.life);
        if (char.life <= 0) {
            if (is_opponent) {
                console.log("敌人:", char.name, " 死亡");
            } else {
                console.log("我军：", char.name, " 死亡");
            }
            
            if (char.effect == "deathrattle") {
                console.log("deathrattle effect");
            }
            enemyChars[enemyIndex] = null;
        }
    }

    const check_find_alive_char = (char: CharacterFieldsV2) => {
        if (char == null || char.life <= 0) {
            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            return enemyChars[enemyCharIndex];
        } else {
            return char;
        }
    }

    const action = (char:CharacterFieldsV2, enemy:CharacterFieldsV2, enemyIndex:number, is_opponent:boolean) => {
        if (char.magic == char.max_magic) {
            call_skill(char, is_opponent);
        } else {
            call_attack(char, enemy, enemyIndex, is_opponent);
            char.magic = char.magic + 1;
        }
    }

    return useCallback(async () => {
        console.log("--------开始战斗-------");
        console.log(chars);
        while (some(chars, Boolean) && some(enemyChars, Boolean)) {
            // 出战1v1
            const charIndex = chars.findIndex(Boolean);
            setFightingIndex(charIndex);
            let char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            let enemyChar = enemyChars[enemyCharIndex]!;

            // todo:速度相等？ 速度快先出手 
            if (char.speed >= enemyChar.speed) {
                // 释放普攻或者技能
                action(char, enemyChar, enemyCharIndex, false);
                let res = check_find_alive_char(enemyChar);
                if (res == null) {
                    break;
                }
                enemyChar = res;

                // 另一方释放普攻或技能
                action(enemyChar, char, charIndex, true);
            } else {
                action(enemyChar, char, charIndex, true);

                let res = check_find_alive_char(char);
                if (res == null) {
                    break;
                }
                char = res;

                action(char, enemyChar, enemyCharIndex, false);
            }
        }

        if (some(chars, Boolean)) {
            console.log("you win");
        } else {
            console.log("you lose");
        }
    }, []);
}