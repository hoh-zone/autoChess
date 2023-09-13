import { useAtom } from "jotai";
import { chessId, enemyCharacter, enemyNameA, stageAtom } from "../store/stages";
import useOperateAndMatch from "./button/OperateAndMatch";
import useQueryFight from "./button/QueryFightResult";
import { Button } from "@chakra-ui/react";
import { useFight } from "../hooks/useFight";
import { useEffect } from "react";

export const Fight = () => {
    const { nftObjectId, operate_submit } = useOperateAndMatch();
    const { query_fight } = useQueryFight();
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);
    const [enemyName, setEnemyName] = useAtom(enemyNameA);
    const [stage, setStage] = useAtom(stageAtom);
    const fight = useFight();

    useEffect(() => {
        if (stage === "fight") {
            fight();
        }
    }, [stage]);

    return <Button className="" onClick={async () => {
        await operate_submit();
        console.log("start fight");

        // sync enemy
        let json = await query_fight();
        let enemy = json['v2_lineup']['roles'];
        let name = json['v2_name'];
        setEnemyName(name);
        setEnemyChars(enemy);
        setStage("fight");
    }}> Fight </Button>
}