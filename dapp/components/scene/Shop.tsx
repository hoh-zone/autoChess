import { Box, HStack } from "@chakra-ui/react"
import { ShopSlot } from "../control/ShopSlot"

export const Shop = () => {
    return <Box flexBasis={"15%"} className="bg-indigo-200">
        <HStack className="justify-around relative top-[-20px]" gap={0}>
            <ShopSlot id={0} />
            <ShopSlot id={1}/>
            <ShopSlot id={2}/>
            <ShopSlot id={3}/>
            <ShopSlot id={4}/>
            <ShopSlot id={5}/>
        </HStack>
    </Box>
}
