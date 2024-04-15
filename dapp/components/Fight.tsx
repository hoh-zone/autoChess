import { useAtom } from "jotai"
import { chessId, enemyCharacter, stageAtom, winA, loseA, slotCharacter, operationsA, enemyNameA, challengeWinA, challengeLoseA, metaA } from "../store/stages"
import useOperateAndMatch from "./transactions/OperateAndMatch"
import useQueryFight from "./transactions/QueryFightResult"
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
              console.log("json", json)
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
                      effect_value: "2",
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
                      effect_value: "24",
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
                      sp_cap: 2,
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
            /*
            //7 test groups
            //group 1
            let my_classes1 = ["ani3", "shinobi2_1", "assa2_1", "cleric3", "golem3", "kunoichi3"]
            let enemy_classes1 = ["ani2_1", "archer3", "tree3", "kunoichi2_1", "mega3", "priest2_1"]
            //group 2
            let my_classes2 = ["kunoichi3", "wizard2_1", "firemega2_1", "mega2_1", "cleric2", "fighter2_1"]
            let enemy_classes2 = ["tank2_1", "archer2", "slime2_1", "ani2_1", "shinobi2_1", "wizard3"]
            //group 3
            let my_classes3 = ["assa3", "tank3", "wizard3", "cleric3", "shinobi2_1", "wizard2_1"]
            let enemy_classes3 = ["priest3", "golem3", "mega2_1", "slime2_1", "firemega3", "kunoichi3"]
            //Group 4
            let my_classes4 = ["shaman2", "cleric1_1", "assa1", "slime1_1", "archer1_1", "golem1_1"]
            let enemy_classes4 = ["shinobi1_1", "tank1_1", "kunoichi1_1", "firemega2", "assa2", "fighter1_1"]
            //Group 5
            let my_classes5 = ["mega1_1", "shaman2", "golem1_1", "priest1_1", "firemega2", "kunoichi1_1"]
            let enemy_classes5 = ["archer2", "wizard1_1", "shinobi1_1", "slime2", "cleric1_1", "ani1_1"]
            //Group 6
            let my_classes6 = ["slime3", "fighter3", "tree3", "priest3", "firemega3", "cleric3"]
            let enemy_classes6 = ["tank3", "shaman3", "wizard3", "ani3", "priest3", "golem3"]
            //Group 7
            let my_classes7 = ["mega3", "archer3", "assa3", "kunoichi3", "archer3", "assa3"]
            let enemy_classes7 = ["assa3", "mega3", "archer3", "mega3", "assa3", "shinobi3"]
            let mychars: CharacterFields[] = get_chars(my_classes7)
            let enemys: CharacterFields[] = get_chars(enemy_classes7) */
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
          {getLocale("Fight")}{" "}
        </Button>
      )}
    </>
  )
}
