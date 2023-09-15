import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { enemyCharacter, moneyA as moneyAtom, selectedShopSlot, selectedSlot, shopCharacter, slotCharacter, stageAtom } from "../../store/stages"
import { removeSuffix } from "../../utils/TextUtils";
import { CharacterFields } from "../../types/nft";
import { useEffect } from "react";
import { upgrade } from "../character/rawData";
import { Levelup } from "../character/levelup";
import { FloatCharInfo } from "./FloatCharInfo";
import { motion } from "framer-motion";

export const Slot = ({ isOpponent = false, id }: {
    isOpponent?: boolean
    id: number
}) => {

    const [slotNumber, setSlotNumber] = useAtom(selectedSlot);
    const [chars, setChars] = useAtom(slotCharacter);
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot);
    const [shopChars, setShopChars] = useAtom(shopCharacter);
    const [money, setMoney] = useAtom(moneyAtom);
    let char: CharacterFields | null = null;
    if (id >= 10) {
        char = enemyChars[id - 10];
    } else {
        char = chars[id];
    }

    if (id === 0) {
        console.log("is there", char);
    }

    const selected = (slotNumber === id);

    // // reset attack after 1.5s
    // useEffect(() => {
    //     if (char && char.attacking) {
    //         setTimeout(() => {
    //             if (!char || !char.attacking) return;
    //             char.attacking = 0;
    //             isOpponent ?
    //                 setEnemyChars(enemyChars.slice()) :
    //                 setChars(chars.slice());
    //         }, 1500);
    //     }
    // }, [char, char?.attacking]);

    const [stage, setStage] = useAtom(stageAtom);

    return <motion.div
        whileHover={{ scale: 1.1 }}
        className={
            twMerge(
                "w-24 h-24 relative rounded-xl slotContainer",
                "border-4 border-transparent z-10",
                (char == null && stage != "shop") ? "pointer-events-none" : "hover:border-slate-300",
                selected ? "border-slate-800" : ""
            )}
        onClick={() => {
            // try to buy
            let char_shop_choosen = shopChars[shopSlotNumber!];
            if (shopSlotNumber !== null && !char && char_shop_choosen) {
                if (money >= char_shop_choosen.price) {
                    setMoney(money - char_shop_choosen.price);
                    chars[id] = shopChars[shopSlotNumber];
                    shopChars[shopSlotNumber] = null;
                    setChars(chars.slice());
                    setShopChars(shopChars);

                    setShopSlotNumber(null);
                    setSlotNumber(null);
                }
                // buy and upgrad chars
            } else if (shopSlotNumber != null && char && char_shop_choosen &&
                canUpgrade(char, char_shop_choosen)) {
                if (money >= char_shop_choosen.price) {
                    setMoney(money - char_shop_choosen.price);
                    let tmp = upgrade(char);
                    chars[id] = tmp;
                    shopChars[shopSlotNumber] = null;
                    setChars(chars.slice());
                    setShopSlotNumber(null);
                    setSlotNumber(null);
                }
            }
            // swap or upgrad chars
            else if (slotNumber !== null && slotNumber !== id) {
                let temp = chars[id];
                chars[id] = chars[slotNumber];
                if (canUpgrade(chars[id], temp)) {
                    chars[slotNumber] = null;
                    if (temp != null) {
                        temp = upgrade(temp);
                    }
                    chars[id] = temp;
                    setChars(chars.slice());
                    setSlotNumber(null);
                    setShopSlotNumber(null);
                } else {
                    chars[slotNumber] = temp;
                    setChars(chars);
                    setSlotNumber(null);
                    setShopSlotNumber(null);
                }
            }
            else {
                if (slotNumber == null) {
                    setSlotNumber(id);
                } else {
                    // cancel choosen state
                    setSlotNumber(null);
                }
                setShopSlotNumber(null);
            }
        }}
    >   {stage == "shop" && <div className="slot rounded-full w-full h-24 bg-slate-400 absolute bottom-[-3rem]" />}
        <div className="absolute  top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }} >
            {char && char.name && <Character
                level={char.level}
                attack={char.attacking}
                charType={removeSuffix(char.name)}
                isOpponent={isOpponent} />
            }
        </div>
        {<FloatCharInfo isShowInfo={stage == "shop"} id={id} />}
    </motion.div  >
}

const canUpgrade = (char1: any, char2: any) => {
    if (char1 == null || char2 == null) {
        return false;
    }
    if (removeSuffix(char1.name) != removeSuffix(char2.name)) {
        return false;
    }
    // 1 + 1 = 2
    // 1 + 2 = 3
    // 3 + 3 = 6
    // 3 + 6 = 9
    let level1 = char1.level;
    let level2 = char2.level;
    if (level1 > level2) {
        let tmp = level2;
        level2 = level1;
        level1 = tmp;
    }
    if (level1 == 1) {
        return level2 == 1 || level2 == 2
    } else if (level1 == 3) {
        return level2 == 3 || level2 == 6
    } else {
        return false;
    }
}