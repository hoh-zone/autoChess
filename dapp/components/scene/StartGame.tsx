import { Box, Button, Center, HStack, Input, Spinner, Stack } from "@chakra-ui/react"
import { moneyA, stageAtom } from "../../store/stages";
import { useAtom } from "jotai";
import mint_chess from "../button/MintChess";
import { Character } from "../character/character";
import useQueryChesses from "../button/QueryAllChesses";
import { useEffect, useState } from "react";
import { useSyncGameNFT } from "../../hooks/useSyncGameNFT";
import { GameNft } from "../../types/nft";
import useQueryFight from "../button/QueryFightResult";
import { ethos } from "ethos-connect";

const parse_nft = (nfts: GameNft[]) => {
    return nfts.map((nft) => ({
        text: "name : " + nft.name + " life : " + nft.life + " gold : " + nft.gold + " status : " + nft.win + " - " + nft.lose,
        id: nft.id.id,
        cards_pool: nft.cards_pool.fields
    }));
}

export const StartGame = () => {
    const [stage, setStage] = useAtom(stageAtom);
    const { nftObjectId, mint } = mint_chess();
    const [inputValue, setInputValue] = useState('');
    const { nfts, query_chesses } = useQueryChesses();
    const { ranks, query_fight_rank } = useQueryFight();
    const syncGameNFT = useSyncGameNFT();
    const [selectedGameNFT, setSelectedGameNFT] = useState('');
    const { status } = ethos.useWallet();
    const [isLoading, setIsLoading] = useState(false);

    // query chesses when wallet connected
    useEffect(() => {
        if(status !== 'connected') return;

        async function fetch() {
            setIsLoading(false);
            await Promise.all([query_chesses(), query_fight_rank()]);
            setIsLoading(true);
        }
        fetch();
        
    },[status, query_chesses, query_fight_rank]);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGameNFT(event.target.value);
    };
    const nft_options = parse_nft(nfts);
    return (
        <Center className="h-full w-full">

            <video style={{ width: '100%', height: '100%' }} autoPlay loop muted>
                <source src="bg7.mp4" type="video/mp4" />
            </video>
            <div className="text-start-game">
                <HStack>
                    <Stack className="items-center" gap={4}>
                        <div>
                            <p style={{marginBottom:'50px', fontSize:'100px'}}>Auto Chess</p>
                            {nft_options.length > 0 ? <text>My Chesses:</text> : <Spinner/>}
                            {
                                nft_options.map((nft, index) => (
                                    <div key={index}>
                                        <label >
                                            <input
                                                type="radio"
                                                value={nft.id}
                                                checked={selectedGameNFT === nft.id}
                                                onChange={handleOptionChange}
                                            />
                                            {nft.text}
                                        </label>
                                    </div>))}
                                    
                            {nft_options.length > 0 &&
                                <Button
                                    onClick={async () => {
                                        const nft = nfts.find(nft => nft.id.id === selectedGameNFT);
                                        if (!nft) throw new Error("nft not found");
                                        console.log(nft.id);
                                        syncGameNFT(nft);
                                        setStage("shop");
                                    }}
                                >Continue Game</Button>}

                        </div>
                        <Input
                            type="text"
                            className='custom-input'
                            value={inputValue}
                            placeholder="Enter your name"
                            onChange={(v) => setInputValue(v.target.value)} />
                        <Button
                            onClick={async () => {
                                await mint({ username: inputValue });
                                setStage("shop");
                            }}
                        >Start New Game</Button>
                    </Stack>
                    {ranks && ranks.length > 0 &&
                        <div style={{ marginLeft: '100px' }}>
                            <p>Rank:</p>
                            {
                                ranks.map((fight) => (
                                    <p>{fight}</p>
                                ))}
                        </div>}
                </HStack>
                <div className="flex place-items-end" style={{ position: "absolute", transform: 'translate(-50%, 70%)' }}>
                    <Character charType="archer" isOpponent={false} />
                    <Character charType="shaman" isOpponent={false} />
                    <Character charType="slime" isOpponent={true} />
                </div>
                <div className="flex place-items-end" style={{ position: "absolute", transform: 'translate(-30%, 90%)' }}>
                    <Character charType="assa" isOpponent={false} />
                    <Character charType="tank" isOpponent={false} />
                    <Character charType="shaman" isOpponent={true} />
                    <Character charType="tree" isOpponent={true} />
                </div>
                <div className="flex place-items-end" style={{ position: "absolute", transform: 'translate(-40%, 110%)' }}>
                    <Character charType="firemega" isOpponent={false} />
                    <Character charType="golem" isOpponent={false} />
                    <Character charType="mega" isOpponent={true} />
                    <Character charType="fighter" isOpponent={true} />
                </div>
            </div>
        </Center>
    )
}