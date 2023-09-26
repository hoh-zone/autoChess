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

    const call_attack = (char: CharacterFieldsV2, enemyChar: CharacterFieldsV2, enemyIndex:number, is_opponent: boolean) => {
        let attack = char.attack;
        enemyChar.life -= attack;
        if (is_opponent) {
            console.log("敌人：", char.name, " 普攻: 攻击", enemyChar.name, "攻击后生命:", enemyChar.life);
        } else {
            console.log("我军：", char.name, " 普攻: 攻击", enemyChar.name, "攻击后生命:", enemyChar.life);
        }
    }

    const call_skill = (char: CharacterFieldsV2, is_opponent:boolean) => {
        let effect = char.effect;
        let value = parseInt(char.effect_value);
        if (is_opponent) {
            console.log("敌人:",char.name, " 释放技能:", char.effect);
        } else {
            console.log("我军:", char.name, " 释放技能:", char.effect);
        }
        
        if (effect == "aoe") {
            if (is_opponent) {
                chars.map((ele:CharacterFieldsV2 | null, index:number) => {
                    if (ele == null) {
                        return;
                    }
                    call_attack(char, ele, index, is_opponent);
                });
            } else {
                enemyChars.map((ele:CharacterFieldsV2 | null, index:number) => {
                    if (ele == null) {
                        return;
                    }
                    call_attack(char, ele, index, is_opponent);
                });
            }
        } else if (effect = "add_all_tmp_hp") {
            if (is_opponent) {
                enemyChars.map((ele:CharacterFieldsV2 | null, index:number)=>{
                    if (ele == null) {
                        return;
                    }
                    enemyChars[index]!.life += value;
                })
            } else {
                chars.map((ele:CharacterFieldsV2 | null, index:number)=>{
                    if (ele == null) {
                        return;
                    }
                    chars[index]!.life += value;
                })
            }
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

    const action = (char:CharacterFieldsV2, enemy:CharacterFieldsV2, enemyIndex:number, is_opponent:boolean) => {
        if (char.magic == char.max_magic) {
            call_skill(char, is_opponent);
        } else {
            call_attack(char, enemy, enemyIndex, is_opponent);
            char.magic = char.magic + 1;
        }
    }

    const reset_status = () => {
        chars.map((chr)=> {
            if (chr == null) {
                return;
            }
            chr.life = chr.max_life;
            chr.magic = 0;
        })
        enemyChars.map((chr)=> {
            if (chr == null) {
                return;
            }
            chr.life = chr.max_life;
            chr.magic = 0;
        })
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

            // 同时攻击
            while (char.life > 0 && enemyChar.life > 0) {
                action(char, enemyChar, enemyCharIndex, false);
                action(enemyChar, char, charIndex, true);
    
                died_check(chars, false);
                died_check(enemyChars, true);
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