import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { money as moneyAtom, selectedShopSlot, selectedSlot, shopCharacter, slotCharacter } from "../../store/stages"
import { getCharacter } from "../character/getCharacter"

const PRICE = 3;

export const Slot = ({ isOpponent = false, id }: {
    isOpponent?: boolean
    id: number
}) => {
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot);
    const [chars, setChars] = useAtom(slotCharacter);

    const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot);
    const [shopChars, setShopChars] = useAtom(shopCharacter);

    const [money, setMoney] = useAtom(moneyAtom);

    const char = chars[id];

    const selected = (slotNumber === id);

    return <div className={
        twMerge(
            "w-24 h-24 relative rounded-xl",
            "border-4 border-transparent z-20",
            isOpponent ? "pointer-events-none" : "hover:border-slate-300",
            selected ? "border-slate-800" : ""
        )}
        onClick={() => {
            // try to buy
            if (shopSlotNumber !== null && char === null) {
                if (money >= PRICE) {
                    setMoney(money - PRICE);

                    chars[id] = shopChars[shopSlotNumber];
                    shopChars[shopSlotNumber] = null;
                    setChars(chars);
                    setShopChars(shopChars);

                    setShopSlotNumber(null);
                    setSlotNumber(null);
                }
            }
            // swap two char
            else if(slotNumber !== null && slotNumber !== id) {
                const temp = chars[id];
                chars[id] = chars[slotNumber];
                chars[slotNumber] = temp;
                setChars(chars);

                setSlotNumber(null);
                setShopSlotNumber(null);
            }
            else {
                setSlotNumber(id);
                setShopSlotNumber(null);
            }
        }}
    >
        <div className="slot rounded-full w-full h-24 bg-slate-400 absolute bottom-[-3rem]" />
        <div className="absolute bottom-[-2rem] left-1/2" >1</div>

        <div className="absolute  top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }} >
            {char && <Character
                {...getCharacter(char)}
                isOpponent={isOpponent} />
            }
        </div>
    </div >
}