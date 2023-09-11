import { Button, Center, Input, Stack } from "@chakra-ui/react"
import { stageAtom } from "../../store/stages";
import { useAtom } from "jotai";
import useMint from "../MintCoin";

export const StartGame = () => {
    const [stage, setStage] = useAtom(stageAtom);
    const { nftObjectId, mint } = useMint();
    return (
        <Center className="h-full w-full" style={{ background: "black"}}>
            <Stack className="items-center" gap={4}>
                <Input placeholder="Enter your name" />
                <Button
                    onClick={async () => {
                        await mint();
                        setStage("shop");
                    }}
                >Start Game</Button>
            </Stack>
        </Center>
    )
}