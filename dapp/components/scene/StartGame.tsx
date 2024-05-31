import { Box, Button, Center, HStack, Input, Spacer, Stack, VStack } from "@chakra-ui/react"
import { assetsAtom, metaA } from "../../store/stages"
import { useAtom } from "jotai"
import { Character } from "../character/character"
import useQueryChesses from "../transactions/QueryAllChesses"
import useQueryMetaInfo from "../transactions/QueryMetaInfo"
import { useEffect, useState, useContext } from "react"
import { ethos, SignInButton } from "ethos-connect"
import { Rank } from "../Rank"
import { motion } from "framer-motion"
import { Instruction } from "../MainInstruction"
import ContinueGame from "../ContinueGame"
import ChangeLang from "../ChangeLang"
import Register from "../Register"
import MyAccountInfo from "../MyAccountInfo"
import StartGameButtons from "../StartGameButtons"
import useLocale from "../../hooks/useLocale"

export const StartGame = () => {
  const [inputValue, setInputValue] = useState("")
  const { nfts, query_chesses } = useQueryChesses()
  const { query_meta_info, clone_meta } = useQueryMetaInfo()
  const { status, wallet } = ethos.useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [assets, setAssets] = useAtom(assetsAtom)
  const [meta, setMeta] = useAtom(metaA)
  const getLocale = useLocale()

  const fetch = async () => {
    setIsLoading(true)
    setMeta(await query_meta_info())
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
            <source src={assets?.bg1} type="video/mp4" />
          </video>
          {wallet ? (
            <div className="absolute text-white z-50">
              <Stack className="items-center text-center" gap={4}>
                <div className="mb-4">
                  <motion.p initial={{ opacity: 0, scale: 0, y: "30px" }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1 }} style={{ marginBottom: "30px", fontSize: "80px" }}>
                    Sui Auto
                    <br />
                    Chess
                  </motion.p>
                  <VStack>
                    {!meta && <Register isLoading={isLoading} address={wallet.address} />}
                    {meta && meta.version == 1 && (
                      <Button
                        onClick={() => {
                          clone_meta(meta)
                        }}
                      >
                        Start Game
                      </Button>
                    )}
                    {meta && meta.version == 2 && <ContinueGame isLoading={isLoading} />}
                  </VStack>
                </div>
                {!isLoading && meta && meta.version == 2 && (
                  <Input type="text" className="custom-input" width={"300px"} value={inputValue} placeholder={getLocale("Enter-your-chess-name")!} onChange={(v) => setInputValue(v.target.value)} />
                )}
                {!isLoading && meta && meta.version == 2 && <StartGameButtons name={inputValue} />}
              </Stack>
            </div>
          ) : (
            <div className="absolute text-white bottom-80 z-50">
              <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                {getLocale("Connect")}
              </SignInButton>
               <Button>
                       Miao miao zk-login
               </Button>
            </div>
          )}
          <div className="absolute top-0 right-0 m-4">
            <ChangeLang />
          </div>
          <div className="absolute top-12 right-0 m-4">
            <Rank />
          </div>
          <div className="absolute top-0 left-0 m-4">
            <div>
              <Instruction />
            </div>
            {meta && meta.version == 2 && (
              <div className="mt-3">
                <MyAccountInfo metaInfo={meta} />
              </div>
            )}
          </div>
          <Spacer />
          <VStack className="w-4/5 absolute bottom-0" gap={0}>
            <HStack className="w-full flex justify-around h-24">
              <Character charType="assa" isOpponent={false} />
              <Character charType="tank" isOpponent={false} />
              <Character charType="shaman" isOpponent={true} />
              <Character charType="tree" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around h-24">
              {/* <Character charType="firemega" isOpponent={false} /> */}
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
