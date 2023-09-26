import { useAtom } from "jotai";
import { chessId, enemyCharacterV2, stageAtom, winA, loseA, slotCharacterV2 } from "../store/stages";
import useOperateAndMatch from "./button/OperateAndMatch";
import useQueryFight from "./button/QueryFightResult";
import { useFightV2 } from "../hooks/useFight_v2";
import { useEffect } from "react";
import { CharacterFields } from "../types/nft";
import { Button, useToast } from '@chakra-ui/react'
import { get_chars } from "./character/rawDataV2";
import { range } from "lodash";

export const FightV2 = () => {
    // const { nftObjectId, operate_submit } = useOperateAndMatch();
    // const { query_fight } = useQueryFight();
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacterV2);
    const [chars, setChars] = useAtom(slotCharacterV2);

    const [stage, setStage] = useAtom(stageAtom);
    const [chess_id] = useAtom(chessId);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const toast = useToast();

    const fight = useFightV2();
    const init_chars = () => {
        console.log("初始化角色");
        let chars_names = ["char1"];
        let enemy_names = ["char1"];
        let init_chars = get_chars(chars_names);
        let init_enemys = get_chars(enemy_names);
        chars.map((chr, index) => {
            chars[index] = init_chars[index];
        })
        enemyChars.map((chr, index) => {
            enemyChars[index] = init_enemys[index];
        })
    }
    useEffect(() => {
        if (stage === "fight") {
            fight();
        }
    }, [stage]);
    return <>
    { stage === "shop" && <Button className="" onClick={async () => {
        if (win >= 10) {
            toast({
                title: 'The game ends with 10 wins',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        };
        if (lose >= 3) {
            toast({
                title: 'The game ends with 3 loses',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            return;
        }
        init_chars();
        setStage("fight");
    }}> FightV2 </Button>    }
    </>
}