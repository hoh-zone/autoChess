import { Box, Button, Center, HStack, Img, Input, Spinner, Stack } from "@chakra-ui/react"
import { moneyA, stageAtom } from "../../store/stages";
import { useAtom } from "jotai";
import useMintChess from "../button/MintChess";
import { Character } from "../character/character";
import useQueryChesses from "../button/QueryAllChesses";
import { useEffect, useState } from "react";
import { useSyncGameNFT } from "../../hooks/useSyncGameNFT";
import { GameNft } from "../../types/nft";
import useQueryFight from "../button/QueryFightResult";
import { ethos } from "ethos-connect";
import { Rank } from "../Rank";

export const StartGame = () => {
    const [stage, setStage] = useAtom(stageAtom);
    const { nftObjectId, mint } = useMintChess();
    const [inputValue, setInputValue] = useState('');
    const { nfts, query_chesses } = useQueryChesses();
    const syncGameNFT = useSyncGameNFT();
    const { status } = ethos.useWallet();
    const [isLoading, setIsLoading] = useState(false);

    // query chesses when wallet connected
    useEffect(() => {
        if (status !== 'connected') return;

        async function fetch() {
            setIsLoading(false);
            await query_chesses();
            setIsLoading(true);
        }
        fetch();

    }, [status, query_chesses]);

    return (
        <Center className="h-full w-full relative">

            <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
                <source src="bg7.mp4" type="video/mp4" />
            </video>
            <div className="absolute text-white top-12 z-50">
                <HStack>
                    <Stack className="items-center text-center" gap={4}>
                        <div className="mb-12">
                            <p style={{ marginBottom: '50px', fontSize: '100px' }}>Auto<br />Chess</p>
                            {isLoading ? <div>Continue Game:</div> : <Spinner />}
                            {
                                nfts.map((nft, index) => (
                                    <Button
                                        key={nft.id.id}
                                        className=" bg-slate-200"
                                        fontSize={"x-small"}
                                        onClick={async () => {
                                            syncGameNFT(nft);
                                            setStage("shop");
                                        }}
                                    >{"name: " + nft.name + " status: " + nft.win + " - " + nft.lose}</Button>
                                ))}
                        </div>

                        <Input
                            type="text"
                            className='custom-input'
                            width="300px"
                            value={inputValue}
                            placeholder="Enter your name"
                            onChange={(v) => setInputValue(v.target.value)} />
                        <Button
                            onClick={async () => {
                                await mint({ username: inputValue });
                                if (nftObjectId) {
                                    setStage("shop");
                                }
                            }}
                        >Start New Game</Button>
                    </Stack>
                </HStack>
            </div>
            <div className="absolute top-0 right-0 m-4">
                <Rank />
            </div>
            <HStack className="w-full flex justify-around absolute bottom-[5%]">
                <Character charType="archer" isOpponent={false} />
                <Character charType="shaman" isOpponent={false} />
                <Character charType="slime" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around absolute bottom-[15%] pl-24">
                <Character charType="assa" isOpponent={false} />
                <Character charType="tank" isOpponent={false} />
                <Character charType="shaman" isOpponent={true} />
                <Character charType="tree" isOpponent={true} />
            </HStack>
            <HStack className="w-full flex justify-around absolute bottom-[25%] pr-12"  >
                <Character charType="firemega" isOpponent={false} />
                <Character charType="golem" isOpponent={false} />
                <Character charType="mega" isOpponent={true} />
                <Character charType="fighter" isOpponent={true} />
            </HStack>
        </Center >
    )
}