
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { useEffect } from "react";
import { HStack, Img } from "@chakra-ui/react";
import { loseA, nameA, enemyNameA, slotCharacter, winA, enemyWinA, enemyLoseA, fightingIndex, enemyFightingIndex} from "../../store/stages";
import { moneyA as moneyAtom} from "../../store/stages"
import { get_total_life } from "../character/rawData";

export const StatusBar = ({ isOpponent = false}: {
    isOpponent?: boolean
}) => {
    const [lose, _setLose] = useAtom(loseA);
    const [win, _setWin] = useAtom(winA);
    const [chars] = useAtom(slotCharacter);
    const [money] = useAtom(moneyAtom);
    const [name] = useAtom(nameA);
    const [enemy_name] = useAtom(enemyNameA);
    const [enemy_win] = useAtom(enemyWinA);
    const [enemy_lose] = useAtom(enemyLoseA);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);

    const get_width_by_life = (char:any) => {
        let start = isOpponent? 10: 60;
        let end = isOpponent? 335: 330;
        let total = get_total_life(char);
        let life = char == null ? 0 : char.life;
        return start + (life/total) * end
    }

    const get_bg1_url = () => {
        if (isOpponent) {
            return "url('health_right_bg.png') no-repeat"
        } else {
            return "url('health_left_bg.png') no-repeat"
        }
    }

    const get_bg2_url = () => {
        if (isOpponent) {
            return "url('health_right_life.png') no-repeat"
        } else {
            return "url('health_left_life.png') no-repeat"
        }
    }

    const get_bg_direction = () => {
        if (isOpponent) {
            return "right"
        } else {
            return "left"
        }
    }

    const get_bar_direction = () => {
        if (isOpponent) {
            return "left"
        } else {
            return "left"
        }
    }
    let char: CharacterFields | null = null;
    char = chars[isOpponent ? enemy_fight_index : fight_index];
    return <div style={{width:'500px'}}>
        {!isOpponent ? 
        <HStack style={{justifyContent:`${get_bg_direction()}`}}>
            <Img src="avatar.png" style={{width:'100px'}}/>
            <p style={{bottom:'0'}}>{isOpponent ? enemy_name : name}</p>
        </HStack>
        : 
        <HStack style={{justifyContent:`${get_bg_direction()}`}}>
            <p style={{bottom:'0'}}>{isOpponent ? enemy_name : name}</p>
            <Img src="avatar.png" style={{width:'100px'}}/>
        </HStack>}
        <HStack style={{justifyContent:`${get_bg_direction()}`}}>
            <div style={{ justifyContent:`${get_bg_direction()}` ,width: '400px', height: '60px', background: `${get_bg1_url()}`, backgroundSize: '400px auto', backgroundPosition: `${get_bg_direction()}` }}>
                <div style={{ width:  `${get_width_by_life(char)}px`, height: '60px', background: `${get_bg2_url()}`, backgroundSize: '400px auto', backgroundPosition: `${get_bar_direction()}` }}></div>
            </div>
        </HStack>
        <HStack style={{marginLeft:'70px'}}>
            <Img src="gold.png" style={{width:'23px'}}/>
            <p style={{marginRight:'30px'}}>{money}</p>
            {lose == 0 && <HStack>
                <Img src="heart.png"/>
                <Img src="heart.png"/>
                <Img src="heart.png"/>
                <p>{isOpponent ? enemy_win : win} - {isOpponent ? enemy_lose : lose}</p>
            </HStack>}
            {lose == 1 && <HStack>
                <Img src="heart.png"/>
                <Img src="heart.png"/>
                <Img src="heart_broken.png"/>
                <p>{isOpponent ? enemy_win : win} - {isOpponent ? enemy_lose : lose}</p>
            </HStack>}
            {lose == 2 && <HStack>
                <Img src="heart.png"/>
                <Img src="heart_broken.png"/>
                <Img src="heart_broken.png"/>
                <p>{win} - {lose}</p>
            </HStack>}
        </HStack>
    </div >
}