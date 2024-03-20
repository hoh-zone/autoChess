import { useCallback, useState } from "react"

import { ethos } from "ethos-connect"
import { CHESS_CHALLENGE_PACKAGE, ISMAINNET, META_GLOBAL } from "../../lib/constants"
import { JsonRpcProvider, TransactionBlock, mainnetConnection, normalizeSuiObjectId, testnetConnection } from "@mysten/sui.js"

const useQueryMetaInfo = () => {
  const { wallet } = ethos.useWallet()

  const register_meta = async () => {
    if (!wallet) return
    try {
      const tx = new TransactionBlock()
      tx.moveCall({
        target: `${CHESS_CHALLENGE_PACKAGE}::metaIdentity::mint_meta`,
        arguments: [tx.object(normalizeSuiObjectId(META_GLOBAL)), tx.pure(name)]
      })
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true
        }
      })
      console.log("response:", response)
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find((objectChange) => objectChange.type === "created")
        if (!!createObjectChange && "objectId" in createObjectChange) {
          console.log("objid", createObjectChange.objectId)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const query_meta_info = useCallback(async () => {
    try {
      if (!wallet) return
      let provider = null
      if (ISMAINNET) {
        provider = new JsonRpcProvider(mainnetConnection)
      } else {
        provider = new JsonRpcProvider(testnetConnection)
      }
      const results = provider.getOwnedObjects({
        owner: wallet.address,
        filter: {
          MoveModule: {
            package: CHESS_CHALLENGE_PACKAGE,
            module: "metaIdentity"
          }
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      })

      // todo:筛选出其中的metaIdentity
    } catch (error) {
      console.log("err", error)
    }
  }, [wallet])
  return { register_meta, query_meta_info }
}

export default useQueryMetaInfo
