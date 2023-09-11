import { Button, Center, Input, Stack } from "@chakra-ui/react"
import { stageAtom } from "../../store/stages";
import { useAtom } from "jotai";

export const StartGame = () => {
    const [stage, setStage] = useAtom(stageAtom);

    return (
        <Center className="h-full w-full">
            <Stack className="items-center" gap={4}>
                <Input placeholder="Enter your name" />
                <Button
                    onClick={() => setStage("shop")}
                >Start Game</Button>
            </Stack>
        </Center>
    )
}