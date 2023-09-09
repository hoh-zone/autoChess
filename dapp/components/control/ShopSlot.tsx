import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { selectedShopSlot, shopCharacter } from "../../store/stages"
import { getCharacter } from "../character/getCharacter"

export const ShopSlot = ({ id }: {
    id: number
}) => {
    const [slotNumber, setSlotNumber] = useAtom(selectedShopSlot)
    const selected = (slotNumber === id);

    const [shopChars, setShopChars] = useAtom(shopCharacter)
    const char = shopChars[id];

    return <div className={
        twMerge(
            "w-24 h-24 relative rounded-xl",
            "border-4 border-transparent z-20",
            selected ? "border-slate-800" : ""
        )
    }
        onClick={() => setSlotNumber(id)}
    >
        <div className="slot rounded-full w-full h-24 bg-slate-400 absolute bottom-[-3rem]" />
        <div className="absolute bottom-[-2rem] left-1/2" >1</div>

        <div className="absolute  top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }} >
            {char && <Character
                {...getCharacter(char)} />
            }
        </div>
    </div>
}