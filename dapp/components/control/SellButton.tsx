import { Button } from "@chakra-ui/react"
import { useAtom } from "jotai";
import { moneyA as moneyAtom, selectedSlot, slotCharacter } from "../../store/stages";
import { get_sell_price } from "../character/rawData";

export const SellButton = () => {
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot);
    const [chars, setChars] = useAtom(slotCharacter);
    const [money, setMoney] = useAtom(moneyAtom);
    
    return (
        <Button
            colorScheme='blue'
            isDisabled={slotNumber === null || !chars[slotNumber]}
            onClick={() => {
                if(slotNumber !== null) {
                    let name = chars[slotNumber]?.name;
                    chars[slotNumber] = null;
                    setSlotNumber(null);
                    setChars(chars);
                    setMoney(money + get_sell_price(name));
                }
            }}
        >Sell(
        {slotNumber != null && chars[slotNumber] != null &&
            <p>+{get_sell_price(chars[slotNumber]?.name)}</p>
        }💰)
        </Button>
    )
}