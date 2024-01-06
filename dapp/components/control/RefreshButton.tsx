import { Button, useToast } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { moneyA as moneyAtom, operationsA, shopCharacter, stageAtom } from "../../store/stages"

export const RefreshButton = () => {
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
    return <Button colorScheme='blue'
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
}