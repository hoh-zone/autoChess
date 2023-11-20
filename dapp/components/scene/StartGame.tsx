import { Button, Center, HStack, Input, Modal, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spinner, Stack, useToast, VStack } from "@chakra-ui/react"
import { operationsA, slotCharacterV2, stageAtom,assetsAtom } from "../../store/stages"
import { useAtom } from "jotai"
import useMintChess from "../button/MintChess"
import { Character } from "../character/character"
import useQueryChesses from "../button/QueryAllChesses"
import { useEffect, useState } from "react"
import { useSyncGameNFT } from "../../hooks/useSyncGameNFT"
import { ethos, SignInButton } from "ethos-connect"
import { Rank } from "../Rank"
import useCheckout from "../button/CheckoutChess"
import PopupWindow from "../dialog/CustomPopWindow"
import { motion } from "framer-motion"
import { Instruction } from "../MainInstruction"
import { getVw } from "../../utils"

export const StartGame = () => {
  const [chars, setChars] = useAtom(slotCharacterV2)
  const [stage, setStage] = useAtom(stageAtom)
  const { nftObjectId, mint } = useMintChess()
  const [inputValue, setInputValue] = useState("")
  const { nfts, query_chesses } = useQueryChesses()
  const { checkout } = useCheckout()
  const syncGameNFT = useSyncGameNFT()
  const { status, wallet } = ethos.useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [operations, setOperations] = useAtom(operationsA)
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
  const [isOpen, setIsOpen] = useState(false)
  const [checkout_id, setCheckout_id] = useState("")
  const openModal = (id: string) => {
    setCheckout_id(id)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const toast = useToast()
  return (
    <>
      <Center className="h-full w-full relative block">
        <>
          {/* todo video 可以改成高度大些的动态图片啥的 */}
          <video style={{ objectFit: "cover" }} className="w-full h-auto" autoPlay loop muted>
            <source src={assets?.bg7} type="video/mp4" />
          </video>
          {wallet ? (
            <div className="absolute text-white top-12 z-50">
              <Stack className="items-center text-center" gap={4}>
                <div className="mb-12">
                  <motion.p initial={{ opacity: 0, scale: 0, y: "-3.3vw" }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1 }} style={{ marginBottom: getVw(30), fontSize: getVw(100) }}>
                    Auto
                    <br />
                    Chess
                  </motion.p>
                  <Popover>
                    <PopoverTrigger>
                      <Button isLoading={isLoading}>Continue Game</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody p={0}>
                        {nfts.map((nft, index) => (
                          <Center className="w-full border-slate-400 mb-1" key={nft.id.id}>
                            <HStack className="w-full">
                              <Button
                                key={nft.id.id}
                                className="w-full bg-slate-200"
                                fontSize={"x-small"}
                                isDisabled={nft.lose == 3 || nft.win == 10}
                                onClick={async () => {
                                  syncGameNFT(nft)
                                  setStage("shop")
                                  setOperations([])
                                  // todo: operations.push(chars.toString());
                                }}
                              >
                                {"name: " + nft.name + " " + (!nft.arena ? "normal: " : "arena: ") + nft.win + " - " + nft.lose}
                              </Button>
                              {nft.arena && (
                                <Button className="bg-slate-200" style={{ fontSize: getVw(10) }} onClick={() => openModal(nft.id.id)}>
                                  Check Out
                                </Button>
                              )}
                              <PopupWindow isOpen={isOpen} ok={() => checkout({ chess_id: checkout_id })} cancel={closeModal} content_str="You can checkout to get sui rewards, the amuont depends on your winning records, are you sure to checkout now?" />
                            </HStack>
                          </Center>
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>

                <Input type="text" className="custom-input" width={getVw(300)} value={inputValue} placeholder="Enter your name" onChange={(v) => setInputValue(v.target.value)} />
                <Button
                  onClick={async () => {
                    if (inputValue == "") {
                      toast({
                        title: "Please enter your name",
                        status: "warning",
                        duration: 2000,
                        isClosable: true
                      })
                      return
                    }
                    await mint({ username: inputValue, is_arena: false })
                    setTimeout(async function () {
                      const nfts = await fetch()
                      nfts &&
                        nfts.map((nft, index) => {
                          if (nft.name == inputValue) {
                            syncGameNFT(nft)
                            setStage("shop")
                            setOperations([])
                            operations.push(chars.toString())
                          }
                        })
                    }, 2000)
                  }}
                >
                  Start New Chess
                </Button>
                <Button
                  onClick={async () => {
                    if (inputValue == "") {
                      toast({
                        title: "Please enter your name",
                        status: "warning",
                        duration: 2000,
                        isClosable: true
                      })
                      return
                    }
                    await mint({ username: inputValue, is_arena: true })
                    const nfts = await fetch()
                    nfts &&
                      nfts.map((nft, index) => {
                        if (nft.name == inputValue) {
                          syncGameNFT(nft)
                          setStage("shop")
                          setOperations([])
                          operations.push(chars.toString())
                        }
                      })
                  }}
                >
                  Start New Arena (To Earn)
                </Button>
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
          <VStack className="w-full absolute bottom-[5%]" gap={0}>
            <HStack className="w-full flex justify-around">
              <Character charType="archer" isOpponent={false} />
              <Character charType="shaman" isOpponent={false} />
              <Character charType="slime" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around pl-24">
              <Character charType="assa" isOpponent={false} />
              <Character charType="tank" isOpponent={false} />
              <Character charType="shaman" isOpponent={true} />
              <Character charType="tree" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around pr-12">
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
