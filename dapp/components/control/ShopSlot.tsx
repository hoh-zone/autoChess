import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { selectedShopSlot, selectedSlot, shopCharacter, slotCharacter } from "../../store/stages"
import { removeSuffix } from "../../utils/removeSuffix"

export const ShopSlot = ({ id }: {
    id: number
}) => {
    const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot)
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot)
    const selected = (shopSlotNumber === id);
    const [shopChars, setShopChars] = useAtom(shopCharacter)
    const char = shopChars[id];

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
        <div className="absolute bottom-[-2rem] left-1/2" style={{marginLeft:'40px'}}>
             <p>{char && char.name}</p>
             <p>price:{char && char.price}</p>
             <p>level:{char && char.level}</p>
             <p>attack:{char && char.attack}</p>
             <p>life:{char && char.life}</p>
        </div>

        <div className="absolute  top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }} >
            {char && <Character
                charType={removeSuffix(char.name)}
            />
            }
        </div>
    </div>
}