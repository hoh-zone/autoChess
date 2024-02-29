import { useCallback } from "react"
import { attackChangeA, chessId, enemyAttackChangeA, enemyCharacter, enemyFightingIndex, enemyHpChangeA, enemySkillTagA, fightResultEffectA, fightingIndex, hpChangeA, operationsA, skillTagA, slotCharacter, stageAtom,fightResultModalVisibleAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import confetti from "canvas-confetti";
import { CharacterFields } from "../types/nft";
import useQueryChesses from "../components/button/QueryAllChesses";
import { sleep } from "../utils/sleep";
import { get_max_sp } from "../components/character/rawData";

export const useFight = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [chars, setChars] = useAtom(slotCharacter);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);
    const [stage, setStage] = useAtom(stageAtom);
    const { query_chess } = useQueryChesses();
    const [operations, setOperations] = useAtom(operationsA);
    const [hpChange, setHpChange] = useAtom(hpChangeA);
    const [enemyHpChange, setEnemyHpChange] = useAtom(enemyHpChangeA);
    const [attackChange, setAttackChange] = useAtom(attackChangeA);
    const [enemyAttackChange, setEnemyAttackChange] = useAtom(enemyAttackChangeA);
    const [fightResult, setFightResult] = useAtom(fightResultEffectA);
    const [_chessId, setChessId] = useAtom(chessId);
    const [skillTag, setSkillTag] = useAtom(skillTagA);
    const [enemySkillTag, setEnemySkillTag] = useAtom(enemySkillTagA);
    const [fightResultModalVisible, setFightResultModalVisible] = useAtom(fightResultModalVisibleAtom)

    let animationEnd = Date.now() + 4000;
    let skew = 1;

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const clear_change = () => {
        setAttackChange([0, 0, 0, 0, 0, 0]);
        setEnemyAttackChange([0, 0, 0, 0, 0, 0]);
        setHpChange([0, 0, 0, 0, 0, 0]);
        setEnemyHpChange([0, 0, 0, 0, 0, 0]);
    }

    const lose_effect = () => {
        const timeLeft = animationEnd - Date.now(),
            ticks = Math.max(200, 500 * (timeLeft / 4000));

        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                // since particles fall down, skew start toward the top
                y: Math.random() * skew - 0.2,
            },
            colors: ["#ffffff"],
            shapes: ["circle"],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4),
            zIndex: 9999999
        });

        if (timeLeft > 0) {
            requestAnimationFrame(lose_effect);
        }
    }

    const win_effect = () => {
        confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.6 },
            ticks: 3000,
            zIndex: 9999999
        });
    };

    const call_attack = (char: CharacterFields, enemyChar: CharacterFields, enemyIndex: number, is_opponent: boolean) => {
        let attack: number = char.attack;
        if (enemyChar.hp < attack) {
            enemyChar.hp = 0;
        } else {
            enemyChar.hp -= attack;
        }
        if (is_opponent) {
            hpChange[enemyIndex] = -attack;
            console.log("敌人：", char.class, " 普攻: ", attack, "生命:", char.hp, " 攻击", enemyChar.class, "攻击后生命:", enemyChar.hp);
        } else {
            enemyHpChange[enemyIndex] = -attack;
            console.log("我军：", char.class, " 普攻: ", attack, "生命:", char.hp, " 攻击", enemyChar.class, "攻击后生命:", enemyChar.hp);
        }
    }

    const get_target_group = (is_opponent: boolean, is_attack: boolean) => {
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

    const set_target_group = (group: (CharacterFields | null)[], is_opponent: boolean, is_attack: boolean) => {
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

    const find_next_alive_char_index = (is_opponent: boolean, charIndex: number, enemyIndex: number) => {
        if (is_opponent) {
            if (enemyIndex == enemyChars.length - 1) {
                return null;
            }
            for (let i = enemyIndex + 1; i < enemyChars.length; i++) {
                let role = enemyChars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.hp > 0) {
                    return i;
                }
            }
        } else {
            if (charIndex == chars.length - 1) {
                return null;
            }
            for (let i = charIndex + 1; i < chars.length; i++) {
                let role = chars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.hp > 0) {
                    return i;
                }
            }
        }
    }

    const find_last_one_index = (is_opponent: boolean) => {
        if (is_opponent) {
            for (let i = enemyChars.length - 1; i > 0; i--) {
                let role = enemyChars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.hp > 0) {
                    return i;
                }
            }
        } else {
            for (let i = chars.length; i > 0; i--) {
                let role = chars[i];
                if (role == null || role == undefined) {
                    continue;
                }
                if (role.hp > 0) {
                    return i;
                }
            }
        }
    }

    const call_skill = (char: CharacterFields, enemy: CharacterFields, charIndex: number, enemyIndex: number, is_opponent: boolean) => {
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
            if (character != null && character.hp > 0) {
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
            console.log("敌人:", char.class, " 释放技能:", char.effect, ":", value);
        } else {
            console.log("我军:", char.class, " 释放技能:", char.effect, ":", value);
        }

        if (effect == "aoe") {
            target_group = get_target_group(is_opponent, true);
            target_group.map((ele: CharacterFields | null, index: number) => {
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
            target_group.map((ele: CharacterFields | null, index: number) => {
                if (ele == null || ele.hp <= 0) {
                    return;
                };
                ele.hp = Number(ele.hp) + Number(value);
                if (is_opponent) {
                    enemyHpChange[index] = value;
                } else {
                    hpChange[index] = value;
                }
            });
            console.log("全体加血:", value);
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "add_all_tmp_attack") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            target_group = get_target_group(is_opponent, false);
            target_group.map((ele: CharacterFields | null, index: number) => {
                if (ele == null) {
                    return;
                }
                ele.attack = Number(ele.attack) + Number(value);
                if (is_opponent) {
                    enemyAttackChange[index] = value;
                } else {
                    attackChange[enemyIndex] = value;
                }
            });
            console.log("全体加攻:", value);
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "all_max_hp_to_back1") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            let next_one = find_next_alive_char_index(is_opponent, charIndex, enemyIndex);
            if (next_one == null) {
                return;
            }

            target_group = get_target_group(is_opponent, false);
            target_group[next_one]!.max_hp = Number(target_group[next_one]!.max_hp) + Number(value);
            target_group[next_one]!.hp = Number(target_group[next_one]!.hp) + Number(value);
            console.log("触发后一个角色永久生命值增加:", next_one, value);
            if (is_opponent) {
                enemyHpChange[next_one] = value;
            } else {
                hpChange[next_one] = value;
            }
            set_target_group(target_group, is_opponent, false);
        } else if (effect == "reduce_all_tmp_attack") {
            if (is_forbid_debuff) {
                console.log("触发特效: 加debuff失败")
                return;
            }
            target_group = get_target_group(is_opponent, true);
            target_group.map((ele: CharacterFields | null, index: number) => {
                if (ele == null) {
                    return;
                }
                ele.attack -= value;
                if (ele.attack <= 0) {
                    ele.attack = 1;
                }
                if (is_opponent) {
                    attackChange[index] = -value;
                } else {
                    enemyAttackChange[enemyIndex] = -value;
                }
            });
            console.log("全体降攻:", value);
            set_target_group(target_group, is_opponent, true);
        } else if (effect == "attack_sputter_to_second_by_percent") {
            target_group = get_target_group(is_opponent, true);
            let suppter_attack = Math.round(value / 10 * char.attack);
            enemy.hp -= char.attack;
            let next_one_index = find_next_alive_char_index(!is_opponent, charIndex, enemyIndex);
            if (next_one_index == null) {
                return;
            }
            target_group[next_one_index]!.hp -= suppter_attack;
            if (is_opponent) {
                hpChange[enemyIndex] = -char.attack;
                hpChange[next_one_index] = -(suppter_attack);
            } else {
                enemyHpChange[enemyIndex] = -char.attack;
                enemyHpChange[next_one_index] = -(suppter_attack);
            }
            console.log("造成溅射伤害:", suppter_attack);
        } else if (effect == "attack_last_char") {
            target_group = get_target_group(is_opponent, true);
            // 如果对手第一个就是最后一个，则基础伤害+效果伤害。
            let last_one_index = find_last_one_index(!is_opponent);
            if (last_one_index == null) {
                return;
            }
            target_group[last_one_index]!.hp -= value;
            if (is_opponent) {
                hpChange[last_one_index] = -(value);
            } else {
                enemyHpChange[last_one_index] = -(value);
            }
            console.log("攻击最后一名角色:", target_group[last_one_index]?.class, value);
        } else if (effect == "reduce_tmp_attack") {
            if (is_forbid_debuff) {
                console.log("触发特效: 加debuff失败")
                return;
            }
            enemy.attack -= value;
            if (enemy.attack <= 0) {
                enemy.attack = 1;
            }
            if (is_opponent) {
                attackChange[enemyIndex] = -(value);
            } else {
                enemyAttackChange[enemyIndex] = -(value);
            }
            console.log("触发单体降攻:", value);
        } else if (effect == "add_all_tmp.sp") {
            if (is_forbid_buff) {
                console.log("触发特效: 加buff失败")
                return;
            }
            target_group = get_target_group(is_opponent, false);
            target_group.map((ele: CharacterFields | null, index: number) => {
                if (ele == null || index == charIndex) {
                    return;
                }
                ele.sp += value;
                if (ele.sp >= ele.max_sp) {
                    ele.sp = ele.max_sp;
                }
            });
            console.log("全体加魔法值:", value, target_group[3]);
            set_target_group(target_group, is_opponent, false);
            console.log("全体加魔法值2:", chars[3]);
        } else if (effect == "attack_lowest_hp") {
            target_group = get_target_group(is_opponent, true);
            let min_hp_index = 0;
            target_group.map((character, index) => {
                if (character == null || character.hp == null) {
                    return
                }
                if (min_hp_index < character.hp) {
                    min_hp_index = index;
                }
            });
            console.log("目标：", target_group[min_hp_index]?.class, " 攻击前生命:", target_group[min_hp_index]?.hp);
            if (target_group[min_hp_index] != null) {
                target_group[min_hp_index]!.hp = (target_group[min_hp_index]!.hp - value) < 0 ? 0 : target_group[min_hp_index]!.hp - value;
                if (target_group[min_hp_index]!.hp == 0) {
                    console.log("对方死亡");
                    target_group[min_hp_index] = null
                }
                if (is_opponent) {
                    hpChange[min_hp_index] = -value;
                } else {
                    enemyHpChange[min_hp_index] = -value;
                }
            }
            set_target_group(target_group, is_opponent, true);
        } else if (effect == "attack_by_life_percent") {
            target_group = get_target_group(is_opponent, true);
            let life = enemy.max_hp;
            let extra_attack = Math.round(value / 10 * life);
            let final_attack = Number(char.attack) + Number(extra_attack);
            enemy.hp -= (final_attack);
            if (is_opponent) {
                hpChange[enemyIndex] = -(final_attack);
            } else {
                enemyHpChange[enemyIndex] = -(final_attack);
            }
            console.log("造成额外百分比伤害:", char.attack, " + ", extra_attack);
        }
    }

    const died_check = (charactors: (CharacterFields | null)[], is_opponent: boolean) => {
        if (charactors == null) {
            return;
        }
        charactors.map((ele, index) => {
            if (ele == null) {
                return;
            }
            if (ele.hp <= 0) {
                if (is_opponent) {
                    console.log("敌人:", ele.class, " 死亡");
                    enemyChars[index] = null
                } else {
                    console.log("我军：", ele.class, " 死亡");
                    chars[index] = null
                }
            }
        })
    }

    const get_extra_max_sp_debuff = (is_opponent: boolean) => {
        let value = 0;
        if (is_opponent) {
            chars.map((ele) => {
                if (ele == null) {
                    return;
                }
                if (ele.effect === "add_all_tmp_max_sp") {
                    value = parseInt(ele.effect_value) > value ? parseInt(ele.effect_value) : value;
                }
            })
        } else {
            enemyChars.map((ele) => {
                if (ele == null) {
                    return;
                }
                if (ele.effect === "add_all_tmp_max_sp") {
                    value = parseInt(ele.effect_value) > value ? parseInt(ele.effect_value) : value;
                }
            })
        }
        if (is_opponent && value > 0) {
            console.log("敌人:最大魔法值+", value);
        }
        if (!is_opponent && value > 0) {
            console.log("我军:最大魔法值+", value);
        }
        return value;
    }

    const modify_max_sp = (extra_max_sp_debuff: number, is_opponent: boolean, charIndex: number) => {
        let target_group = get_target_group(is_opponent, false);
        if (target_group[charIndex] == null) {
            return;
        }
        if (extra_max_sp_debuff > 0) {
            target_group[charIndex]!.max_sp = get_max_sp(target_group[charIndex]) + Number(extra_max_sp_debuff);
        } else if (extra_max_sp_debuff == 0 && target_group[charIndex]!.max_sp > get_max_sp(target_group[charIndex])) {
            target_group[charIndex]!.max_sp = get_max_sp(target_group[charIndex]);
        }
    }

    const action = async (char: CharacterFields, enemy: CharacterFields, charIndex: number, enemyIndex: number, is_opponent: boolean) => {
        let extra_max_sp_debuff = get_extra_max_sp_debuff(is_opponent);
        modify_max_sp(extra_max_sp_debuff, is_opponent, charIndex);
        if (char.sp >= Number(char.max_sp) && char.effect_type === "skill") {
            skillTag[charIndex] = "1";
            char.attacking = 2;
            char.sp = 0;
            setChars(chars.slice());
            setEnemyChars(enemyChars.slice());
            await sleep(1000);
            call_skill(char, enemy, charIndex, enemyIndex, is_opponent);
            char.attacking = 0;
            skillTag[charIndex] = "";
        } else {
            char.attacking = 1;
            setChars(chars.slice());
            setEnemyChars(enemyChars.slice());
            await sleep(700);
            call_attack(char, enemy, enemyIndex, is_opponent);
            char.sp = char.sp + 1;
            char.attacking = 0;
        }
    }

    const reset_status = () => {
        setOperations([]);
        operations.push(chars.toString());
        clear_change();
    }

    return useCallback(async () => {
        console.log("--------开始战斗-------");
        console.log(chars);
        console.log(enemyChars);
        let loop = 50;
        while (some(chars, Boolean) && some(enemyChars, Boolean)) {
            // 出战1v1
            let charIndex = chars.findIndex(Boolean);
            setFightingIndex(charIndex);
            let char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            let enemyChar = enemyChars[enemyCharIndex]!;

            // 同时攻击
            let max_loop = 40;
            while (char.hp > 0 && enemyChar.hp > 0) {
                await sleep(500);
                await action(char, enemyChar, charIndex, enemyCharIndex, false);
                await action(enemyChar, char, enemyCharIndex, charIndex, true);

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

        if (some(enemyChars, Boolean)) {
            setFightResult("you lose");
            animationEnd = Date.now() + 2000;
            lose_effect();
            await sleep(2000);
        } else {
            setFightResult("you win");
            for (let i = 0; i < 5; ++i) {
                win_effect();
            }
        }

        reset_status();

        // 显示战斗结果弹窗
        if (_chessId) {
            await query_chess(_chessId);
            setEnemyChars([]);
            setFightResultModalVisible(true);
        }
    }, [enemyChars, setEnemyChars, chars, setChars]);
}
