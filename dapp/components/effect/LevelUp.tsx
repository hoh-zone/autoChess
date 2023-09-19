import confetti from "canvas-confetti";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { levelUpEffectA } from "../../store/stages";

export const LevelUp = () => {
    const [levelUp, setLevelUp] = useAtom(levelUpEffectA);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current === null) return;
        var myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true
        });

        // two side, celebrate
        const frame = () => {
            myConfetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#bb0000', '#ffffff']
            });
            myConfetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#bb0000', '#ffffff']
            });
            requestAnimationFrame(frame);
        };

        frame();
    }, [canvasRef.current, levelUp]);

    return <>
        {levelUp && <canvas ref={canvasRef} className="top-0 left-0 absolute h-[100vh] w-[100vw] z-50 pointer-events-none" />}
    </>
}