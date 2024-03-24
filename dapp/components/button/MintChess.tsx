import { useCallback, useEffect, useState } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_GLOBAL, CHESS_CHALLENGE_PACKAGE, ROLE_GLOBAL, META_GLOBAL } from "../../lib/constants"
import { useToast } from "@chakra-ui/react"
import { metaA } from "../../store/stages"
import { useAtom } from "jotai"

type Props = {
  username: string
  is_arena: boolean
  price: number
}

const useMintChess = () => {
  const { wallet } = ethos.useWallet()
  const [meta, _setMeta] = useAtom(metaA)
  const [nftObjectId, setNftObjectId] = useState<string | null>(null)
  const toast = useToast()

  const mint = useCallback(
    async ({ username, is_arena, price }: Props) => {
      if (!wallet) return
      let method = is_arena ? "mint_arena_chess" : "mint_chess"
      let moveModule = "chess"
      const transactionBlock = new TransactionBlock()
      if (is_arena) {
        let coins = transactionBlock.splitCoins(transactionBlock.gas, [transactionBlock.pure(price * 1_000_000_000)])
        let coin_vec = transactionBlock.makeMoveVec({ objects: [coins] })
        console.log(coin_vec)
        transactionBlock.moveCall({
          target: `${CHESS_CHALLENGE_PACKAGE}::${moveModule}::${method}`,
          arguments: [
            transactionBlock.pure(`${ROLE_GLOBAL}`),
            transactionBlock.pure(`${CHESS_GLOBAL}`),
            transactionBlock.pure(username),
            coin_vec,
            transactionBlock.pure(`${META_GLOBAL}`),
            transactionBlock.pure(meta.objectId)
          ]
        })
      } else {
        transactionBlock.moveCall({
          target: `${CHESS_CHALLENGE_PACKAGE}::${moveModule}::${method}`,
          arguments: [transactionBlock.pure(`${ROLE_GLOBAL}`), transactionBlock.pure(`${CHESS_GLOBAL}`), transactionBlock.pure(username)]
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
            title: "new chess start",
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
