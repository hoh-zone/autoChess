
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { slotCharacter, fightingIndex, enemyFightingIndex, enemyCharacter} from "../../store/stages";
import { HStack, Img } from "@chakra-ui/react";

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

    const get_width_by_life = (char:CharacterFields | null) => {
        let start = 10;
        let end = 40;
        if (!char) {
            return start;
        }
        let total = char.base_life
        if (total == undefined) {
            return start;
        }
        let life = char == null ? 0 : char.life;
        return start + (life / total) * end
    }

    return <HStack style={{zIndex:1000,position:"relative", justifyContent:"left"}}>
            <div style={{ justifyContent:"left" ,width: '50px', height: '30px', background: "url('hp_bg.png') no-repeat", backgroundSize: '50px auto', backgroundPosition: "left" }}>
                <div style={{ width:  `${get_width_by_life(char)}px`, height: '30px', background: "url('hp.png') no-repeat", backgroundSize: '50px auto', backgroundPosition: "left" }}></div>
            </div>
    </HStack >
}