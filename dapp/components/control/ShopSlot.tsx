import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { selectedShopSlot, selectedSlot, shopCharacter, slotCharacter } from "../../store/stages"
import { removeSuffix } from "../../utils/TextUtils"
import { useEffect, useRef, useState } from "react"
import { FloatCharInfo } from "./FloatCharInfo"
import { motion } from "framer-motion"
import { sleep } from "../../utils/sleep"

export const ShopSlot = ({ id }: {
    id: number
}) => {
    const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot)
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot)
    const selected = (shopSlotNumber === id);
    const [shopChars, setShopChars] = useAtom(shopCharacter)
    const char = shopChars[id];

    const [attack, setAttack] = useState(false);
    useEffect(() => {
        setInterval(async () => {
            setAttack(true);
            await sleep(1500);
            setAttack(false);
        }, 3000 + Math.random() * 2000);
    }, []);

    return <motion.div
        whileHover={{ scale: 1.1 }} className={
            twMerge(
                "w-24 h-24 relative rounded-xl",
                "border-4 border-transparent z-20 hover:border-slate-300",
                selected ? "border-slate-800" : ""
            )
        }
        onClick={() => {
            setShopSlotNumber(id);
            setSlotNumber(null);
        }}
    >
        <div className="slot rounded-full w-full h-24 bg-slate-400 absolute bottom-[-3rem]" />
        <div className="pointer-events-none absolute  top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }} >
            {char && <Character
                attack={attack ? 2 : 0}
                charType={removeSuffix(char.name)}
            />
            }
        </div>
        {<FloatCharInfo isShopSlot={true} isShowInfo={true} id={id} />}
    </motion.div>
}