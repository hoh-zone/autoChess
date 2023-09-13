import { useCallback } from "react"
import { enemyCharacter, enemyFightingIndex, fightingIndex, slotCharacter, stageAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { sleep } from "../utils/sleep";

export const useFight = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [chars, setChars] = useAtom(slotCharacter);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);
    const [stage, setStage] = useAtom(stageAtom);

    return useCallback(async () => {
        // both sides have characters, continue fighting
        while(some(chars, Boolean) && some(enemyChars, Boolean)) {
            const charIndex = chars.findIndex(Boolean);
            setFightingIndex(charIndex);
            const char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            setEnemyFightingIndex(enemyCharIndex);
            const enemyChar = enemyChars[enemyCharIndex]!;

            // attacking animation
            char.attacking = true;
            enemyChar.attacking = true;
            setEnemyChars(enemyChars.slice());
            setChars(chars.slice());
            await sleep(2000);

            const charLife = Number(char.life) - Number(enemyChar.attack);
            const enemyLife = Number(enemyChar.life) - Number(char.attack);

            char.life = charLife.toString();
            enemyChar.life = enemyLife.toString();
            
            if (charLife < 0) {
                chars[charIndex] = null;
            }
            setChars(chars.slice());

            if (enemyLife < 0) {
                enemyChars[enemyCharIndex] = null;
            }
            setEnemyChars(enemyChars.slice());
            await sleep(500);
        }
        // setStage("shop");
    }, [enemyChars, setEnemyChars, chars, setChars]);
}