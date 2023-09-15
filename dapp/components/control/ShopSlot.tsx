import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { selectedShopSlot, selectedSlot, shopCharacter, slotCharacter } from "../../store/stages"
import { removeSuffix } from "../../utils/TextUtils"
import { useEffect, useRef, useState } from "react"
import { FloatCharInfo } from "./FloatCharInfo"

export const ShopSlot = ({ id }: {
    id: number
}) => {
    const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot)
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot)
    const selected = (shopSlotNumber === id);
    const [shopChars, setShopChars] = useAtom(shopCharacter)
    const char = shopChars[id];

    const attackAnimRef = useRef<NodeJS.Timeout>();
    const [attack ,setAttack] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setAttack(true);
            if (attackAnimRef.current) clearInterval(attackAnimRef.current);
            attackAnimRef.current = setTimeout(() => setAttack(false), 1500);
        }, 3000 + Math.random() * 3000);
    }, []);
    
    return <div className={
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
        {<FloatCharInfo isShowInfo={true} id={id}/>}
    </div>
}