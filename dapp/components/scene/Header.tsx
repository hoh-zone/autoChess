import { Center, HStack, Spacer, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { loseA, moneyA as moneyAtom, nameA, stageAtom, winA } from "../../store/stages"
import { Fight } from "../Fight";

export const Header = () => {
    const [money] = useAtom(moneyAtom);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const [name, _setName] = useAtom(nameA);
    const [stage, setStage] = useAtom(stageAtom);
    
    return <HStack flexBasis={"8%"} className="bg-slate-700 text-white px-8" spacing={8}>
        <Text>Name: {name}</Text>
        <Text>Money: {money}</Text>
        <Text>Win: {win}</Text>
        <Text>Lose: {lose}</Text>
        <Spacer/>
        <Fight/>
    </HStack>
}