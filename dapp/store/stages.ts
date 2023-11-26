import { atom } from "jotai"
import { CharacterFields } from "../types/nft"

export const currentNftId = atom<string>("")

// Game NFT
export const moneyA = atom<number>(50)
export const winA = atom<number>(99)
export const loseA = atom<number>(99)
export const challengeWinA = atom<number>(99)
export const challengeLoseA = atom<number>(99)
export const nameA = atom<string>("Default name")
export const fightingIndex = atom<number>(0)
export const hpChangeA = atom<number[]>([0, 0, 0, 0, 0, 0])
export const enemyHpChangeA = atom<number[]>([0, 0, 0, 0, 0, 0])
export const attackChangeA = atom<number[]>([0, 0, 0, 0, 0, 0])
export const enemyAttackChangeA = atom<number[]>([0, 0, 0, 0, 0, 0])

export const skillTagA = atom<string[]>(["", "", "", "", "", ""])
export const enemySkillTagA = atom<string[]>(["", "", "", "", "", ""])

//charactors
export const slotCharacter = atom<(CharacterFields | null)[]>([null, null, null, null, null, null]);
export const enemyCharacter = atom<(CharacterFields | null)[]>([null, null, null, null, null, null]);

// enemy
export const enemyWinA = atom<number>(0)
export const enemyLoseA = atom<number>(0)
export const enemyNameA = atom<string>("Your Enemy")
export const enemyFightingIndex = atom<number>(0)

export const shopCharacter = atom<(CharacterFields | null)[]>([null, null, null, null, null, null])
export const chessId = atom<string>("")

// control
export const stageAtom = atom<"init" | "shop" | "fight">("init")
export const selectedShopSlot = atom<number | null>(null)
export const selectedSlot = atom<number | null>(null)
export const operationsA = atom<string[]>([])

// effects
export const fightResultEffectA = atom<null | string>(null)

export const assetsAtom = atom<{ [key: string]: string } | null>({})
