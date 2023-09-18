
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { slotCharacter, fightingIndex, enemyFightingIndex, enemyCharacter} from "../../store/stages";
import { HStack, Img } from "@chakra-ui/react";
import { get_total_life } from "../character/rawData";

export const HpBar = ({id}: {
    id: number,
}) => {
    const [chars] = useAtom(slotCharacter);
    const [enemy_chars] = useAtom(enemyCharacter);
    let char: CharacterFields | null = null;
    let isOpponent = false;
    if (id >= 10) {
        char = enemy_chars[id - 10];
        isOpponent = true
    } else {
        char = chars[id];
        isOpponent = false
    }

    const get_bg_direction = () => {
        if (isOpponent) {
            return "right"
        } else {
            return "left"
        }
    }

    const get_width_by_life = (char:any) => {
        let start = isOpponent? 10: 10;
        let end = isOpponent? 40: 40;

        // todo:需要读取tmp life
        let total = get_total_life(char);
        if (total == -1) {
            return end;
        }
        let life = char == null ? 0 : char.life;
        return start + (life / total) * end
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
    const get_bar_direction = () => {
        if (isOpponent) {
            return "left"
        } else {
            return "left"
        }
    }

    return <HStack style={{zIndex:122321,position:"relative", justifyContent:`${get_bg_direction()}`}}>
            <div style={{ justifyContent:`${get_bg_direction()}` ,width: '50px', height: '60px', background: `${get_bg1_url()}`, backgroundSize: '50px auto', backgroundPosition: `${get_bg_direction()}` }}>
                <div style={{ width:  `${get_width_by_life(char)}px`, height: '60px', background: `${get_bg2_url()}`, backgroundSize: '50px auto', backgroundPosition: `${get_bar_direction()}` }}></div>
            </div>
    </HStack >
}