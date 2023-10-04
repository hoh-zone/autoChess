import { Button, Center, HStack, Spacer, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { loseA, moneyA as moneyAtom, nameA, stageAtom, winA } from "../../store/stages"
import { FightV2 } from "../FightV2";

export const Header = () => {
    const [money] = useAtom(moneyAtom);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const [name, _setName] = useAtom(nameA);
    const [stage, setStage] = useAtom(stageAtom);

    return <HStack className="h-[10%] bg-slate-700 text-white px-8" spacing={8}>
        <Button onClick={async () => {
            setStage("init");
        }}
        >⬅</Button>
        <Text>Name: {name}</Text>
        <Text>Money: {money}</Text>
        <Text>Win: {win}</Text>
        <Text>Lose: {lose}</Text>
        <Spacer />
        <FightV2 />
    </HStack>
}