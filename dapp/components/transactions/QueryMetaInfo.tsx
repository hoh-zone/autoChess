import { useCallback } from "react"
import { ethos, TransactionBlock } from "ethos-connect"
import { CHESS_PACKAGE, ISMAINNET, META_REWARDS_GLOBAL, META_INFO_GLOBAL } from "../../lib/constants"
import { JsonRpcProvider, mainnetConnection, normalizeSuiObjectId, testnetConnection } from "@mysten/sui.js"

interface Meta {
  metaId: Number
  objectId: string
  name: string
  level: number
  exp: number
  avatar_name: string
  bestRank: number
  invited_num: number
  invited_claimed_num: number
  inviterMetaId: number
  total_arena_lose: number
  total_arena_win: number
  wallet: String
  abilitities: string[]
  version: number
}

const useQueryMetaInfo = () => {
  const { wallet } = ethos.useWallet()

  // deprecated
  const clone_meta = async (meta: Meta) => {
    if (!wallet) return
    try {
      const tx = new TransactionBlock()
      tx.moveCall({
        target: `${CHESS_PACKAGE}::metaIdentity::clone_meta_from_old_package`,
        arguments: [
          tx.object(normalizeSuiObjectId(meta.objectId)),
          tx.object(normalizeSuiObjectId(META_INFO_GLOBAL)),
          tx.object(normalizeSuiObjectId(META_INFO_GLOBAL)),
          tx.object(normalizeSuiObjectId(META_REWARDS_GLOBAL))
        ]
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

  const claim_invite_sui = async (meta: Meta) => {
    if (!wallet) return
    try {
      const tx = new TransactionBlock()
      tx.moveCall({
        target: `${CHESS_PACKAGE}::metaIdentity::claim_invite_rewards`,
        arguments: [tx.object(normalizeSuiObjectId(META_INFO_GLOBAL)), tx.object(normalizeSuiObjectId(META_REWARDS_GLOBAL)), tx.object(normalizeSuiObjectId(meta.objectId))]
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
      //
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
          target: `${CHESS_PACKAGE}::metaIdentity::register_invited_meta`,
          arguments: [tx.object(normalizeSuiObjectId(META_INFO_GLOBAL)), tx.pure(inviteMetaId), tx.pure(name), tx.pure(avatar_name)]
        })
      } else {
        tx.moveCall({
          target: `${CHESS_PACKAGE}::metaIdentity::mint_meta`,
          arguments: [tx.object(normalizeSuiObjectId(META_INFO_GLOBAL)), tx.pure(name), tx.pure(avatar_name)]
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
        id: META_INFO_GLOBAL,
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
      let global2: any = await wallet.client.getObject({
        id: META_INFO_GLOBAL,
        options: {
          showContent: true
        }
      })
      let id2 = global2.data?.content?.fields.invited_meta_map.fields.id.id
      let invited_num2: any = await wallet.client.getDynamicFieldObject({
        parentId: id2,
        name: {
          type: "u64",
          value: String(metaId)
        }
      })
      if (invited_num.error) {
        return 0
      }
      let array = invited_num.data?.content?.fields.value
      let old_invite_num = array.fields.value.length
      if (invited_num2.error) {
        return old_invite_num
      }
      let arrry2 = invited_num2.data?.content?.fields.value
      let new_invite_num = arrry2.fields.value.length
      return old_invite_num + new_invite_num
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
                package: CHESS_PACKAGE,
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
      let data: any = results.data[0]?.data
      if (!data) {
        return ""
      }
      let version = 0
      if (String(data.type).indexOf(CHESS_PACKAGE) !== -1) {
        version = 1
      } else if (String(data.type).indexOf(CHESS_PACKAGE) !== -1) {
        version = 2
      }
      let content: any = data?.content
      let fields: any = content?.fields
      let rank_map_id = fields?.best_rank_map?.fields.id.id
      let best_rank: any = await wallet.client.getDynamicFieldObject({
        parentId: rank_map_id,
        name: {
          type: "u64",
          value: "1"
        }
      })
      if (best_rank.error) {
        best_rank = -1
      } else {
        best_rank = Number(best_rank.data.content.fields.value)
      }
      console.log(best_rank)
      let meta: Meta = {
        metaId: Number(fields?.metaId),
        objectId: data?.objectId,
        name: fields?.name,
        level: Number(fields?.level),
        exp: Number(fields?.exp),
        avatar_name: fields?.avatar_name,
        invited_num: 0,
        bestRank: best_rank,
        invited_claimed_num: Number(fields?.invited_claimed_num),
        inviterMetaId: Number(fields?.inviterMetaId),
        total_arena_lose: Number(fields?.total_arena_lose),
        total_arena_win: Number(fields?.total_arena_win),
        wallet: fields?.wallet_addr,
        abilitities: [fields?.ability1, fields?.ability2, fields?.ability3, fields?.ability4, fields?.ability5],
        version: version
      }
      let invited = await query_invited_num(meta.metaId)
      meta.invited_num = Number(invited)
      return meta
    } catch (error) {
      console.log("err", error)
    }
  }, [wallet])
  return { register_meta, query_meta_info, query_invited_num, claim_invite_sui, clone_meta }
}

export default useQueryMetaInfo
