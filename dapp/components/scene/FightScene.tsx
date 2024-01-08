import { Button, HStack, Modal, ModalBody, Text, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Link, Icon } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { useAtom } from "jotai"
import { assetsAtom, enemyCharacter, slotCharacter, winA, fightResultModalVisibleAtom, stageAtom, fightResultEffectA, loseA } from "../../store/stages"
import { twMerge } from "tailwind-merge"
import range from "lodash/range"
import { FightResultText } from "../effect/FightResultText"
import { useMemo } from "react"
import { useScale } from "../../hooks/useScreenSize"

export const FightScene = () => {
  const [enemyChars, setEnemyChars] = useAtom(enemyCharacter)
  const [chars, setChars] = useAtom(slotCharacter)
  const charIndex = chars.findIndex(Boolean)
  const enemyIndex = enemyChars.findIndex(Boolean)
  const [assets, setAssets] = useAtom(assetsAtom)
  const [fightResultModalVisible, setFightResultModalVisible] = useAtom(fightResultModalVisibleAtom)
  const [fightResult, setFightResult] = useAtom(fightResultEffectA)
  const [stage, setStage] = useAtom(stageAtom)
  const [win, _setWin] = useAtom(winA)
  const [lose, _setLose] = useAtom(loseA)
  const scale = useScale()

  const videoBg = useMemo(() => {
    return "bg" + (Math.floor((win + lose) / 3) % 3 || 1)
  }, [])
  // @ts-ignore
  const positionTable: any = positionTables[videoBg] || positionTables.bg1

  const onClose = () => {
    setFightResultModalVisible(false)
    setStage("shop")
    setFightResult(null)
  }

  return (
    <div className="h-full w-full relative">
      <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
        <source src={assets?.[videoBg] || assets?.bg1} type="video/mp4" />
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
        <ModalContent className="!bg-slate-500 !rounded-[8px] !w-[440px] !max-w-[440px]">
          <ModalBody className="w-[440px] !max-w-[440px]">
            <div className="mx-[10px] my-[20px]">
              <FightResultText />
            </div>
            <Text color={"gray.300"}>Win more than 10 turns to fight with Leaderboard and earn more rewards.</Text>
            <Text display={"inline"} fontSize={"2xl"}>👉</Text><Link color={"blue.300"} href="https://home.autochess.app/#leaderboard" isExternal> Check Leaderboard</Link>
          </ModalBody>

          <ModalFooter className="flex !justify-center">
            <Button colorScheme="blue" onClick={onClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

const positionTables = {
  bg1: {
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
  },
  bg2: {
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
  },
  bg3: {
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
}
