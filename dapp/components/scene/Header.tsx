import { Button, Center, HStack, Spacer, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { loseA, moneyA as moneyAtom, nameA, stageAtom, winA, challengeWinA, challengeLoseA} from "../../store/stages"
import { Fight } from "../Fight";

export const Header = () => {
    const [money] = useAtom(moneyAtom);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const [challengeWin, _setChallengeWin] = useAtom(challengeWinA);
    const [challengeLose, _setChallengeLose] = useAtom(challengeLoseA);
    const [name, _setName] = useAtom(nameA);
    const [stage, setStage] = useAtom(stageAtom);

    return <HStack className="w-full h-[10%] bg-slate-700 text-white px-8 absolute z-[100]" spacing={8}>
        <Button onClick={async () => {
            setStage("init");
        }}
        >⬅</Button>
        <Text>Name: {name}</Text>
        <Text>Money: {money}</Text>
        <Text>Win: {win}</Text>
        <Text>Lose: {lose}</Text>
        {win >= 10 && <Text>ChallengeWin: {challengeWin}</Text> }
        {win >= 10 && <Text>ChallengeLose: {challengeLose}</Text>}
        <Spacer />
        <Fight />
    </HStack>
}