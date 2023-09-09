import { atom } from "jotai";

// resources
export const money = atom<number>(10);

export const stageAtom = atom<"init" | "shop" | "fight">('shop');

export const selectedShopSlot = atom<number | null>(null);
export const selectedSlot = atom<number | null>(null);

export const slotCharacter = atom<(number | null)[]>([null, null, null, null, null, null]);
export const shopCharacter = atom<(number | null)[]>([1, 2, 3, 5, 7]);