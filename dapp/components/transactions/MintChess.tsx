import { useCallback, useEffect, useState } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_PACKAGE_V2, ROLE_GLOBAL_V2, CHESS_GLOBAL_V2, META_REWARDS_GLOBAL_V2, METAINFO_GLOBAL_V2 } from "../../lib/constants"
import { useToast } from "@chakra-ui/react"
import useLocale from "../../hooks/useLocale"

type Props = {
  username: string
  is_arena: boolean
  price: number
  meta: any
}

const useMintChess = () => {
  const { wallet } = ethos.useWallet()
  const [nftObjectId, setNftObjectId] = useState<string | null>(null)
  const toast = useToast()
  const getLocale = useLocale()

  const mint = useCallback(
    async ({ username, is_arena, price, meta }: Props) => {
      if (!wallet) return
      let method = is_arena ? "mint_invite_arena_chess" : "mint_chess"
      let moveModule = "chess"
      const transactionBlock = new TransactionBlock()
      if (is_arena) {
        let coins = transactionBlock.splitCoins(transactionBlock.gas, [transactionBlock.pure(price * 1_000_000_000)])
        let coin_vec = transactionBlock.makeMoveVec({ objects: [coins] })
        transactionBlock.moveCall({
          target: `${CHESS_PACKAGE_V2}::${moveModule}::${method}`,
          arguments: [
            transactionBlock.pure(`${ROLE_GLOBAL_V2}`),
            transactionBlock.pure(`${CHESS_GLOBAL_V2}`),
            transactionBlock.pure(`${META_REWARDS_GLOBAL_V2}`),
            transactionBlock.pure(username),
            coin_vec,
            transactionBlock.pure(`${METAINFO_GLOBAL_V2}`),
            transactionBlock.pure(meta.objectId)
          ]
        })
      } else {
        transactionBlock.moveCall({
          target: `${CHESS_PACKAGE_V2}::${moveModule}::${method}`,
          arguments: [transactionBlock.pure(`${ROLE_GLOBAL_V2}`), transactionBlock.pure(`${CHESS_GLOBAL_V2}`), transactionBlock.pure(username)]
        })
      }
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showObjectChanges: true
        }
      })
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find((objectChange) => objectChange.type === "created")
        if (!!createObjectChange && "objectId" in createObjectChange) {
          setNftObjectId(createObjectChange.objectId)
          toast({
            title: getLocale("new-chess-start"),
            status: "success",
            duration: 2000,
            isClosable: true
          })
        }
      }
    },
    [wallet]
  )

  const reset = useCallback(() => {
    setNftObjectId(null)
  }, [])

  useEffect(() => {
    reset()
  }, [reset])

  return { nftObjectId, mint }
}

export default useMintChess