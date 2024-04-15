import { useCallback, useState } from "react"

import { ethos } from "ethos-connect"
import { CHESS_CHALLENGE_PACKAGE, CHESS_PACKAGE_V2, ISMAINNET } from "../../lib/constants"
import { GameNft } from "../../types/nft"
import { useSyncGameNFT } from "../../hooks/useSyncGameNFT"
import { JsonRpcProvider, PaginatedObjectsResponse, mainnetConnection, testnetConnection } from "@mysten/sui.js"

const useQueryChesses = () => {
  const { wallet } = ethos.useWallet()
  const [nfts, setNfts] = useState<GameNft[]>([])
  const syncGameNFT = useSyncGameNFT()
  const update_chess = useCallback(
    async (chess_id: string) => {
      if (!wallet) return
      const result = await wallet.client.getObject({
        id: chess_id,
        options: {
          showContent: true
        }
      })
      let updated_nft = (result.data?.content as any)?.fields as GameNft
      syncGameNFT(updated_nft)
    },
    [wallet]
  )
  const query_chesses = useCallback(async () => {
    if (!wallet) return
    let provider = null
    if (ISMAINNET) {
      provider = new JsonRpcProvider(mainnetConnection)
    } else {
      provider = new JsonRpcProvider(testnetConnection)
    }
    let gamesList: GameNft[] = []
    if (!wallet) return
    let hasNext = true
    let cursor = undefined
    while (hasNext) {
      const result: any = await provider.getOwnedObjects({
        owner: wallet.address,
        options: {
          showContent: true
        },
        filter: {
          MoveModule: {
            package: CHESS_PACKAGE_V2,
            module: "chess"
          }
        },
        cursor: cursor
      })
      hasNext = result.hasNextPage
      cursor = result.nextCursor
      result.data.map((item: any) => {
        if ((item.data?.content as any)?.fields) {
          gamesList.push((item.data?.content as any)?.fields)
        }
      })
    }
    setNfts(gamesList)
    return gamesList
  }, [wallet])
  return { nfts, query_chess: update_chess, query_chesses }
}

export default useQueryChesses
