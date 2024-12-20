import { useCallback, useEffect, useState } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { SuccessMessage } from "."
import { ETHOS_EXAMPLE_CONTRACT } from "../lib/constants"
import useLocale from "../hooks/useLocale"

const Burn = () => {
  const { wallet } = ethos.useWallet()
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const getLocale = useLocale()

  const clone = useCallback(async () => {
    if (!wallet) return

    try {
      const transactionBlock = new TransactionBlock()
      transactionBlock.moveCall({
        target: `${ETHOS_EXAMPLE_CONTRACT}::example::mint`
      })

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showObjectChanges: true
        }
      })
      if (response?.objectChanges) {
        const newObject = response.objectChanges.find((e: any) => e.type === "created")

        if (!newObject || !("objectId" in newObject)) return

        const { objectId } = newObject

        const burnTransaction = new TransactionBlock()
        burnTransaction.moveCall({
          target: `${ETHOS_EXAMPLE_CONTRACT}::example::burn`,
          arguments: [burnTransaction.object(objectId)]
        })

        const burnResponse = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: burnTransaction,
          options: {
            showEffects: true
          }
        })
        setTransactionId(burnResponse?.effects?.transactionDigest || null)
      }
    } catch (error) {
      console.log(error)
    }
  }, [wallet])

  const reset = useCallback(() => {
    setTransactionId(null)
  }, [])

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <div className="flex flex-col gap-6">
      {transactionId && (
        <SuccessMessage reset={reset}>
          <a href={`https://explorer.sui.io/transactions/${encodeURI(transactionId)}?network=testnet`} target="_blank" rel="noreferrer" className="underline font-blue-600">
            {getLocale("View-NFT-burn-transaction")}
          </a>
        </SuccessMessage>
      )}
      <button className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" onClick={clone}>
        {getLocale("Burn-NFT")}
      </button>
    </div>
  )
}

export default Burn
