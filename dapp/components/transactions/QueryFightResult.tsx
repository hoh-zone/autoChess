import { useCallback, useState } from "react"

import { ethos } from "ethos-connect"
import { CHESS_PACKAGE_V2, ISMAINNET } from "../../lib/constants"
import { sleep } from "../../utils/sleep"
import { JsonRpcProvider, mainnetConnection, testnetConnection } from "@mysten/sui.js"

interface HashMap<T> {
  [key: string]: T
}

const useQueryFight = () => {
  const { wallet } = ethos.useWallet()
  const [ranks, setRanks] = useState<string[]>([])
  const query_fight_rank = useCallback(async () => {
    try {
      let provider = null
      if (ISMAINNET) {
        provider = new JsonRpcProvider(mainnetConnection)
      } else {
        provider = new JsonRpcProvider(testnetConnection)
      }
      if (!wallet) return
      let result_tmp = await wallet.client.queryEvents({
        query: {
          MoveEventType: CHESS_PACKAGE_V2 + "::chess::FightEvent"
        },
        limit: 30,
        order: "descending"
      })
      let res: string[] = []
      result_tmp.data.map((fight: any) => {
        let time = fight.timestampMs
        const date = new Date(Number(time))
        const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
        let json = fight.parsedJson as any
        let name = json["v1_name"]
        res.push(name + ":" + json["v1_win"] + "-" + json["v1_lose"] + "    | " + formattedDate)
      })
      setRanks(res)
    } catch (error) {
      console.log("err", error)
    }
  }, [wallet])

  const query_fight = useCallback(
    async (nft_id: string, last_win: number, last_lose: number) => {
      try {
        if (!wallet) return
        let max_query = 0
        while (max_query < 3) {
          const result = await wallet.client.queryEvents({
            query: {
              MoveEventType: CHESS_PACKAGE_V2 + "::chess::FightEvent"
            }
          })
          for (let i = 0; i < result.data.length; i++) {
            let json = result.data[i].parsedJson as any
            let chess_id = json["chess_id"]
            if (chess_id == nft_id) {
              let win = Number(json["v1_win"])
              let lose = Number(json["v1_lose"])
              if (win <= last_win && lose <= last_lose) {
                await sleep(500)
                break
              }
              return json
            }
          }
          max_query += 1
        }
      } catch (error) {
        console.log("err", error)
      }
    },
    [wallet]
  )
  return { ranks, query_fight, query_fight_rank }
}

export default useQueryFight
