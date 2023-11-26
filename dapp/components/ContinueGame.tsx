import { Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Center, HStack, Stack } from "@chakra-ui/react"
import useQueryChesses from "./button/QueryAllChesses"
import PopupWindow from "./dialog/CustomPopWindow"
import { getVh } from "../utils"
import { useEffect, useState } from "react"
import { useSyncGameNFT } from "../hooks/useSyncGameNFT"
import { useAtom } from "jotai"
import { operationsA, stageAtom } from "../store/stages"
import useCheckout from "./button/CheckoutChess"
import { ethos } from "ethos-connect"

const ContinueGame = (props: { isLoading: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { status, wallet } = ethos.useWallet()
  const { nfts, query_chesses } = useQueryChesses()
  const [isOpen$2, setIsOpen] = useState(false)
  const syncGameNFT = useSyncGameNFT()
  const [stage, setStage] = useAtom(stageAtom)
  const [operations, setOperations] = useAtom(operationsA)
  const { checkout } = useCheckout()
  const [checkout_id, setCheckout_id] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  const openModal = (id: string) => {
    setCheckout_id(id)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button isLoading={props.isLoading} onClick={onOpen}>
        Continue Game
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-[8px]" bg={"gray.500"} overflowY={"auto"} maxH={"50vh"}>
          <ModalBody className="!p-[10px] rounded-[8px]" >
            {nfts.length == 0 && <Text>no records</Text>}
            {nfts.length > 0 && <Stack gap={4}>
              {nfts.map((nft, index) => (
                <HStack className="w-full">
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
                    <Stack gap={2} >
                      <p className="text-slate-800">
                        Name: {nft.name} {nft.arena ? "(Arena)" : ""}
                      </p>
                      <p className="text-slate-800">
                        Mode: {(!nft.arena ? "free" : "arena")}
                      </p>
                      <p className="text-slate-800">
                        {nft.win} win, {nft.lose} lose
                      </p>
                    </Stack>
                    {/* {"name: " + nft.name + " " + (!nft.arena ? "normal: " : "arena: ") + nft.win + " - " + nft.lose} */}
                  </Button>
                  {nft.arena && (
                    <Button className="bg-slate-200" style={{ fontSize: getVh(10) }} onClick={() => openModal(nft.id.id)}>
                      Check Out
                    </Button>
                  )}
                  <PopupWindow
                    isOpen={isOpen$2}
                    ok={() => checkout({ chess_id: checkout_id })}
                    cancel={closeModal}
                    content_str="You can checkout to get sui rewards, the amount depends on your winning records, are you sure to checkout now?"
                  />
                </HStack>
              ))}
            </Stack>}

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContinueGame
