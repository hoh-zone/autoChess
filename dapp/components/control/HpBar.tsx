
import { useAtom } from "jotai"

import { slotCharacterV2, enemyCharacterV2} from "../../store/stages";
import { HStack } from "@chakra-ui/react";
import { CharacterFieldsV2 } from "../../types/entity";

export const HpBar = ({id}: {
    id: number,
}) => {
    const [chars] = useAtom(slotCharacterV2);
    const [enemy_chars] = useAtom(enemyCharacterV2);
    let char: CharacterFieldsV2 | null = null;
    let isOpponent = false;
    if (id >= 10) {
        char = enemy_chars[id - 10];
        isOpponent = true
    } else {
        char = chars[id];
        isOpponent = false
    }

    const get_width_by_life = (char:CharacterFieldsV2 | null) => {
        let start = 10;
        let end = 40;
        if (!char) {
            return start;
        }
        let total = char.max_life
        if (total == undefined) {
            return start;
        }
        let life = (char == null||char.life<0) ? 0 : char.life;
        return start + (life / total) * end
    }

    return <HStack style={{zIndex:1000,position:"relative", justifyContent:"left"}}>
            <div style={{ justifyContent:"left" ,width: '50px', height: '30px', background: "url('hp_bg.png') no-repeat", backgroundSize: '50px auto', backgroundPosition: "left" }}>
                <div style={{ width:  `${get_width_by_life(char)}px`, height: '30px', background: "url('hp.png') no-repeat", backgroundSize: '50px auto', backgroundPosition: "left" }}></div>
            </div>
    </HStack >
}