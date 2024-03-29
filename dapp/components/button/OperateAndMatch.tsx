import { useState } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { chessId, fightResA, metaA, moneyA as moneyAtom, slotCharacter } from "../../store/stages"
import { CHALLENGE_GLOBAL, CHESS_GLOBAL, CHESS_CHALLENGE_PACKAGE, LINEUP_GLOBAL, ROLE_GLOBAL, CHESS_CHALLENGE_PACKAGE2, CHESS_CHALLENGE_PACKAGE3, CHESS_CHALLENGE_PACKAGE4 } from "../../lib/constants"
import { useAtom } from "jotai"
import { useToast } from "@chakra-ui/react"
import { normalizeSuiObjectId } from "@mysten/sui.js"

const useOperateAndMatch = () => {
  const [fightRes, setFightRes] = useAtom(fightResA)
  const { wallet } = ethos.useWallet()
  const [meta, _setMeta] = useAtom(metaA)
  const [nftObjectId, setNftObjectId] = useState<string | null>(null)
  const [money] = useAtom(moneyAtom)
  const [chars] = useAtom(slotCharacter)
  const [chess_id] = useAtom(chessId)
  const toast = useToast()

  const get_chars_strvec = () => {
    let vec: string[] = []
    for (let index = 0; index < chars.length; index++) {
      let cha = chars[index]
      if (cha == null || cha == undefined) {
        vec.push("")
      } else {
        vec.push(cha.class + "-" + cha.level + ":" + cha.attack + ":" + cha.max_hp)
      }
    }
    return vec
  }

  const operate_submit = async (operations: string[], meta: any) => {
    if (!wallet) return
    try {
      const tx = new TransactionBlock()
      const left_gold = money
      tx.moveCall({
        target: `${CHESS_CHALLENGE_PACKAGE4}::chess::operate_and_battle`,
        arguments: [
          tx.pure(`${CHESS_GLOBAL}`),
          tx.pure(`${ROLE_GLOBAL}`),
          tx.pure(`${LINEUP_GLOBAL}`),
          tx.pure(`${CHALLENGE_GLOBAL}`),
          tx.pure(chess_id),
          tx.pure(operations),
          tx.pure(left_gold),
          tx.pure(get_chars_strvec()),
          tx.object(normalizeSuiObjectId(meta.objectId))
        ]
      })

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true
        }
      })
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find((objectChange) => objectChange.type === "created")
        if (!!createObjectChange && "objectId" in createObjectChange) {
          console.log("objid", createObjectChange.objectId)
        }
      }

      if (response.events != null) {
        let event = response.events[0]
        if (event == null) {
          toast({
            title: "Network error, please refresh and try again",
            status: "error",
            duration: 5000,
            isClosable: true
          })
          return
        }
        let event_json = event.parsedJson as any
        let res = event_json["res"]
        console.log("fight res", res)
        if (res == 1) {
          setFightRes(true)
          console.log("you win")
        } else if (res == 2) {
          setFightRes(false)
          console.log("you lose")
        } else {
          // even
          setFightRes(true)
          console.log("you win")
        }
        return event_json
      }
    } catch (error) {
      console.log(error)
      if (String(error).indexOf("function: 9, instruction: 70") !== -1) {
        toast({
          title: "My lord, You have ranked to the 1st in the world",
          status: "warning",
          duration: 5000,
          isClosable: true
        })
        return false
      }
      if (String(error).indexOf("objects are invalid") !== -1) {
        toast({
          title: "Timeout, please refresh and try again",
          status: "warning",
          duration: 5000,
          isClosable: true
        })
        return false
      }
      toast({
        title: "error, please try again",
        status: "warning",
        duration: 5000,
        isClosable: true
      })
      return false
    }
  }

  return { nftObjectId, operate_submit }
}

export default useOperateAndMatch
