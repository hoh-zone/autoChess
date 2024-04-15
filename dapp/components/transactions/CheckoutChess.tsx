import { useCallback } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_PACKAGE_V2, CHESS_GLOBAL_V2 } from "../../lib/constants"
import { useToast } from "@chakra-ui/react"
import useLocale from "../../hooks/useLocale"

type Props = {
  chess_id: string
  fun?: () => any
}

const useCheckout = () => {
  const { wallet } = ethos.useWallet()
  const toast = useToast()
  const getLocale = useLocale()

  const checkout = useCallback(
    async ({ chess_id, fun }: Props) => {
      if (!wallet) return
      let method = "check_out_arena_fee"
      let moveModule = "chess"
      try {
        const transactionBlock = new TransactionBlock()
        transactionBlock.moveCall({
          target: `${CHESS_PACKAGE_V2}::${moveModule}::${method}`,
          arguments: [transactionBlock.pure(`${CHESS_GLOBAL_V2}`), transactionBlock.pure(`${chess_id}`)]
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
              title: getLocale("redeem-success"),
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
          title: getLocale("redeem-failed"),
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
