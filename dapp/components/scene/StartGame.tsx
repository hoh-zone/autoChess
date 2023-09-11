import { Box, Button, Center, HStack, Input, Stack } from "@chakra-ui/react"
import { money, stageAtom } from "../../store/stages";
import { useAtom } from "jotai";
import mint_chess from "../button/MintChess";
import { Character } from "../character/character";
import QueryChesses from "../button/QueryAllChesses";
import { useState } from "react";

const parse_nft = (nfts:string[] | null) => {
    if (!nfts) {
        return []
    }
    let res_array:any[] = [];
    for (let i = 0; i < nfts.length; i++) {
        let json = JSON.parse(nfts[i])['fields']
        console.log(JSON.parse(nfts[i]));
        let life = json['life'];
        let name = json['name'];
        let gold = json['gold'];
        let win = json['win'];
        let lose = json['lose'];
        let res = {
            text: "name : " + name + " life : " + life + " gold : " + gold + " status : " + win + " - " + lose,
            id: json['id']['id'],
            cards_pool : json['cards_pool']['fields']
        }
        res_array.push(res);
    }
    return res_array;
}

export const StartGame = () => {
    const [stage, setStage] = useAtom(stageAtom);
    // const [gold, setGold] = useAtom(money);
    const {nftObjectId, mint } = mint_chess();
    const [inputValue, setInputValue] = useState('');
    const {nfts, query_chesses} = QueryChesses();

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedNftINfo, setSelectedNftInfo] = useState({
        text: "",
        id: "",
        cards_pool : []
    });
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let json = JSON.parse(event.target.value);
        setSelectedOption(json['id']);
        setSelectedNftInfo(json);
    };

    const nft_options = parse_nft(nfts);
  
    return (
        <Center className="h-full w-full">
            <video style={{width:'100%', height:'100%'}}autoPlay loop muted>
            <source src="bg7.mp4" type="video/mp4" />
            </video>
            <div className="text-start-game">
                <Stack className="items-center" gap={4}>
                    <div>
                    {nft_options.length > 0 && <text>历史棋局</text>}
                    {
                        nft_options.map((nft, index) => (
                        <div>
                            <label key={index}>
                                <input
                                    type="radio"
                                    value={JSON.stringify(nft)}
                                    checked={selectedOption === nft.id}
                                    onChange={handleOptionChange}
                                />
                                {nft.text}

                            </label>
                        </div>))
                    }
                    <Button
                        onClick={async () => {
                            let cards_pool = selectedNftINfo['cards_pool'];
                            alert(JSON.stringify(cards_pool));
                            setStage("shop");
                        }}
                        >Continue Game</Button>
                    </div>
                    <Input className = 'custom-input' value={inputValue} placeholder="Enter your name" />
                    <Button
                        onClick={async () => {
                            await mint({username:inputValue});
                            setStage("shop");
                        }}
                    >Start New Game</Button>
                    <Button
                        onClick={async () => {
                            await query_chesses();
                        }}
                    >Query</Button>
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