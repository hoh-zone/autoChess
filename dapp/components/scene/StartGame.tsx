import { Center, HStack, Input, Stack, VStack } from "@chakra-ui/react"
import { assetsAtom } from "../../store/stages"
import { useAtom } from "jotai"
import { Character } from "../character/character"
import useQueryChesses from "../button/QueryAllChesses"
import { useEffect, useState } from "react"
import { useSyncGameNFT } from "../../hooks/useSyncGameNFT"
import { ethos, SignInButton } from "ethos-connect"
import { Rank } from "../Rank"
import { motion } from "framer-motion"
import { Instruction } from "../MainInstruction"
import ContinueGame from "../ContinueGame"
import StartGameButtons from "../StartGameButtons"

export const StartGame = () => {
  const [inputValue, setInputValue] = useState("")
  const { nfts, query_chesses } = useQueryChesses()
  const syncGameNFT = useSyncGameNFT()
  const { status, wallet } = ethos.useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [assets, setAssets] = useAtom(assetsAtom)

  const fetch = async () => {
    setIsLoading(true)
    const result = await query_chesses()
    setIsLoading(false)
    return result
  }

  useEffect(() => {
    if (status !== "connected") return
    fetch()
  }, [status, query_chesses])

  return (
    <>
      <Center className="h-full w-full relative block">
        <>
          {/* todo video 可以改成高度大些的动态图片啥的 */}
          <video style={{ objectFit: "cover" }} className="w-full h-auto" autoPlay loop muted>
            <source src={assets?.bg7} type="video/mp4" />
          </video>
          {wallet ? (
            <div className="absolute text-white z-50">
              <Stack className="items-center text-center" gap={4}>
                <div className="mb-12">
                  <motion.p initial={{ opacity: 0, scale: 0, y: "30px" }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1 }} style={{ marginBottom: "30px", fontSize: "100px" }}>
                    Auto
                    <br />
                    Chess
                  </motion.p>

                  <ContinueGame isLoading={isLoading} />
                </div>

                <Input type="text" className="custom-input" width={"300px"} value={inputValue} placeholder="Enter your name" onChange={(v) => setInputValue(v.target.value)} />
                <StartGameButtons name={inputValue} />
              </Stack>
            </div>
          ) : (
            <div className="absolute text-white bottom-80 z-50">
              <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Connect</SignInButton>
            </div>
          )}
          <div className="absolute top-0 right-0 m-4">
            <Rank />
          </div>
          <div className="absolute top-0 left-0 m-4">
            <Instruction />
          </div>
          <VStack className="w-full absolute" gap={0}>
            <HStack className="w-full flex justify-around">
              <Character charType="archer" isOpponent={false} />
              <Character charType="shaman" isOpponent={false} />
              <Character charType="slime" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around">
              <Character charType="assa" isOpponent={false} />
              <Character charType="tank" isOpponent={false} />
              <Character charType="shaman" isOpponent={true} />
              <Character charType="tree" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around">
              <Character charType="firemega" isOpponent={false} />
              <Character charType="golem" isOpponent={false} />
              <Character charType="mega" isOpponent={true} />
              <Character charType="fighter" isOpponent={true} />
            </HStack>
          </VStack>
        </>
      </Center>
    </>
  )
}

export default StartGame
