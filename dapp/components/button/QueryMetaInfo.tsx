import { useCallback } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_CHALLENGE_PACKAGE, CHESS_CHALLENGE_PACKAGE5, CHESS_GLOBAL, ISMAINNET, META_GLOBAL } from "../../lib/constants"
import { JsonRpcProvider, mainnetConnection, normalizeSuiObjectId, testnetConnection } from "@mysten/sui.js"

interface Meta {
  metaId: Number
  objectId: string
  name: string
  level: number
  exp: number
  avatar_name: string
  invited_num: number
  invited_claimed_num: number
  inviterMetaId: number
  total_arena_lose: number
  total_arena_win: number
  wallet: String
  abilitities: string[]
}

const useQueryMetaInfo = () => {
  const { wallet } = ethos.useWallet()
  const claim_invite_exp = async (meta: Meta) => {
    if (!wallet) return
    try {
      const tx = new TransactionBlock()
      tx.moveCall({
        target: `${CHESS_CHALLENGE_PACKAGE5}::metaIdentity::claim_invite_exp`,
        arguments: [tx.object(normalizeSuiObjectId(META_GLOBAL)), tx.object(normalizeSuiObjectId(meta.objectId))]
      })
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true
        }
      })
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find((objectChange: any) => objectChange.type === "created")
        if (!!createObjectChange && "objectId" in createObjectChange) {
          console.log("objid", createObjectChange.objectId)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const register_meta = async (name: String, inviteMetaId: number, avatar_name: string) => {
    if (!wallet) return
    try {
      const tx = new TransactionBlock()
      if (inviteMetaId > 0) {
        console.log(inviteMetaId)
        tx.moveCall({
          target: `${CHESS_CHALLENGE_PACKAGE5}::metaIdentity::register_invited_meta`,
          arguments: [tx.object(normalizeSuiObjectId(META_GLOBAL)), tx.pure(inviteMetaId), tx.pure(name), tx.pure(avatar_name)]
        })
      } else {
        tx.moveCall({
          target: `${CHESS_CHALLENGE_PACKAGE5}::metaIdentity::mint_meta`,
          arguments: [tx.object(normalizeSuiObjectId(META_GLOBAL)), tx.pure(name), tx.pure(avatar_name)]
        })
      }
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true
        }
      })
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find((objectChange: any) => objectChange.type === "created")
        if (!!createObjectChange && "objectId" in createObjectChange) {
          console.log("objid", createObjectChange.objectId)
          query_meta_info()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const query_invited_num = async (metaId: Number) => {
    try {
      if (!wallet) return
      let global: any = await wallet.client.getObject({
        id: META_GLOBAL,
        options: {
          showContent: true
        }
      })
      let id = global.data?.content?.fields.invited_meta_map.fields.id.id
      let invited_num: any = await wallet.client.getDynamicFieldObject({
        parentId: id,
        name: {
          type: "u64",
          value: String(metaId)
        }
      })
      if (invited_num.error) {
        return 0
      }
      let array = invited_num.data?.content?.fields.value
      return array.fields.value.length
    } catch (error) {
      console.log("err", error)
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
          MatchAny: [
            {
              MoveModule: {
                package: CHESS_CHALLENGE_PACKAGE,
                module: "metaIdentity"
              }
            },
            {
              MoveModule: {
                package: CHESS_CHALLENGE_PACKAGE5,
                module: "metaIdentity"
              }
            }
          ]
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      })
      console.log("result", results)
      let data: any = results.data[0]?.data
      if (!data) {
        return ""
      }
      let content: any = data?.content
      let fields: any = content?.fields
      let meta: Meta = {
        metaId: Number(fields?.metaId),
        objectId: data?.objectId,
        name: fields?.name,
        level: Number(fields?.level),
        exp: Number(fields?.exp),
        avatar_name: fields?.avatar_name,
        invited_num: 0,
        invited_claimed_num: Number(fields?.invited_claimed_num),
        inviterMetaId: Number(fields?.inviterMetaId),
        total_arena_lose: Number(fields?.total_arena_lose),
        total_arena_win: Number(fields?.total_arena_win),
        wallet: fields?.wallet_addr,
        abilitities: [fields?.ability1, fields?.ability2, fields?.ability3, fields?.ability4, fields?.ability5]
      }
      let invited = await query_invited_num(meta.metaId)
      meta.invited_num = Number(invited)
      return meta
    } catch (error) {
      console.log("err", error)
    }
  }, [wallet])
  return { register_meta, query_meta_info, query_invited_num, claim_invite_exp }
}

export default useQueryMetaInfo
