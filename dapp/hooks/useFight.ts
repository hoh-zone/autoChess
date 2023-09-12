import { useCallback } from "react"
import { enemyCharacter, slotCharacter } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { sleep } from "../utils/sleep";

export const useFight = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [chars, setChars] = useAtom(slotCharacter);
    
    return useCallback(async () => {
        // both sides have characters, continue fighting
        while(some(chars, Boolean) && some(enemyChars, Boolean)) {
            const charIndex = chars.findIndex(Boolean);
            const char = chars[charIndex]!;

            const enemyCharIndex = enemyChars.findIndex(Boolean);
            const enemyChar = enemyChars[enemyCharIndex]!;

            // attacking animation
            char.attacking = true;
            enemyChar.attacking = true;
            setEnemyChars(enemyChars);
            setChars(chars);
            await sleep(2000);

            const charLife = Number(char.life) - Number(enemyChar.attack);
            const enemyLife = Number(enemyChar.life) - Number(char.attack);

            char.life = charLife.toString();
            enemyChar.life = enemyLife.toString();
            
            if (charLife < 0) {
                chars[charIndex] = null;
            }
            setChars(chars);

            if (enemyLife < 0) {
                enemyChars[enemyCharIndex] = null;
            }
            setEnemyChars(enemyChars);
            await sleep(500);
        }
    }, [enemyChars, setEnemyChars, chars, setChars]);
}