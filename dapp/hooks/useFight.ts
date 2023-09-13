import { useCallback } from "react"
import { enemyCharacter, enemyFightingIndex, fightingIndex, slotCharacter, stageAtom } from "../store/stages";
import { useAtom } from "jotai";
import some from "lodash/some";
import { sleep } from "../utils/sleep";
import confetti from "canvas-confetti";

export const useFight = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [chars, setChars] = useAtom(slotCharacter);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);
    const [stage, setStage] = useAtom(stageAtom);

    const duration = 4 * 1000,
    animationEnd = Date.now() + duration;
    let skew = 1;

    function randomInRange(min:number, max:number) {
        return Math.random() * (max - min) + min;
    }
    const win_effect = () => {
        confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.6 },
        });
    };


    const lose_effect = () => {
        const timeLeft = animationEnd - Date.now(),
          ticks = Math.max(200, 500 * (timeLeft / duration));
      
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
            await sleep(1000);

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
        if (some(chars, Boolean)) {
            win_effect();
            await sleep(200);
            win_effect();
            await sleep(200);
            win_effect();
            await sleep(1000);
            console.log("I win(client");
        } else {
            lose_effect();
            await sleep(2000);
            console.log("I lose(client)")
        }
        setStage("shop");
    }, [enemyChars, setEnemyChars, chars, setChars]);
}