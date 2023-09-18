import { useAtom } from "jotai";
import { chessId, enemyCharacter, enemyNameA, stageAtom } from "../store/stages";
import useOperateAndMatch from "./button/OperateAndMatch";
import useQueryFight from "./button/QueryFightResult";
import { Button } from "@chakra-ui/react";
import { useFight } from "../hooks/useFight";
import { useEffect } from "react";
import { CharacterFields } from "../types/nft";

export const Fight = () => {
    const { nftObjectId, operate_submit } = useOperateAndMatch();
    const { query_fight } = useQueryFight();
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [enemyName, setEnemyName] = useAtom(enemyNameA);
    const [stage, setStage] = useAtom(stageAtom);
    const [chess_id] = useAtom(chessId);
    const fight = useFight();

    useEffect(() => {
        if (stage === "fight") {
            fight();
        }
    }, [stage]);

    return <>
    { stage === "shop" && <Button className="" onClick={async () => {
        // let success = await operate_submit();
        // if (!success) {
        //     return;
        // }
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