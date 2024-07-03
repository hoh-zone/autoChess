import { Box, Center, HStack } from "@chakra-ui/react"
import { ShopSlot } from "../control/ShopSlot"
import { ItemSlot } from "../control/ItemSlot"

export const Shop = () => {
  return (
    <div>
      <Box className="absolute left-[84%] bottom-[30%] w-[20%]">
        <HStack>
          <ItemSlot id={0} />
          <ItemSlot id={1} />
          <ItemSlot id={2} />
        </HStack>
      </Box>
      <Box className="absolute bottom-[30%] w-full h-[15%]">
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
    </div>
  )
}
