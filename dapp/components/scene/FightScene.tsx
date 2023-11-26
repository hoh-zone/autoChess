import { HStack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { useAtom } from "jotai"
import { enemyCharacter, slotCharacter, winA } from "../../store/stages"
import { twMerge } from "tailwind-merge"
import range from "lodash/range"
import { FightResultText } from "../effect/FightResultText"

const positionTable: { [key: string]: string } = {
    0: "right-0 top-0",
    1: "right-[15%] bottom-[15%]",
    2: "right-[30%] top-[15%]",
    3: "right-[40%] bottom-[25%]",
    4: "right-[50%] top-[10%]",
    5: "right-[65%] bottom-[20%]",
    10: "left-0 top-0",
    11: "left-[15%] bottom-[15%]",
    12: "left-[30%] top-[15%]",
    13: "left-[40%] bottom-[25%]",
    14: "left-[50%] top-[10%]",
    15: "left-[65%] bottom-[20%]",
}

export const FightScene = () => {
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [chars, setChars] = useAtom(slotCharacter);
    const charIndex = chars.findIndex(Boolean);
    const enemyIndex = enemyChars.findIndex(Boolean);

    const [win] = useAtom(winA);
    const get_video_bg = () => {
        let index = win + 1;
        if (index > 8) {
            index == 8;
        }
        return "bg" + index + ".mp4";
    }

    return <div className="h-[90%] w-full relative">
        <FightResultText />
        <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
            <source src="bg10.mp4" type="video/mp4" />
        </video>
        <HStack className="absolute top-0 p-8 w-full justify-around">
            <StatusBar isOpponent={false}></StatusBar>
            <StatusBar isOpponent={true}></StatusBar>
        </HStack>
        <HStack className="absolute w-full h-[120px] bottom-0">
            <div className="w-1/2 h-full relative" >
                {range(0, 7).map((id) =>
                (<div key={id} className={twMerge(
                    "absolute transition-all duration-500",
                    charIndex === id ?
                        "right-0 top-0" :
                        positionTable[id] ?? "right-[20%] top-[20%]"
                )}>
                    <Slot id={id} />
                </div>)
                )}
            </div>

            <div className="w-1/2 h-full relative" >
                {range(10, 17).map((id) =>
                (<div key={id} className={twMerge(
                    "absolute transition-all",
                    enemyIndex + 10 === id ?
                        "left-0 top-0" :
                        positionTable[id] ?? "left-[20%] top-[20%]"
                )}>
                    <Slot id={id} isOpponent={true} />
                </div>)
                )}
            </div>

        </HStack>
    </div>
}
