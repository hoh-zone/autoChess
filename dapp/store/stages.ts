import { atom } from "jotai";

// global status
export const stageAtom = atom<"init" | "shop" | "fight">('init');

// resources
export const money = atom<number>(50);
export const slotCharacter = atom<(number | null)[]>([null, null, null, null, null, null]);
export const shopCharacter = atom<(number | null)[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

// control
export const selectedShopSlot = atom<number | null>(null);
export const selectedSlot = atom<number | null>(null);

