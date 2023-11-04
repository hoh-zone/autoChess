import { Box, Center, HStack, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { SellButton } from "../control/SellButton"
import CharInstruction from "../CharInstruction"

export const MainScene = () => {
  return (
    <div className="h-[75%] w-full relative">
      <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
        <source src="bg4.mp4" type="video/mp4" />
      </video>
      <HStack className="absolute top-0 p-8 w-full h-3/4 justify-around" align={"center"}>
        {/* left side */}
        <Center className="w-full h-full relative px-32">
          <HStack className="w-full justify-around mt-32">
            <Slot id={5} />
            <Slot id={4} />
            <Slot id={3} />
            <Slot id={2} />
            <Slot id={1} />
            <Slot id={0} />
          </HStack>
          <Stack className="absolute top-0 left-0">
            <SellButton />
            <CharInstruction />
          </Stack>
        </Center>
      </HStack>
    </div>
  )
}
