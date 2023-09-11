import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge";
import { CharType } from "./type";
import { charTable } from "./charTable";

type CharacterArgs = {
    attackSrc: string
    moveSrc: string
    moveWidth: string
    moveHeight: string
    attackWidth: string
    attackHeight: string
}

export function Character({
    isOpponent = false,
    charType,
}: {
    isOpponent?: boolean,
    charType: CharType,
}) {
    useEffect(() => {
        setInterval(() => {
            setAttack(true);
            if (attackAnimRef.current) clearInterval(attackAnimRef.current);
            attackAnimRef.current = setTimeout(() => setAttack(false), 1000);
        }, 3000 + Math.random() * 3000);
    }, [])
    const {
        attackSrc,
        moveSrc,
        moveWidth,
        moveHeight,
        attackWidth,
        attackHeight,
    } = charTable[charType];

    const [attack, setAttack] = useState(false);
    const src = attack ? attackSrc : moveSrc;
    const attackAnimRef = useRef<NodeJS.Timeout>();
    return (
        <div className="w-full h-full overflow-visible flex place-items-end z-10 pointer-events-none">
            {
                attack ? <div
                    className={
                        twMerge(
                            "attack animBasic mx-auto",
                            charType,
                            isOpponent ? "opponentCharacter" : ""
                        )
                    }
                    style={{
                        backgroundImage: `url(${src})`,
                        width: attackWidth,
                        height: attackHeight
                    }}
                /> : <div
                    className={
                        twMerge(
                            "move animBasic mx-auto",
                            charType,
                            isOpponent ? "opponentCharacter" : ""
                        )
                    }
                    style={{
                        backgroundImage: `url(${src})`,
                        width: moveWidth,
                        height: moveHeight
                    }}
                    onClick={() => {
                        setAttack(true);
                        if (attackAnimRef.current) clearInterval(attackAnimRef.current);
                        attackAnimRef.current = setTimeout(() => setAttack(false), 1000);
                    }}
                />}
        </div>
    )
}
