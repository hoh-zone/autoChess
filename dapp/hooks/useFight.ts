import { useCallback } from "react"
import { attackChangeA, chessId, enemyAttackChangeA, enemyCharacter, enemyFightingIndex, enemyHpChangeA, fightResultEffectA, fightingIndex, hpChangeA, slotCharacter, stageAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { sleep } from "../utils/sleep";
import confetti from "canvas-confetti";
import useQueryChesses from "../components/button/QueryAllChesses";
import { CharacterFields } from "../types/nft";
import { get_effect, get_effect_value } from "../components/character/rawData";

export const useFight = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [chars, setChars] = useAtom(slotCharacter);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);
    const [stage, setStage] = useAtom(stageAtom);
    const { query_chess } = useQueryChesses();
    const [_chessId, setChessId] = useAtom(chessId);
    const [fightResult, setFightResult] = useAtom(fightResultEffectA);

    const [hpChange, setHpChange] = useAtom(hpChangeA);
    const [enemyHpChange, setEnemyHpChange] = useAtom(enemyHpChangeA);
    const [attackChange, setAttackChange] = useAtom(attackChangeA);
    const [enemyAttackChange, setEnemyAttackChange] = useAtom(enemyAttackChangeA);

    let animationEnd = Date.now() + 4000;
    let skew = 1;

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    const win_effect = () => {
        confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.6 },
            ticks: 3000
        });
    };

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
        });

        if (timeLeft > 0) {
            requestAnimationFrame(lose_effect);
        }
    }

    const is_forbid_buff = (is_opponent:boolean) => {
        let target_group;
        if (is_opponent) {
            target_group = chars;
        } else {
            target_group = enemyChars;
        }
        for (const character of target_group) {
            if (character != null && character.life > 0) {
                if (get_effect(character) === "forbid_buff") {
                    return true
                }
            }
        }
        return false;
    }

    const call_effect = (char:CharacterFields, is_opponent:boolean) => {
        if (!char) {
            return;
        }

        // todo:改成直接从合约解析而不是读本地
        let effect = get_effect(char);
        if (effect === "") {
            console.log("异常:没有查询到effect", char);
            return
        }
        let effect_value = get_effect_value(char);
        let forbid_buff = is_forbid_buff(is_opponent);
        if (effect === "aoe") {
            console.log("aoe:", char);
            aoe(parseInt(effect_value), is_opponent);
        } else if (effect === "add_all_tmp_hp" && !forbid_buff) {
            add_all_tmp_hp(parseInt(effect_value), is_opponent);
        } else if (effect === "add_all_hp" && !forbid_buff) {
            add_all_hp(parseInt(effect_value), is_opponent);
        } else if (effect === "add_all_tmp_attack" && !forbid_buff) {
            add_all_tmp_attack(parseInt(effect_value), is_opponent);
        } else if (effect === "attack_lowest_hp") {
            attack_lowest_hp(parseInt(effect_value), is_opponent);
        }
    }

    const attack_lowest_hp = (value:number, is_opponent:boolean) => {
        console.log("出手！");
        let target_group;
        let target_hp_change;
        if (is_opponent) {
            target_group = chars;
            target_hp_change = hpChange;
        } else {
            target_group = enemyChars;
            target_hp_change = enemyHpChange;
        }
        let min_hp_index = 0;
        let min_hp = 10000;
        target_group.map((character, index) => {
            if (character == null || character.life == null) {
                return
            }
            if (min_hp_index < character.life) {
                min_hp = character.life;
                min_hp_index = index;
            }
        });
        if (target_group[min_hp_index] != null) {
            target_group[min_hp_index]!.life = target_group[min_hp_index]!.life - value < 0? 0 : target_group[min_hp_index]!.life - value;
            target_hp_change[min_hp_index] = - value;
            if (target_group[min_hp_index]!.life == 0) {
                target_group[min_hp_index] = null
            }
        }
        setHpChange(hpChange);
        setEnemyHpChange(enemyHpChange);
    }

    const add_all_tmp_attack = (value:number, is_opponent:boolean) => {
        let target_group;
        let target_attack_change;
        if (is_opponent) {
            target_group = enemyChars;
            target_attack_change = enemyAttackChange;
        } else {
            target_group = chars;
            target_attack_change = attackChange;
        }
        target_group.map((character, index) => {
            if (character == null || character.attack == null || character.life == 0) {
                return
            }
            character.attack = Number(character.attack) + Number(value);
            target_attack_change[index] = Number(value);
        });
        console.log("全体加攻:", value, " is enemy:",is_opponent)
    }

    const add_all_hp = (value:number, is_opponent:boolean) => {
        let target_group;
        let target_hp_change;
        if (is_opponent) {
            target_group = enemyChars;
            target_hp_change = enemyHpChange;
        } else {
            target_group = chars;
            target_hp_change = hpChange;
        }
        target_group.map((character, index) => {
            // 禁止死亡时奶回来
            if (character == null || character.life == null ||  character.life == 0) {
                return
            }
            character.life = Number(character.life) + Number(value);
            target_hp_change[index] = Number(value);
        });
        console.log("全体加血:", value, " is enemy:",is_opponent)
    }

    const add_all_tmp_hp = (value:number, is_opponent:boolean) => {
        let target_group;
        let target_hp_change;
        if (is_opponent) {
            target_group = enemyChars;
            target_hp_change = enemyHpChange;
        } else {
            target_group = chars;
            target_hp_change = hpChange;
        }
        target_group.map((character, index) => {
            // 禁止死亡时奶回来
            if (character == null || character.life == null || character.life == 0) {
                return
            }
            character.life = Number(character.life) + Number(value);
            target_hp_change[index] = Number(value);
        });
    }

    const aoe = (value:number, is_opponent:boolean) => {
        let target_group;
        let target_hp_change;
        if (is_opponent) {
            target_group = chars;
            target_hp_change = hpChange;
        } else {
            target_group = enemyChars;
            target_hp_change = enemyHpChange;
        }
        target_group.map((character, index) => {
            if (character == null || character.life == null) {
                return
            }
            character.life = Number(character.life) - Number(value);
            target_hp_change[index] = - Number(value);
            if (character.life <= 0) {
                target_group[index] = null;
            }
        });
        if (is_opponent) {
            setChars(target_group);
        } else {
            setEnemyChars(target_group);
        }
        console.log("范围伤害:", value, " is enemy:", is_opponent)
    }

    const get_random_number = () => {
        let num = 2 + 3 * Math.random();
        return "Reward: " + (num.toFixed(2)) +" SUI";
    }

    const clear_change = () => {
        setAttackChange([0, 0, 0, 0, 0, 0]);
        setEnemyAttackChange([0, 0, 0, 0, 0, 0]);
        setHpChange([0, 0, 0, 0, 0, 0]);
        setEnemyHpChange([0, 0, 0, 0, 0, 0]);
    }

    return useCallback(async () => {
        // both sides have characters, continue fighting
        await sleep(500);
        while (some(chars, Boolean) && some(enemyChars, Boolean)) {
            const charIndex = chars.findIndex(Boolean);
            setFightingIndex(charIndex);
            const char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            const enemyChar = enemyChars[enemyCharIndex]!;

            // combat
            // 起手开1次大招
            char.attacking = 2;
            enemyChar.attacking = 2;
            setEnemyChars(enemyChars.slice());
            setChars(chars.slice());
            await sleep(1500);

            // reset
            char.attacking = 0;
            enemyChar.attacking = 0;
            setEnemyChars(enemyChars.slice());
            setChars(chars.slice());

            // effect skill call once
            call_effect(char, false);
            call_effect(enemyChar, true);
            await sleep(500);

            // 激情互殴至死
            while(char.life > 0 && enemyChar.life > 0) {
                char.attacking = 1;
                enemyChar.attacking = 1;
                setEnemyChars(enemyChars.slice());
                setChars(chars.slice());
                await sleep(1000);

                // reset
                char.attacking = 0;
                enemyChar.attacking = 0;
                setEnemyChars(enemyChars.slice());
                setChars(chars.slice());

                char.life = Number(char.life) - Number(enemyChar.attack);
                hpChange[charIndex] = - Number(enemyChar.attack);

                enemyChar.life = Number(enemyChar.life) - Number(char.attack);
                enemyHpChange[enemyCharIndex] = - Number(char.attack);
                
                setEnemyHpChange(enemyHpChange);
                setHpChange(hpChange);

                console.log("enemy hp change:", enemyHpChange);
                console.log("hp change:", hpChange);
                if (char.life <= 0) {
                    chars[charIndex] = null;
                }
                setChars(chars.slice());
    
                if (enemyChar.life <= 0) {
                    enemyChars[enemyCharIndex] = null;
                }
                setEnemyChars(enemyChars.slice());
                await sleep(500);
            }
        }

        if (some(chars, Boolean)) {
            setFightResult(get_random_number());
            for (let i = 0; i < 5; ++i) {
                win_effect();
                await sleep(200);
            }
            await sleep(1000);
            setFightResult(null);
        } else {
            setFightResult("You Lose");
            animationEnd = Date.now() + 2000;
            lose_effect();
            await sleep(2000);
            setFightResult(null);
        }

        clear_change();

        // 更新数据并进入shop
        if (_chessId) {
            await query_chess(_chessId);
            setEnemyChars([]);
            setStage("shop");
        }
    }, [enemyChars, setEnemyChars, chars, setChars]);
}