import { Box, Button, Center, HStack, Img, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { SellButton } from "../control/SellButton"

export const MainScene = () => {
    return <HStack className="flex-1" gap={0}>
        {/* left side */}
        <div className="w-full h-full bg-slate-200 relative" >
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

    </HStack>
}
