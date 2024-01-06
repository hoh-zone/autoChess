import { Box, Center, HStack } from "@chakra-ui/react"
import { ShopSlot } from "../control/ShopSlot"

export const Shop = () => {
    return <Box className="absolute bottom-[30%] w-full h-[15%]">
        <Center>
            <HStack className="justify-around relative top-[-20px] w-[60%]" gap={0}>
                <ShopSlot id={0} />
                <ShopSlot id={1} />
                <ShopSlot id={2} />
                <ShopSlot id={3} />
                <ShopSlot id={4} />
            </HStack>
        </Center>
    </Box>
}
