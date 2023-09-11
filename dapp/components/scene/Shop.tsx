import { Box, Button, HStack } from "@chakra-ui/react"
import { ShopSlot } from "../control/ShopSlot"
import { useAtom } from "jotai"
import { money as moneyAtom, shopCharacter } from "../../store/stages"

export const Shop = () => {
    const [money, setMoney] = useAtom(moneyAtom);
    const [chars, setChars] = useAtom(shopCharacter);

    return <Box flexBasis={"15%"} className="bg-indigo-200">
        <HStack className="justify-around relative top-[-20px] " gap={0}>
            <ShopSlot id={0} />
            <ShopSlot id={1} />
            <ShopSlot id={2} />
            <ShopSlot id={3} />
            <ShopSlot id={4} />

            <HStack className="relative top-[20px]">
                <Button className=""
                    onClick={
                        () => {
                            if (money < 2) return;
                            setMoney(money-2);
                            setChars(chars.slice(5));
                        }
                    }>Refresh(-2💰)
                </Button>
                <Button className="" onClick={()=>{}}>Fight</Button>
            </HStack>
        </HStack>
    </Box>
}
