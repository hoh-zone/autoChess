import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge";
import { charTable } from "./charTable";

export function Character({
    isOpponent = false,
    charType,
    attack = false
}: {
    isOpponent?: boolean,
    charType: string,
    attack?: boolean
}) {
    if(!charTable[charType as keyof typeof charTable]) {
        console.error("not found", charType);
        return <>no</>
    }
    const {
        attackSrc,
        moveSrc,
        moveWidth,
        moveHeight,
        attackWidth,
        attackHeight,
    } = charTable[charType as keyof typeof charTable];


    const src = attack ? attackSrc : moveSrc;
    
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
                />}
        </div>
    )
}
