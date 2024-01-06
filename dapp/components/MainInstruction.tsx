import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, Box } from "@chakra-ui/react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, EffectCards } from "swiper/modules"
import { assetsAtom } from "../store/stages"
import { useAtom } from "jotai"

export const Instruction = () => {
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
              <Swiper modules={[Navigation, EffectCards]} navigation effect="flip" className="w-full h-full relative">
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) => (
                    <>
                      <div className="w-full h-full relative px-[60px]">
                        <div className={`w-full h-full relative overflow-y-auto rounded-[8px] text-white px-[20px] py-[20px] ${isActive ? "bg-slate-500" : "bg-slate-600"}`}>
                          <p className="text-[length:var(--chakra-fontSizes-md)]">|Normal Mode|: practice and construct your lineup to fight with different players, your enemy would be other players’ past lineup records.</p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">|Arena Mode|: you have to pay some SUI ticket fee to enter, and you can check out to get rewards at anytime, the checkout reward depends on your fighting winning records, so try to win to get earn more sui. The more you pay, the more you win. Averagely, winning at three times would cover the cost.</p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">|How to play|: Every turn, you will have 10 coins to buy your charactors, different charactors own its specific feature, try to use it to gain advantage.</p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">|Problem Feedback|: suiautochess@gmail.com</p>
                        </div>
                      </div>
                    </>
                  )}
                </SwiperSlide>
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
