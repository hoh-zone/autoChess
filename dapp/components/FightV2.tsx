import { useAtom } from "jotai";
import { chessId, enemyCharacterV2, stageAtom, winA, loseA, slotCharacterV2, operationsA, enemyNameA } from "../store/stages";
import useOperateAndMatch from "./button/OperateAndMatchV2";
import useQueryFight from "./button/QueryFightResult";
import { useFightV2 } from "../hooks/useFight_v2";
import { useEffect } from "react";
import { Button, useToast } from '@chakra-ui/react'
import { get_chars } from "./character/rawDataV2";
import { CharacterFields } from "../types/nft";

export const FightV2 = () => {
    const { nftObjectId, operate_submit } = useOperateAndMatch();
    const { query_fight } = useQueryFight();
    const [enemyName, setEnemyName] = useAtom(enemyNameA);
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacterV2);
    const [chars, setChars] = useAtom(slotCharacterV2);
    const [operations, setOperations] = useAtom(operationsA);
    const [stage, setStage] = useAtom(stageAtom);
    const [chess_id] = useAtom(chessId);
    const [win, _setWin] = useAtom(winA);
    const [lose, _setLose] = useAtom(loseA);
    const toast = useToast();

    const fight = useFightV2();
    const init_chars = () => {
        console.log("初始化角色");
        let chars_names = ["archer3", "shinobi3", "ani1", "ani3"];
        let enemy_names = ["priest3", "priest3", "priest2", "archer2"];
        let init_chars = get_chars(chars_names);
        let init_enemys = get_chars(enemy_names);
        chars.map((chr, index) => {
            chars[index] = init_chars[index];
        })
        enemyChars.map((chr, index) => {
            console.log("set:", index, init_enemys[index]);
            enemyChars[index] = init_enemys[index];
            console.log("1: ", enemyChars[index]);
            console.log("2: ", enemyChars);
        });
        console.log("all set:", enemyChars);
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
        let success = await operate_submit(operations);
        setOperations([]);
        if (!success) {
            return;
        }

        let json = await query_fight(chess_id);
        let enemys:CharacterFields[] = json['v2_lineup']['roles'];
        console.log("json res: ", enemys);
        enemys.map((ele) => {
            ele.magic = 0;
            ele.life = Number(ele.life);
            ele.max_life = Number(ele.life);
            ele.attack = Number(ele.attack);
        })
        let name = json['v2_name'];
        setEnemyName(name);
        setEnemyChars(enemys);
        setStage("fight");
    }}> FightV2 </Button>    }
    </>
}