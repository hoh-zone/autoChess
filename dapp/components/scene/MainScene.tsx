import { Box, Button, HStack, Img, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { SellButton } from "../control/SellButton"
import useQueryFight from "../button/QueryFightResult"
import { useAtom } from "jotai"
import { enemyCharacter } from "../../store/stages"

export const MainScene = () => {
    return <HStack className="flex-1" gap={0}>
        {/* left side */}
        <div className="w-1/2 h-full bg-slate-200 relative" >
            <div style={{marginLeft:'20px', marginTop:'140px'}}>
                <StatusBar isOpponent={false} id = {0}></StatusBar>
            </div>
            <div className="absolute top-[-5%] left-1/3 h-full">
                <Stack className=" justify-around h-full">
                    <Slot id={0} />
                    <Slot id={1} />
                    <Slot id={2} />
                </Stack>
            </div>
            <div className="absolute top-[-5%] left-2/3 h-full">
                <Stack className=" justify-around h-full">
                    <Slot id={3} />
                    <Slot id={4} />
                    <Slot id={5} />
                </Stack>
            </div>
            <Box className="absolute">
                <SellButton />
            </Box>
        </div>

        {/* right side */}
        <div className="w-1/2 h-full bg-slate-50 relative" >
            <div style={{marginLeft:'20px', marginTop:'140px'}}>
                <StatusBar isOpponent={true} id = {6}></StatusBar>
            </div>
            <div className="absolute top-[-5%] right-1/3 h-full">
                <Stack className=" justify-around h-full">
                    <Slot isOpponent={true} id={6} />
                    <Slot isOpponent={true} id={7} />
                    <Slot isOpponent={true} id={8} />
                </Stack>
            </div>
            <div className="absolute top-[-5%] right-2/3 h-full">
                <Stack className=" justify-around h-full">
                    <Slot isOpponent={true} id={9} />
                    <Slot isOpponent={true} id={10} />
                    <Slot isOpponent={true} id={11} />
                </Stack>
            </div>
        </div>
    </HStack>
}
