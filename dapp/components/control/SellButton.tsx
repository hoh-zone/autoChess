import { Button } from "@chakra-ui/react"
import { useAtom } from "jotai";
import { moneyA as moneyAtom, operationsA, selectedSlot, slotCharacter } from "../../store/stages";
import { get_sell_price } from "../character/rawData";

export const SellButton = () => {
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot);
    const [chars, setChars] = useAtom(slotCharacter);
    const [money, setMoney] = useAtom(moneyAtom);
    const [operations, setOperations] = useAtom(operationsA);
    return (
        <Button
            colorScheme='blue'
            isDisabled={slotNumber === null || !chars[slotNumber]}
            onClick={() => {
                if(slotNumber !== null) {
                    setMoney(money + get_sell_price(chars[slotNumber]));
                    operations.push("sell");
                    operations.push(slotNumber.toString());
                    chars[slotNumber] = null;
                    setSlotNumber(null);
                    setChars(chars);
                }
            }}
        >Sell(
        {slotNumber != null && chars[slotNumber] != null &&
            <p>+{get_sell_price(chars[slotNumber])}</p>
        }💰)
        </Button>
    )
}