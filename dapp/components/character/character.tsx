import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge";
import { CharColor, CharType } from "./type";

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
    charColor
}: {
    isOpponent?: boolean,
    charType: CharType,
    charColor: CharColor,
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
    } = getChar(charType, charColor);

    const [attack, setAttack] = useState(false);
    const src = attack ? attackSrc : moveSrc;
    const attackAnimRef = useRef<NodeJS.Timeout>();
    return (
        <div className="w-32 h-24 overflow-visible flex place-items-end z-10 pointer-events-none">
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

function getChar(charType: string, charColor: string): CharacterArgs {
    switch (charType) {
        case "orcBarbare":
            return {
                attackSrc: `./Orc_Barbare_0${charColor}_ATK_Full_12x1.png`,
                moveSrc: `./Orc_Barbare_0${charColor}_Move_5x1.png`,
                moveWidth: "114px",
                moveHeight: "116px",
                attackWidth: "114px",
                attackHeight: "116px",
            }
        case "orcArcher":
            return {
                attackSrc: `./Orc_Archer_0${charColor}_ATK_Full_18x1.png`,
                moveSrc: `./Orc_Archer_0${charColor}_Move_6x1.png`,
                moveWidth: "148px",
                moveHeight: "82px",
                attackWidth: "148px",
                attackHeight: "82px",
            }
        case "humanKnight":
            return {
                attackSrc: `./00_${charColor}_Tiny_Knight_Attack_11x1.png`,
                moveSrc: `./00_${charColor}_Tiny_Knight_Run_8x1.png`,
                moveWidth: "60px",
                moveHeight: "90px",
                attackWidth: "96px",
                attackHeight: "90px",
            }
    }
    throw new Error(`Unknown charType: ${charType}`);
}