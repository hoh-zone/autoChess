import { HStack, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { money as moneyAtom } from "../../store/stages"

export const Header = () => {
    const [money] = useAtom(moneyAtom);
    return <HStack flexBasis={"8%"} className="bg-slate-700 text-white">
        <Text>Money: {money}</Text>
    </HStack>
}