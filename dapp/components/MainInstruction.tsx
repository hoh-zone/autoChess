import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, Box } from "@chakra-ui/react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, EffectCards } from "swiper/modules"
import { assetsAtom } from "../store/stages"
import { useAtom } from "jotai"
import useLocale from "../hooks/useLocale"

export const Instruction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [assets, setAssets] = useAtom(assetsAtom)
  const getLocale = useLocale()

  return (
    <>
      <Button onClick={onOpen}>{getLocale("Instruction")}</Button>

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
                          <p className="text-[length:var(--chakra-fontSizes-md)]">
                            {getLocale("Normal-Mode")}: {getLocale("Normal-Mode-text")}
                          </p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">
                            {getLocale("Arena-Mode")}: {getLocale("Arena-Mode-text")}
                          </p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">
                            {getLocale("How-to-play")}: {getLocale("How-to-play-text")}
                          </p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">{getLocale("Problem-Feedback")}: suiautochess@gmail.com</p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">{getLocale("update-info")}</p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">{getLocale("update-info1")}</p>
                          <br />
                          <p className="text-[length:var(--chakra-fontSizes-md)]">{getLocale("update-info2")}</p>
                          <br />
                        </div>
                      </div>
                    </>
                  )}
                </SwiperSlide>
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) =>
                    isActive ? (
                      <Box p={8}>
                        <HStack>
                          <Text color={"white"} fontSize={"2xl"} whiteSpace={"nowrap"}>
                            {getLocale("Buy")}:{" "}
                          </Text>
                        </HStack>
                        <video style={{ objectFit: "contain" }} className="w-full h-full" autoPlay loop muted>
                          <source src={assets?.tutorial_buy} type="video/mp4" />
                        </video>
                      </Box>
                    ) : (
                      ""
                    )
                  }
                </SwiperSlide>
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) =>
                    isActive ? (
                      <Box p={8}>
                        <HStack>
                          <Text color={"white"} fontSize={"2xl"} whiteSpace={"nowrap"}>
                            {getLocale("Level-Up")}:{" "}
                          </Text>
                          <Text color={"white"} fontSize={"xs"}>
                            {getLocale("Merge-to-level-up")}
                          </Text>
                        </HStack>
                        <video style={{ objectFit: "contain" }} className="w-full h-full" autoPlay loop muted>
                          <source src={assets?.tutorial_level_up} type="video/mp4" />
                        </video>
                      </Box>
                    ) : (
                      ""
                    )
                  }
                </SwiperSlide>
                <SwiperSlide className="!shadow-none">
                  {({ isActive }) =>
                    isActive ? (
                      <Box p={8}>
                        <HStack>
                          <Text color={"white"} fontSize={"2xl"} whiteSpace={"nowrap"}>
                            {getLocale("Fight")}:{" "}
                          </Text>
                        </HStack>
                        <video style={{ objectFit: "contain" }} className="w-full h-full" autoPlay loop muted>
                          <source src={assets?.tutorial_fight} type="video/mp4" />
                        </video>
                      </Box>
                    ) : (
                      ""
                    )
                  }
                </SwiperSlide>
              </Swiper>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
