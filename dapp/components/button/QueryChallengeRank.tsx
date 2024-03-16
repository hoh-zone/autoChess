import { useCallback } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHALLENGE_GLOBAL, CHALLENGE_PACKAGE_ID, SENDER } from "../../lib/constants"

export function bytesArrayToString(input: Uint8Array): String {
  const bytes: Uint8Array = new Uint8Array(input)
  const decoder: TextDecoder = new TextDecoder("utf-8")
  return decoder.decode(bytes)
}

const useQueryChallengeRank = () => {
  const { wallet } = ethos.useWallet()
  let moveModule = "challenge"
  let method = "generate_rank_20_description"
  const query_challenge_rank = useCallback(async () => {
    try {
      if (!wallet) return
      const transactionBlock = new TransactionBlock()
      transactionBlock.moveCall({
        target: `${CHALLENGE_PACKAGE_ID}::${moveModule}::${method}`,
        arguments: [transactionBlock.pure(CHALLENGE_GLOBAL)]
      })
      const result = await wallet.client.devInspectTransactionBlock({
        transactionBlock: transactionBlock,
        sender: SENDER
      })
    } catch (error) {
      console.log("err", error)
    }
  }, [wallet])
  return { query_challenge_rank }
}

export default useQueryChallengeRank
