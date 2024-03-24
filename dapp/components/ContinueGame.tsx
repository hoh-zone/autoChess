import { Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Center, HStack, Stack, VStack, useToast } from "@chakra-ui/react"
import useQueryChesses from "./button/QueryAllChesses"
import { useEffect, useState } from "react"
import { useSyncGameNFT } from "../hooks/useSyncGameNFT"
import { useAtom } from "jotai"
import { operationsA, stageAtom } from "../store/stages"
import useCheckout from "./button/CheckoutChess"
import { ethos } from "ethos-connect"

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
      title: "You can redeem sui as rewards, the amount depends on your winning records, are you sure to checkout now?",
      status: "warning",
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <>
      <Button isLoading={props.isLoading} onClick={onOpen}>
        Continue Game
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-[8px]" bg={"gray.500"} overflowY={"auto"} maxH={"50vh"}>
          <ModalBody className="!p-[10px] rounded-[8px]">
            {nfts.length == 0 && <Text>no records</Text>}
            {nfts.length > 0 && (
              <Stack gap={4}>
                {nfts.map((nft, index) => (
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
                        <p className="text-slate-800">
                          Name: {nft.name} {nft.arena ? "(Arena)" : ""}
                        </p>
                        <p className="text-slate-800">Mode: {!nft.arena ? "free" : "arena"}</p>
                        <p className="text-slate-800">
                          {nft.win} win, {nft.lose} lose
                        </p>
                      </Stack>
                      {/* {"name: " + nft.name + " " + (!nft.arena ? "normal: " : "arena: ") + nft.win + " - " + nft.lose} */}
                    </Button>
                    {nft.arena && (
                      <Button
                        height={"unset"}
                        className="w-1/2 py-4 h-fit"
                        fontSize={"x-small"}
                        style={{ backgroundColor: "yellow" }}
                        onMouseOver={() => {
                          showToast()
                        }}
                        onMouseLeave={() => {
                          closeToast()
                        }}
                        onClick={async () => {
                          await checkout({ chess_id: nft.id.id, fun: fetch })
                          onClose()
                          // fetch()
                        }}
                      >
                        <VStack>
                          <p>Redeem</p>
                          <p>Sui</p>
                        </VStack>
                      </Button>
                    )}
                  </HStack>
                ))}
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContinueGame
