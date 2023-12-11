import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { useAtom } from "jotai"
import { assetsAtom, enemyCharacter, slotCharacter, winA, fightResultModalVisibleAtom, stageAtom, fightResultEffectA } from "../../store/stages"
import { twMerge } from "tailwind-merge"
import range from "lodash/range"
import { FightResultText } from "../effect/FightResultText"

const positionTables = {
  bg10: {
    0: "right-0 top-0",
    1: "right-[15%] bottom-[15%]",
    2: "right-[30%] top-[15%]",
    3: "right-[40%] bottom-[25%]",
    4: "right-[50%] top-[10%]",
    5: "right-[65%] bottom-[20%]",
    10: "left-0 top-0",
    11: "left-[15%] bottom-[15%]",
    12: "left-[30%] top-[15%]",
    13: "left-[40%] bottom-[25%]",
    14: "left-[50%] top-[10%]",
    15: "left-[65%] bottom-[20%]"
  }
}

const positionTable: { [key: string]: string } = {
  0: "right-[27%] bottom-[14%]",
  1: "right-[50%] bottom-[14%]",
  2: "right-[68%] bottom-[18%]",
  3: "right-[18%] bottom-[5%]",
  4: "right-[35%] bottom-[5%]",
  5: "right-[65%] bottom-[5%]",
  10: "left-[18%] bottom-[5%]",
  11: "left-[28%] bottom-[14%]",
  12: "left-[40%] bottom-[5%]",
  13: "left-[50%] bottom-[12%]",
  14: "left-[64%] bottom-[5%]",
  15: "left-[72%] bottom-[18%]",
  currentCharPosition: "right-[4%] bottom-[14%]",
  currentEnemyPosition: "left-[4%] bottom-[14%]"
}

export const FightScene = () => {
  const [enemyChars, setEnemyChars] = useAtom(enemyCharacter)
  const [chars, setChars] = useAtom(slotCharacter)
  const charIndex = chars.findIndex(Boolean)
  const enemyIndex = enemyChars.findIndex(Boolean)
  const [assets, setAssets] = useAtom(assetsAtom)
  const [fightResultModalVisible, setFightResultModalVisible] = useAtom(fightResultModalVisibleAtom)
  const [fightResult, setFightResult] = useAtom(fightResultEffectA);
  const [stage, setStage] = useAtom(stageAtom);

  const [win] = useAtom(winA)
  const get_video_bg = () => {
    let index = win + 1
    if (index > 8) {
      index == 8
    }
    return "bg" + index + ".mp4"
  }

  const onClose = () => {
    setFightResultModalVisible(false)
    setStage("shop");
    setFightResult(null);
  }

  return (
    <div className="h-full w-full relative">
      <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
        <source src={assets?.bg10} type="video/mp4" />
      </video>
      <HStack className="absolute top-[10%] p-8 w-full justify-around">
        <StatusBar isOpponent={false}></StatusBar>
        <StatusBar isOpponent={true}></StatusBar>
      </HStack>
      <HStack className="absolute w-full h-full bottom-0">
        <div className="w-1/2 h-full relative">
          {range(0, 7).map((id) => (
            <div key={id} className={twMerge("absolute transition-all duration-500", charIndex === id ? positionTable.currentCharPosition : positionTable[id])}>
              <Slot id={id} />
            </div>
          ))}
        </div>

        <div className="w-1/2 h-full relative">
          {range(10, 17).map((id) => (
            <div key={id} className={twMerge("absolute transition-all", enemyIndex + 10 === id ? positionTable.currentEnemyPosition : positionTable[id])}>
              <Slot id={id} isOpponent={true} />
            </div>
          ))}
        </div>
      </HStack>

      <Modal isOpen={fightResultModalVisible} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent className="!bg-slate-500 !rounded-[8px] !w-[240px] !max-w-[240px]">
          <ModalBody className="w-[240px] !max-w-[240px]">
            <div className="mx-[10px] my-[20px]">
              <FightResultText />
            </div>
          </ModalBody>

          <ModalFooter className="flex !justify-center">
            <Button colorScheme='blue' onClick={onClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
