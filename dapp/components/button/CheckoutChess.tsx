import { useCallback } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_GLOBAL, CHESS_CHALLENGE_PACKAGE } from "../../lib/constants"
import { useToast } from "@chakra-ui/react"

type Props = {
  chess_id: string,
  fun?: ()=>any
}

const useCheckout = () => {
  const { wallet } = ethos.useWallet()
  const toast = useToast()

  const checkout = useCallback(
    async ({ chess_id, fun }: Props) => {
      if (!wallet) return
      let method = "check_out_arena"
      let moveModule = "chess"
      try {
        const transactionBlock = new TransactionBlock()
        transactionBlock.moveCall({
          target: `${CHESS_CHALLENGE_PACKAGE}::${moveModule}::${method}`,
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
            toast({
              title: "redeem success",
              status: "success",
              duration: 2000,
              isClosable: true
            })
          }
        }
        // 回调
        fun && fun()
      } catch (error) {
        toast({
          title: "redeem failed",
          status: "error",
          duration: 2000,
          isClosable: true
        })
        console.log(error)
      }
    },
    [wallet]
  )
  return { checkout }
}

export default useCheckout
