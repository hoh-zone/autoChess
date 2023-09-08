import { useRef, useState } from "react"
import { twMerge } from "tailwind-merge";

export function Character({
    attackSrc,
    moveSrc,
    width,
    height,
    className
}: {
    attackSrc: string
    moveSrc: string
    width: string,
    height: string,
    className?: string
}) {
    const [attack, setAttack] = useState(false);
    const src = attack ? attackSrc : moveSrc;
    const attackAnimRef = useRef<NodeJS.Timeout>();
    return (
        <div
            className={twMerge(
                attack ? "attack" : "move",
                "animBasic",
                className
            )}
            style={{
                backgroundImage: `url(${src})`,
                width,
                height
            }}
            onClick={() => {
                setAttack(true);
                if (attackAnimRef.current) clearInterval(attackAnimRef.current);
                attackAnimRef.current = setTimeout(() => setAttack(false), 1000);
            }}
        />
    )
}