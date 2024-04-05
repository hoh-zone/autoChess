import { useAtom } from "jotai"
import { chessId, enemyCharacter, stageAtom, winA, loseA, slotCharacter, operationsA, enemyNameA, challengeWinA, challengeLoseA, metaA } from "../store/stages"
import useOperateAndMatch from "./button/OperateAndMatch"
import useQueryFight from "./button/QueryFightResult"
import { useFight } from "../hooks/useFight"
import { useEffect } from "react"
import { Button, useToast } from "@chakra-ui/react"
import { get_chars } from "./character/rawData"
import { CharacterFields } from "../types/nft"
import useLocale from "../hooks/useLocale"

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
  const getLocale = useLocale()

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
                title: getLocale("The-game-ends"),
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
              // json = await operate_submit(operations, meta)
              json = {
                // 我方测试阵容
                v1_lineup: {
                  roles: [
                    {
                      attack: 16,
                      class: "ani3",
                      effect: "reduce_tmp_attack",
                      effect_type: "skill",
                      effect_value: "9",
                      gold_cost: 3,
                      hp: 60,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 9,
                      max_hp: 60,
                      attacking: 0
                    },
                    {
                      attack: 8,
                      class: "shinobi2_1",
                      effect: "attack_by_hp_percent",
                      effect_type: "skill",
                      effect_value: "4",
                      gold_cost: 3,
                      hp: 24,
                      level: 6,
                      sp: 0,
                      sp_cap: 2,
                      speed: 9,
                      max_hp: 24,
                      attacking: 0
                    },
                    {
                      attack: 12,
                      class: "assa2_1",
                      effect: "attack_lowest_hp",
                      effect_type: "skill",
                      effect_value: "12",
                      gold_cost: 3,
                      hp: 15,
                      level: 6,
                      sp: 0,
                      sp_cap: 2,
                      speed: 12,
                      max_hp: 15,
                      attacking: 0
                    },
                    {
                      attack: 12,
                      class: "cleric3",
                      effect: "add_all_tmp_attack",
                      effect_type: "skill",
                      effect_value: "4",
                      gold_cost: 3,
                      hp: 37,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 10,
                      max_hp: 37,
                      attacking: 0
                    },
                    {
                      attack: 16,
                      class: "golem3",
                      effect: "add_all_tmp_sp",
                      effect_type: "skill",
                      effect_value: "1",
                      gold_cost: 3,
                      hp: 60,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 13,
                      max_hp: 60,
                      attacking: 0
                    },
                    {
                      attack: 24,
                      class: "kunoichi3",
                      effect: "attack_sputter_to_second_by_percent",
                      effect_type: "skill",
                      effect_value: "5",
                      gold_cost: 3,
                      hp: 45,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 12,
                      max_hp: 45,
                      attacking: 0
                    }
                  ]
                },
                // 敌方测试阵容
                v2_lineup: {
                  roles: [
                    {
                      attack: 8,
                      class: "ani2_1",
                      effect: "reduce_tmp_attack",
                      effect_type: "skill",
                      effect_value: "6",
                      gold_cost: 3,
                      hp: 24,
                      level: 6,
                      sp: 0,
                      sp_cap: 2,
                      speed: 8,
                      max_hp: 24,
                      attacking: 0
                    },
                    {
                      attack: 24,
                      class: "archer3",
                      effect: "attack_last_char",
                      effect_type: "skill",
                      effect_value: "12",
                      gold_cost: 3,
                      hp: 45,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 12,
                      max_hp: 45,
                      attacking: 0
                    },
                    {
                      attack: 20,
                      class: "tree3",
                      effect: "reduce_tmp_attack",
                      effect_type: "skill",
                      effect_value: "9",
                      gold_cost: 3,
                      hp: 50,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 10,
                      max_hp: 50,
                      attacking: 0
                    },
                    {
                      attack: 12,
                      class: "kunoichi2_1",
                      effect: "attack_sputter_to_second_by_percent",
                      effect_type: "skill",
                      effect_value: "5",
                      gold_cost: 3,
                      hp: 18,
                      level: 6,
                      sp: 0,
                      sp_cap: 2,
                      speed: 10,
                      max_hp: 18,
                      attacking: 0
                    },
                    {
                      attack: 16,
                      class: "mega3",
                      effect: "aoe",
                      effect_type: "skill",
                      effect_value: "16",
                      gold_cost: 3,
                      hp: 50,
                      level: 9,
                      sp: 0,
                      sp_cap: 1,
                      speed: 10,
                      max_hp: 50,
                      attacking: 0
                    },
                    {
                      attack: 6,
                      class: "priest2_1",
                      effect: "all_max_hp_to_back1",
                      effect_type: "skill",
                      effect_value: "8",
                      gold_cost: 3,
                      hp: 24,
                      level: 6,
                      sp: 0,
                      sp_cap: 3,
                      speed: 6,
                      max_hp: 24,
                      attacking: 0
                    }
                  ]
                }
              }
              setOperations([])
              if (!json) {
                return
              }
            }
            let enemys: CharacterFields[] = json["v2_lineup"]["roles"]
            let mychars: CharacterFields[] = json["v1_lineup"]["roles"]
            enemys.map((ele) => {
              ele.sp = 0
              ele.hp = Number(ele.hp)
              ele.max_hp = Number(ele.hp)
              ele.attack = Number(ele.attack)
            })
            let name = json["v2_name"]
            setEnemyName(name)
            setEnemyChars(enemys)
            setChars(mychars)
            setStage("fight")
          }}
        >
          {" "}
          {getLocale("Fight")}{" "}
        </Button>
      )}
    </>
  )
}
