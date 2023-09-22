import { useAtom } from "jotai";
import { chessId, enemyCharacter, enemyNameA, stageAtom, winA, loseA } from "../store/stages";
import useOperateAndMatch from "./button/OperateAndMatch";
import useQueryFight from "./button/QueryFightResult";
import { useFight } from "../hooks/useFight";
import { useEffect } from "react";
import { CharacterFields } from "../types/nft";
import { Button, useToast } from '@chakra-ui/react'

export const Fight = () => {
    const { nftObjectId, operate_submit } = useOperateAndMatch();
    const { query_fight } = useQueryFight();
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [enemyName, setEnemyName] = useAtom(enemyNameA);
    const [stage, setStage] = useAtom(stageAtom);
    const [chess_id] = useAtom(chessId);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const toast = useToast();
    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    const fight = useFight();
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
        let success = await operate_submit();
        if (!success) {
            return;
        }
        console.log("start fight");
  
        // sync enemy
        let json = await query_fight(chess_id);
        let enemy:CharacterFields[] = json['v2_lineup']['roles'];
        let name = json['v2_name'];
        setEnemyName(name);
        enemy.map((role) => {
            role.base_life = role.life;
        })
        setEnemyChars(enemy);
        setStage("fight");
    }}> Fight </Button>    }
    </>
}