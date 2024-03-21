import { useCallback, useState } from "react"
import { metaA } from "../../store/stages"
import { ethos } from "ethos-connect"
import { useAtom } from "jotai"
import { CHESS_CHALLENGE_PACKAGE, ISMAINNET, META_GLOBAL } from "../../lib/constants"
import { JsonRpcProvider, TransactionBlock, mainnetConnection, normalizeSuiObjectId, testnetConnection } from "@mysten/sui.js"

interface Meta {
  metaId: Number
  objectId: string
  name: string
  level: number
  exp: number
  invited_claimed_num: number
  inviterMetaId: number
  total_arena_lose: number
  total_arena_win: number
  wallet: String
  abilitities: string[]
}

const useQueryMetaInfo = () => {
  const [_meta, setMeta] = useAtom(metaA)
  const { wallet } = ethos.useWallet()

  const register_meta = async (name: String) => {
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
        const createObjectChange = response.objectChanges.find((objectChange:any) => objectChange.type === "created")
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
      const results = await provider.getOwnedObjects({
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
      let data: any = results.data[0].data
      let content: any = data.content
      let fields: any = content.fields
      let meta: Meta = {
        metaId: Number(fields.metaId),
        objectId: data.objectId,
        name: fields.name,
        level: Number(fields.level),
        exp: Number(fields.exp),
        invited_claimed_num: Number(fields.invited_claimed_num),
        inviterMetaId: Number(fields.inviterMetaId),
        total_arena_lose: Number(fields.total_arena_lose),
        total_arena_win: Number(fields.total_arena_win),
        wallet: fields.wallet_addr,
        abilitities: [fields.ability1, fields.ability2, fields.ability3, fields.ability4, fields.ability5]
      }
      console.log("meta", meta)
      setMeta(meta.objectId)
      return meta
      // todo:筛选出其中的metaIdentity
    } catch (error) {
      console.log("err", error)
    }
  }, [wallet])
  return { register_meta, query_meta_info }
}

export default useQueryMetaInfo
