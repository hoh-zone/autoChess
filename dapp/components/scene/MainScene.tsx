import { Box, HStack, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { SellButton } from "../control/SellButton"
import { LevelUp } from "../effect/LevelUp"
import { CharInstruction } from "../CharInstruction"
import { winA } from "../../store/stages"
import { useAtom } from "jotai"

export const MainScene = () => {
    const [win] = useAtom(winA);
    return <div className="h-full w-full relative">
        <LevelUp />
        <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
            <source src="bg4.mp4" type="video/mp4" />
        </video>
        <HStack className="absolute top-0 p-8 w-full h-3/4 justify-around" align={"center"}>
            {/* left side */}
            <div className="w-full h-full relative" >
                <div className="absolute top-[-5%] left-1/4 h-full">
                    <Stack gap={70} className=" justify-around h-full">
                        <Slot id={0} />
                        <Slot id={1} />
                        <Slot id={2} />
                    </Stack>
                </div>
                <div className="absolute top-[-5%] left-2/3 h-full">
                    <Stack gap={70} className=" justify-around h-full">
                        <Slot id={3} />
                        <Slot id={4} />
                        <Slot id={5} />
                    </Stack>
                </div>
                <Stack className="absolute">
                    <SellButton />
                    <CharInstruction/>
                </Stack>
            </div>
        </HStack>
    </div>
}
