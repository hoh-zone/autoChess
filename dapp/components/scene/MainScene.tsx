import { Box, HStack, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { SellButton } from "../control/SellButton"

export const MainScene = () => {
    return <HStack className="flex-1" gap={0}>
        {/* left side */}
        <div className="w-1/2 h-full bg-slate-200 relative" >
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
            <div className="absolute top-[-5%] right-1/3 h-full">
                <Stack className=" justify-around h-full">
                    <Slot isOpponent={true} id={11} />
                    <Slot isOpponent={true} id={12} />
                    <Slot isOpponent={true} id={13} />
                </Stack>
            </div>
            <div className="absolute top-[-5%] right-2/3 h-full">
                <Stack className=" justify-around h-full">
                    <Slot isOpponent={true} id={14} />
                    <Slot isOpponent={true} id={15} />
                    <Slot isOpponent={true} id={16} />
                </Stack>
            </div>
        </div>
    </HStack>
}
