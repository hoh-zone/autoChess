import { useCallback } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_GLOBAL, CHESS_PACKAGE_ID0 } from "../../lib/constants"

type Props = {
  chess_id: string
}

const useCheckout = () => {
  const { wallet } = ethos.useWallet()

  const checkout = useCallback(
    async ({ chess_id }: Props) => {
      if (!wallet) return
      let method = "check_out_arena"
      let moveModule = "chess"
      console.log("id:", chess_id)
      try {
        const transactionBlock = new TransactionBlock()
        transactionBlock.moveCall({
          target: `${CHESS_PACKAGE_ID0}::${moveModule}::${method}`,
          arguments: [transactionBlock.pure(`${CHESS_GLOBAL}`), transactionBlock.pure(`${chess_id}`)]
        })
        const response = await wallet.signAndExecuteTransactionBlock({
          transactionBlock,
          options: {
            showObjectChanges: true
          }
        })
        console.log("response:", response.objectChanges)
        if (response.objectChanges) {
          const createObjectChange = response.objectChanges.find((objectChange) => objectChange.type === "created")
          if (!!createObjectChange && "objectId" in createObjectChange) {
            console.log("objid", createObjectChange.objectId)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    [wallet]
  )
  return { checkout }
}

export default useCheckout
