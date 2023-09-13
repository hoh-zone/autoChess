import { Box, Button, Center, HStack, Img, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { SellButton } from "../control/SellButton"

export const FightScene = () => {
    return <div className="h-full w-full">
    <video style={{ width: '100%', height: '100%' }} autoPlay loop muted>
        <source src="bg6.mp4" type="video/mp4" />
    </video>
    <div className="text-fight-game">
        <Stack>
            <HStack>
                <StatusBar isOpponent={false}></StatusBar>
                <StatusBar isOpponent={true}></StatusBar>
            </HStack>
            <HStack>
            <div style={{marginTop:'400px'}} className="w-1/2 h-full bg-slate-0 relative" >
                <div className="absolute top-[-5%] left-1/3 h-full">
                    <Stack className=" justify-around h-full">
                        <Slot showInfo = {false} id={0} />
                        <Slot showInfo = {false} id={1} />
                        <Slot showInfo = {false} id={2} />
                    </Stack>
                </div>
                <div className="absolute top-[-5%] left-2/3 h-full">
                    <Stack className=" justify-around h-full">
                        <Slot showInfo = {false} id={3} />
                        <Slot showInfo = {false} id={4} />
                        <Slot showInfo = {false} id={5} />
                    </Stack>
                </div>
            </div>

            {/* right side */}
            <div style={{marginTop:'400px'}}  className="w-1/2 h-full bg-slate-0 relative" >
                <div className="absolute top-[-5%] right-1/3 h-full">
                    <Stack className=" justify-around h-full">
                        <Slot showInfo = {false} isOpponent={true} id={6} />
                        <Slot showInfo = {false} isOpponent={true} id={7} />
                        <Slot showInfo = {false} isOpponent={true} id={8} />
                    </Stack>
                </div>
                <div className="absolute top-[-5%] right-2/3 h-full">
                    <Stack className=" justify-around h-full">
                        <Slot showInfo = {false} isOpponent={true} id={9} />
                        <Slot showInfo = {false} isOpponent={true} id={10} />
                        <Slot showInfo = {false} isOpponent={true} id={11} />
                    </Stack>
                </div>
            </div>
        </HStack>
    </Stack>
    </div>
    </div>
}
