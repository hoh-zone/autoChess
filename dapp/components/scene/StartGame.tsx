import { Box, Button, Center, HStack, Input, Stack } from "@chakra-ui/react"
import { stageAtom } from "../../store/stages";
import { useAtom } from "jotai";
import useMint from "../MintCoin";
import { Character } from "../character/character";

export const StartGame = () => {
    const [stage, setStage] = useAtom(stageAtom);
    const { nftObjectId, mint } = useMint();
    return (
        <Center className="h-full w-full">
            <video style={{width:'100%', height:'100%'}}autoPlay loop muted>
                <source src="bg7.mp4" type="video/mp4" />
            </video>
            <div className="text-start-game">
                <Stack className="items-center" gap={4}>
                    <Input className = 'custom-input' placeholder="Enter your name" />
                    <Button
                        onClick={async () => {
                            await mint();
                            setStage("shop");
                        }}
                    >Start Game</Button>
                </Stack>
                <div className="flex place-items-end" style={{position:"absolute",transform: 'translate(-50%, 70%)'}}>
                    <Character charType="archer" isOpponent={false} />
                    <Character charType="shaman" isOpponent={false} />
                    <Character charType="slime" isOpponent={true}/>
                </div>
                <div className="flex place-items-end" style={{position:"absolute",transform: 'translate(-30%, 90%)'}}>
                    <Character charType="assa" isOpponent={false} />
                    <Character charType="tank" isOpponent={false} />
                    <Character charType="shaman" isOpponent={true} />
                    <Character charType="tree" isOpponent={true} />
                </div>
                <div className="flex place-items-end" style={{position:"absolute",transform: 'translate(-40%, 110%)'}}>
                    <Character charType="firemega" isOpponent={false} />
                    <Character charType="golem" isOpponent={false} />
                    <Character charType="mega" isOpponent={true} />
                    <Character charType="fighter" isOpponent={true} />
                </div>
            </div>
        </Center>
    )
}