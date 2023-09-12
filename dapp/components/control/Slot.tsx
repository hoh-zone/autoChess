import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { enemyCharacter, moneyA as moneyAtom, selectedShopSlot, selectedSlot, shopCharacter, slotCharacter } from "../../store/stages"
import { removeSuffix } from "../../utils/removeSuffix";

const PRICE = 3;

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
    let char:any;
    if (id >= 6) {
        char = enemyChars[id - 6];
    } else {
        char = chars[id];
    }
    const selected = (slotNumber === id);

    const canUpgrade = (char1:any, char2:any) => {
        if (char1 == null || char2 == null) {
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
    const upgrade = (level:any) => {
        if (level == 1) {
            return 2;
        } else if (level == 2) {
            return 3;
        } else if (level == 3) {
            return 6;
        } else if (level == 6) {
            return 9;
        } else {
            return -1;
        }
    }

    return <div className={
        twMerge(
            "w-24 h-24 relative rounded-xl",
            "border-4 border-transparent z-20",
            isOpponent ? "pointer-events-none" : "hover:border-slate-300",
            selected ? "border-slate-800" : ""
        )}
        onClick={() => {
            // try to buy
            if (shopSlotNumber !== null && !char) {
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

            // swap or upgrad chars
            else if (slotNumber !== null && slotNumber !== id) {
                const temp = chars[id];
                chars[id] = chars[slotNumber];
                if (canUpgrade(chars[id], temp)) {
                    console.log("compose action");
                    chars[slotNumber] = null;
                    if (temp && temp.level) {
                        temp.level = upgrade(temp.level);
                    }
                    chars[id] = temp;
                    setChars(chars);
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
                setSlotNumber(id);
                setShopSlotNumber(null);
            }
        }}
    >
        <div className="slot rounded-full w-full h-24 bg-slate-400 absolute bottom-[-3rem]" />
        <div className="absolute bottom-[-2rem] left-1/2" >
             <p>{char && char.name}</p>
             <p>level:{char && char.level}</p>
        </div>

        <div className="absolute  top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }} >
            {char && char.name && <Character
                charType={removeSuffix(char.name)}
                isOpponent={isOpponent} />
            }
        </div>
    </div >
}