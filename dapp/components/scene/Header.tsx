import { HStack, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { loseA, moneyA as moneyAtom, nameA, winA } from "../../store/stages"

export const Header = () => {
    const [money] = useAtom(moneyAtom);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const [name, _setName] = useAtom(nameA);
    
    return <HStack flexBasis={"8%"} className="bg-slate-700 text-white">
        <Text>Name: {name}</Text>
        <Text>Money: {money}</Text>
        <Text>Win: {win}</Text>
        <Text>Lose: {lose}</Text>
    </HStack>
}