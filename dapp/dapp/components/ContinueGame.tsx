import { Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Center, HStack, Stack, VStack, useToast, Checkbox, CheckboxGroup } from "@chakra-ui/react"
import useQueryChesses from "./button/QueryAllChesses"
import { SetStateAction, useEffect, useState } from "react"
import { useSyncGameNFT } from "../hooks/useSyncGameNFT"
import { useAtom } from "jotai"
import { operationsA, stageAtom } from "../store/stages"
import useCheckout from "./button/CheckoutChess"
import { ethos } from "ethos-connect"
import useLocale from "../hooks/useLocale"

const ContinueGame = (props: { isLoading: boolean }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { status, wallet } = ethos.useWallet()
  const { nfts, query_chesses } = useQueryChesses()
  const syncGameNFT = useSyncGameNFT()
  const [stage, setStage] = useAtom(stageAtom)
  const [operations, setOperations] = useAtom(operationsA)
  const { checkout } = useCheckout()
  const [isLoading, setIsLoading] = useState(false)
  const [check_Items, set_Check_Items] = useState([])
  const getLocale = useLocale()
  
  const chckFn = (values: any) => {
    set_Check_Items(values)
  }
  let toastId: any = null
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

  const closeToast = () => {
    toast.close(toastId)
    toastId = null
  }
  const showToast = () => {
    if (toastId !== null) {
      return
    }
    toastId = toast({
      title: getLocale('You-can-redeem-sui-as-rewards'),
      status: "warning",
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <>
      <Button isLoading={props.isLoading} onClick={onOpen}>
        {getLocale('Continue-Game')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxWidth={500} className="rounded-[8px]" bg={"gray.500"} overflowY={"auto"} maxH={"50vh"}>
          <ModalBody maxWidth={500} className="!p-[10px] rounded-[8px]">
            {nfts.length == 0 && <Text>{getLocale('no-records')}</Text>}
            {nfts.length > 0 && (
              <Stack gap={4}>
                <>
                  <HStack>
                    <Text>{getLocale('Filters')}: </Text>
                    <CheckboxGroup colorScheme="pink" defaultValue={["opt1"]} value={check_Items} onChange={chckFn}>
                      <Checkbox value="opt1" colorScheme="blue">
                        {getLocale('Include-Checked')}
                      </Checkbox>
                    </CheckboxGroup>
                  </HStack>
                  {nfts.map((nft, index) => {
                    if (check_Items.length == 0 && ((!nft.arena && nft.lose < 3) || !nft.arena_checked)) {
                      return (
                        <HStack className="w-full" key={index}>
                          <Button
                            key={nft.id.id}
                            height={"unset"}
                            className="w-full bg-slate-200 py-4 h-fit"
                            fontSize={"x-small"}
                            isDisabled={nft.lose == 3 || nft.challenge_lose == 3}
                            onClick={async () => {
                              syncGameNFT(nft)
                              setStage("shop")
                              setOperations([])
                            }}
                          >
                            <Stack gap={2}>
                              <p className="text-slate-800" style={{ whiteSpace: "pre-wrap" }}>
                                {getLocale('Name')}: {nft.name} {nft.arena ? getLocale('Arena') : ""}
                              </p>
                              <p className="text-slate-800">{getLocale('Mode')}: {!nft.arena ? getLocale('free') : getLocale('arena')}</p>
                              <p className="text-slate-800">
                                {nft.win} {getLocale('win')}, {nft.lose} {getLocale('lose')}
                              </p>
                            </Stack>
                          </Button>
                          {nft.arena && (
                            <Button
                              height={"unset"}
                              className="w-1/2 py-4 h-fit"
                              fontSize={"x-small"}
                              isDisabled={nft.arena_checked}
                              style={{ backgroundColor: nft.arena_checked ? "gray" : "yellow" }}
                              onMouseOver={() => {
                                showToast()
                              }}
                              onMouseLeave={() => {
                                closeToast()
                              }}
                              onClick={() => {
                                checkout({ chess_id: nft.id.id, fun: fetch })
                                onClose()
                              }}
                            >
                              <VStack>
                                {!nft.arena_checked && (
                                  <>
                                    <p>{getLocale('Redeem')}</p>
                                    <p>Sui</p>
                                  </>
                                )}
                                {nft.arena_checked && <p>{getLocale('Checked')}</p>}
                              </VStack>
                            </Button>
                          )}
                        </HStack>
                      )
                    } else if (check_Items.length == 1) {
                      return (
                        <HStack className="w-full" key={index}>
                          <Button
                            key={nft.id.id}
                            height={"unset"}
                            className="w-full bg-slate-200 py-4 h-fit"
                            fontSize={"x-small"}
                            isDisabled={nft.lose == 3 || nft.challenge_lose == 3}
                            onClick={async () => {
                              syncGameNFT(nft)
                              setStage("shop")
                              setOperations([])
                              // todo: operations.push(chars.toString());
                            }}
                          >
                            <Stack gap={2}>
                              <p className="text-slate-800" style={{ whiteSpace: "pre-wrap" }}>
                                {getLocale('Name')}: {nft.name} {nft.arena ? getLocale('Arena') : ""}
                              </p>
                              <p className="text-slate-800">{getLocale('Mode')}: {!nft.arena ? getLocale('free') : getLocale('arena')}</p>
                              <p className="text-slate-800">
                                {nft.win} {getLocale('win')}, {nft.lose} {getLocale('lose')}
                              </p>
                            </Stack>
                            {/* {"name: " + nft.name + " " + (!nft.arena ? "normal: " : "arena: ") + nft.win + " - " + nft.lose} */}
                          </Button>
                          {nft.arena && (
                            <Button
                              height={"unset"}
                              className="w-1/2 py-4 h-fit"
                              fontSize={"x-small"}
                              isDisabled={nft.arena_checked}
                              style={{ backgroundColor: nft.arena_checked ? "gray" : "yellow" }}
                              onMouseOver={() => {
                                showToast()
                              }}
                              onMouseLeave={() => {
                                closeToast()
                              }}
                              onClick={() => {
                                checkout({ chess_id: nft.id.id, fun: fetch })
                                onClose()
                              }}
                            >
                              <VStack>
                                {!nft.arena_checked && (
                                  <>
                                    <p>{getLocale('Redeem')}</p>
                                    <p>Sui</p>
                                  </>
                                )}
                                {nft.arena_checked && <p>{getLocale('Checked')}</p>}
                              </VStack>
                            </Button>
                          )}
                        </HStack>
                      )
                    }
                  })}
                </>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContinueGame
