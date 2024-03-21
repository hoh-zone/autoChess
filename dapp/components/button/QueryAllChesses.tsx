import { useCallback, useState } from "react"

import { ethos } from "ethos-connect"
import { CHESS_CHALLENGE_PACKAGE, ISMAINNET } from "../../lib/constants"
import { GameNft } from "../../types/nft"
import { useSyncGameNFT } from "../../hooks/useSyncGameNFT"
import { JsonRpcProvider, PaginatedObjectsResponse, mainnetConnection, testnetConnection } from "@mysten/sui.js"

const useQueryChesses = () => {
  const { wallet } = ethos.useWallet()
  const [nfts, setNfts] = useState<GameNft[]>([])
  const syncGameNFT = useSyncGameNFT()
  const record_nfts = (result: PaginatedObjectsResponse) => {
    let games = result.data.map((d) => (d.data?.content as any)?.fields).filter(Boolean) as GameNft[]
    setNfts(games)
    return games
  }

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
    if (!wallet) return
    const result = await provider.getOwnedObjects({
      owner: wallet.address,
      options: {
        showContent: true
      },
      filter: {
        MoveModule: {
          package: CHESS_CHALLENGE_PACKAGE,
          module: "chess"
        }
      }
    })
    return record_nfts(result)
  }, [wallet])
  return { nfts, query_chess: update_chess, query_chesses }
}

export default useQueryChesses
