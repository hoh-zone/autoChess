import { Box, Center, HStack, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { SellButton } from "../control/SellButton"
import CharInstruction from "../CharInstruction"
import { useAtom } from "jotai"
import { assetsAtom } from "../../store/stages"
import { RefreshButton } from "../control/RefreshButton"

export const MainScene = () => {
  const [assets, setAssets] = useAtom(assetsAtom)

  return (
    <div className="h-full w-full relative">
      <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
        <source src={assets?.bg_shop} type="video/mp4" />
      </video>
      <Stack className="absolute top-[25%] left-10 z-10">
        <CharInstruction />
        <RefreshButton />
        <SellButton />
      </Stack>
      <HStack className="absolute bottom-[-30px] p-8 w-full h-3/4 justify-around" align={"center"}>
        <Center className="w-full h-full relative px-32">
          <HStack className="w-[85%] justify-around mt-[120px] z-[99]">
            <Slot id={5} />
            <Slot id={4} />
            <Slot id={3} />
            <Slot id={2} />
            <Slot id={1} />
            <Slot id={0} />
          </HStack>
        </Center>
      </HStack>
    </div>
  )
}
