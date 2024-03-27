import { useAtom } from "jotai"
import { chessId, enemyCharacter, stageAtom, winA, loseA, slotCharacter, operationsA, enemyNameA, challengeWinA, challengeLoseA, metaA } from "../store/stages"
import useOperateAndMatch from "./button/OperateAndMatch"
import useQueryFight from "./button/QueryFightResult"
import { useFight } from "../hooks/useFight"
import { useEffect } from "react"
import { Button, useToast } from "@chakra-ui/react"
import { get_chars } from "./character/rawData"
import { CharacterFields } from "../types/nft"

export const Fight = () => {
  const { nftObjectId, operate_submit } = useOperateAndMatch()
  const { query_fight } = useQueryFight()
  const [enemyName, setEnemyName] = useAtom(enemyNameA)
  const [enemyChars, setEnemyChars] = useAtom(enemyCharacter)
  const [chars, setChars] = useAtom(slotCharacter)
  const [operations, setOperations] = useAtom(operationsA)
  const [stage, setStage] = useAtom(stageAtom)
  const [chess_id] = useAtom(chessId)
  const [win, _setWin] = useAtom(winA)
  const [lose, _setLose] = useAtom(loseA)
  const [meta, _setMeta] = useAtom(metaA)
  const [challengeWin, _setChallengeWin] = useAtom(challengeWinA)
  const [challengeLose, _setChallengeLose] = useAtom(challengeLoseA)
  const toast = useToast()

  const fight = useFight()

  // for test
  const init_chars = () => {
    let chars_names = ["archer3", "shinobi3", "ani1", "ani3"]
    let enemy_names = ["priest3", "priest3", "priest2", "archer2"]
    let init_chars = get_chars(chars_names)
    let init_enemys = get_chars(enemy_names)
    chars.map((chr, index) => {
      chars[index] = init_chars[index]
    })
    enemyChars.map((chr, index) => {
      enemyChars[index] = init_enemys[index]
    })
  }
  useEffect(() => {
    if (stage === "fight") {
      fight()
    }
  }, [stage])

  return (
    <>
      {stage === "shop" && (
        <Button
          className=""
          onClick={async () => {
            if (lose >= 3 || challengeLose >= 3) {
              toast({
                title: "The game ends with 3 loses",
                status: "warning",
                duration: 2000,
                isClosable: true
              })
              return
            }

            let debug = false
            let json
            if (debug) {
              json = await query_fight(chess_id, win - 1, lose)
            } else {
              json = await operate_submit(operations, meta)
              setOperations([])
              if (!json) {
                return
              }
            }
            let enemys: CharacterFields[] = json["v2_lineup"]["roles"]
            enemys.map((ele) => {
              ele.sp = 0
              ele.hp = Number(ele.hp)
              ele.max_hp = Number(ele.hp)
              ele.attack = Number(ele.attack)
            })
            let name = json["v2_name"]
            setEnemyName(name)
            setEnemyChars(enemys)
            setStage("fight")
          }}
        >
          {" "}
          Fight{" "}
        </Button>
      )}
    </>
  )
}
