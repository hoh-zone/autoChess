import { Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, HStack, Stack, useToast } from "@chakra-ui/react"
import useQueryChesses from "./button/QueryAllChesses"
import { useSyncGameNFT } from "../hooks/useSyncGameNFT"
import { useAtom } from "jotai"
import { operationsA, slotCharacter, stageAtom } from "../store/stages"
import useMintChess from "./button/MintChess"
import { useState } from "react"
import { sleep } from "../utils/sleep"

const StartGameButtons = ({ name }: { name: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { nftObjectId, mint } = useMintChess()
  const { nfts, query_chesses } = useQueryChesses()
  const syncGameNFT = useSyncGameNFT()
  const [stage, setStage] = useAtom(stageAtom)
  const [operations, setOperations] = useAtom(operationsA)
  const [chars, setChars] = useAtom(slotCharacter)
  const [isLoading, setIsLoading] = useState(false)

  const checkName = () => {
    if (name === "") {
      toast({
        title: "Please enter your name",
        status: "warning",
        duration: 2000,
        isClosable: true
      })
      return false
    }
    return true
  }

  const onStart = async (isArena: boolean, price: number) => {
    try {
      setIsLoading(true)
      await mint({ username: name, is_arena: isArena, price })
      await sleep(2000)

      const nfts = await query_chesses()
      nfts &&
        nfts.map((nft, index) => {
          if (nft.name == name) {
            syncGameNFT(nft)
            setStage("shop")
            setOperations([])
            operations.push(chars.toString())
          }
        })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <Button isLoading={isLoading} onClick={() => checkName() && onStart(false, 0)}>
        Practice Mode
      </Button>

      <Button onClick={() => checkName() && onOpen()} isLoading={isLoading}>
        Arena Mode (Earn Sui)
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-[8px]" bg={"gray.500"} overflowY={"auto"} maxH={"50vh"}>
          <ModalBody className="!p-[10px] rounded-[8px]">
            <Stack>
              <Text w={"full"} textAlign={"center"} mb={4} color={"green.200"} fontSize={"lg"}>
                Cost more, earn more
              </Text>
              {[1, 10, 50, 100, 250, 500].map((amount, index) => (
                <HStack className="w-full" key={index}>
                  <Button
                    w={"full"}
                    key={amount}
                    onClick={() => {
                      onClose()
                      onStart(true, amount)
                    }}
                  >
                    {amount} SUI
                  </Button>
                </HStack>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default StartGameButtons
