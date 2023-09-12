import { atom } from "jotai";
import { CharacterFields, ID } from "../types/nft";

// Game NFT
export const moneyA = atom<number>(50);
export const winA = atom<number>(99);
export const loseA = atom<number>(99);
export const nameA = atom<string>("Default name");
export const slotCharacter = atom<(CharacterFields | null)[]>([null, null, null, null, null, null]);
export const enemyCharacter = atom<(CharacterFields | null)[]>([null, null, null, null, null, null]);

export const shopCharacter = atom<(CharacterFields | null)[]>([null, null, null, null, null, null]);
export const chessId = atom<string>("");

// control
export const stageAtom = atom<"init" | "shop" | "fight">('init');
export const selectedShopSlot = atom<number | null>(null);
export const selectedSlot = atom<number | null>(null);

