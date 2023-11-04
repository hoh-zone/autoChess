import { useEffect, useState } from "react"
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, EffectCards } from "swiper/modules"

export const Instruction = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Instruction</Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isCentered={true}>
        <ModalOverlay />
        <ModalContent className="w-[60vw] !max-w-[60vw] !bg-transparent">
          <ModalBody className="!overflow-hidden">
            <div className="w-full h-full">
              <Swiper modules={[Navigation, EffectCards]} navigation effect="cards">
                <SwiperSlide>
                  <div className="px-[60px]">
                    <div className="bg-slate-600 rounded-[8px] text-white px-[20px] py-[20px]">
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|How to play|: Every chess, you will have 10 coins to buy your charactors, different charactors own its specific feature, try to use it to gain advantage.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Level up|: charactors can compose to level up, 3 one-star can be combined into a two-star character, 3 two-stars can be combined into a three-star character.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Normal Mode|: practice and construct your lineup to fight with different players, your enemy would be other players’ past lineup records.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Arena Mode|: you have to pay 1 sui ticket fee to enter, and you can check out to get rewards at anytime, the checkout reward depends on your fighting winning records, so try to win to get earn more sui.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Problem Feedback|: suiautochess@gmail.com</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="px-[60px]">
                    <div className="bg-slate-600 rounded-[8px]  text-white px-[20px] py-[20px]">
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|How to play|: Every chess, you will have 10 coins to buy your charactors, different charactors own its specific feature, try to use it to gain advantage.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Level up|: charactors can compose to level up, 3 one-star can be combined into a two-star character, 3 two-stars can be combined into a three-star character.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Normal Mode|: practice and construct your lineup to fight with different players, your enemy would be other players’ past lineup records.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Arena Mode|: you have to pay 1 sui ticket fee to enter, and you can check out to get rewards at anytime, the checkout reward depends on your fighting winning records, so try to win to get earn more sui.</p>
                      <br />
                      <p className="text-[length:var(--chakra-fontSizes-md)]">|Problem Feedback|: suiautochess@gmail.com</p>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
