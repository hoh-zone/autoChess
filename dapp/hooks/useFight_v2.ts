import { useCallback } from "react"
import { enemyCharacterV2, enemyFightingIndex, enemyHpChangeA, fightResultEffectA, fightingIndex, hpChangeA, slotCharacterV2, stageAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { Buff, CharacterFieldsV2 } from "../types/entity";

export const useFight = () => {
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

    const call_attack = (char: CharacterFieldsV2, enemyChar: CharacterFieldsV2, enemyIndex:number) => {
        let attack = get_attack_with_buff(char, true);
        enemyChar.life -= attack;
        died_check(enemyChar, enemyIndex);
    }

    const call_skill = (char: CharacterFieldsV2) => {
        let effect = char.effect;
        console.log("call skill ", effect);
    }

    const died_check = (char: CharacterFieldsV2, enemyIndex:number) => {
        if (char.life <= 0) {
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

    return useCallback(async () => {
        // 循环体：
        while (some(chars, Boolean) && some(enemyChars, Boolean)) {
            // 出战1v1
            const charIndex = chars.findIndex(Boolean);
            setFightingIndex(charIndex);
            let char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            let enemyChar = enemyChars[enemyCharIndex]!;

            if (char.speed > enemyChar.speed) {
                if (char.magic == char.max_magic) {
                    call_skill(char);
                } else {
                    call_attack(char, enemyChar, enemyCharIndex);
                    char.magic = char.magic + 1;
                }

                let res = check_find_alive_char(enemyChar);
                if (res == null) {
                    break;
                }
                enemyChar = res;


                if (enemyChar.magic == enemyChar.max_magic) {
                    call_skill(enemyChar);
                } else {
                    call_attack(enemyChar, char, enemyCharIndex);
                    enemyChar.magic = enemyChar.magic + 1;
                }
            } else {
                if (enemyChar.magic == enemyChar.max_magic) {
                    call_skill(enemyChar);
                } else {
                    call_attack(enemyChar, char, enemyCharIndex);
                    enemyChar.magic = enemyChar.magic + 1;
                }

                let res = check_find_alive_char(char);
                if (res == null) {
                    break;
                }
                char = res;

                if (char.magic == char.max_magic) {
                    call_skill(char);
                } else {
                    call_attack(char, enemyChar, enemyCharIndex);
                    char.magic = char.magic + 1;
                }
            }
        // 	根据速度判断谁先出手，后出手
        // 	先手：
        // 	然后出手前，判断蓝量，满蓝即触发技能释放，否则普通攻击
            
        // 	1、技能：读取技能效果和作用人群范围，以及对方是否允许我触发
        // 	2、普通技能

        // 	生效前检查是否存在buff（这个要不要直接做到数值里）
        // 	根据buff算出最后的效果值，并作用到对应的人群(对方也有buff,也要考虑)

        // 	检查是否杀死了别人：是否有击杀特效，对方是否有亡语特效
        // 	如果有就触发
            
        // 	后手：
        // 	如果死了，就换下一个上来，没死就继续准备出手
        }
    }, []);
}