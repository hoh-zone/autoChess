import { Button } from "@chakra-ui/react"
import { useAtom } from "jotai";
import { moneyA as moneyAtom, selectedSlot, slotCharacter } from "../../store/stages";

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
                    chars[slotNumber] = null;
                    setSlotNumber(null);
                    setChars(chars);
                    setMoney(money + 2);
                }
            }}
        >Sell(+2💰)</Button>
    )
}