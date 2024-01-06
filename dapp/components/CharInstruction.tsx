import { Text, Button, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, HStack, Box } from "@chakra-ui/react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, EffectCards } from "swiper/modules"
import { useAtom } from "jotai"
import { assetsAtom } from "../store/stages"

const CharInstruction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [assets, setAssets] = useAtom(assetsAtom)

  return (
    <>
      <Button onClick={onOpen}>Instruction</Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isCentered={true}>
        <ModalOverlay />
        <ModalContent className="w-[60vw] h-[70vh] !max-w-[60vw] !bg-transparent !shadow-none instruction-styled-modal">
          <ModalBody className="!overflow-hidden">
            <div className="w-full h-full relative">
              <Swiper
                modules={[Navigation, EffectCards]} navigation effect="flip" className="w-full h-full relative">
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) => (
                    isActive ? <Box p={8} >
                      <HStack>
                        <Text color={"white"} fontSize={"2xl"} whiteSpace={"nowrap"}>Buy: </Text>
                      </HStack>
                      <video style={{ objectFit: "contain" }} className="w-full h-full" autoPlay loop muted>
                        <source src={assets?.tutorial_buy} type="video/mp4" />
                      </video>
                    </Box> : ""
                  )}
                </SwiperSlide>
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) => (
                    isActive ? <Box p={8} >
                      <HStack>
                        <Text color={"white"} fontSize={"2xl"} whiteSpace={"nowrap"}>Level Up: </Text>
                        <Text color={"white"} fontSize={"xs"}>Merge 3 same characters to level up </Text>
                      </HStack>
                      <video style={{ objectFit: "contain" }} className="w-full h-full" autoPlay loop muted>
                        <source src={assets?.tutorial_level_up} type="video/mp4" />
                      </video>
                    </Box> : ""
                  )}
                </SwiperSlide>
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) => (
                    isActive ? <Box p={8} >
                      <HStack>
                        <Text color={"white"} fontSize={"2xl"} whiteSpace={"nowrap"}>Fight: </Text>
                      </HStack>
                      <video style={{ objectFit: "contain" }} className="w-full h-full" autoPlay loop muted>
                        <source src={assets?.tutorial_fight} type="video/mp4" />
                      </video>
                    </Box> : ""
                  )}
                </SwiperSlide>
              </Swiper>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CharInstruction
