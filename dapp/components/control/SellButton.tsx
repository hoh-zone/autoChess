import { Button } from "@chakra-ui/react"
import { useAtom } from "jotai";
import { moneyA as moneyAtom, operationsA, selectedSlot, slotCharacterV2 } from "../../store/stages";
import { get_sell_price } from "../character/rawDataV2";

export const SellButton = () => {
    const [slotNumber, setSlotNumber] = useAtom(selectedSlot);
    const [chars, setChars] = useAtom(slotCharacterV2);
    const [money, setMoney] = useAtom(moneyAtom);
    const [operations, setOperations] = useAtom(operationsA);
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
                    setMoney(money + get_sell_price(chars[slotNumber]));
                    operations.push("sell:" + slotNumber);
                }
            }}
        >Sell(
        {slotNumber != null && chars[slotNumber] != null &&
            <p>+{get_sell_price(chars[slotNumber])}</p>
        }💰)
        </Button>
    )
}