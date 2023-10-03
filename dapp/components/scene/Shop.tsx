import { Box, Button, HStack, useToast } from "@chakra-ui/react"
import { ShopSlot } from "../control/ShopSlot"
import { useAtom } from "jotai"
import { moneyA as moneyAtom, operationsA, shopCharacter, stageAtom } from "../../store/stages"

export const Shop = () => {
    const [stage, setStage] = useAtom(stageAtom);
    const [money, setMoney] = useAtom(moneyAtom);
    const [chars, setChars] = useAtom(shopCharacter);
    const [operations, setOperations] = useAtom(operationsA);
    const toast = useToast()

    function refresh_failed_toast() {
        toast({
            title: 'Money is not enough',
            status: 'warning',
            duration: 2000,
            isClosable: true,
        })
    }

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
                            if (money < 2) {
                                refresh_failed_toast();
                                return;
                            }
                            if (chars.length <= 5) {
                                toast({
                                    title: 'Refresh limit exceeded',
                                    status: 'warning',
                                    duration: 2000,
                                    isClosable: true,
                                })
                                return;
                            }
                            setMoney(money - 2);
                            setChars(chars.slice(5));
                            operations.push("refresh");
                        }
                    }>Refresh(-2💰)
                </Button>
            </HStack>
        </HStack>
    </Box>
}
