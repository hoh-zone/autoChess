
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { slotCharacter, fightingIndex, enemyFightingIndex, enemyCharacter} from "../../store/stages";
import { HStack, Img } from "@chakra-ui/react";


export const CharStatus = ({ isOpponent = false}: {
    isOpponent?: boolean
}) => {
    const [chars] = useAtom(slotCharacter);
    const [enemy_chars] = useAtom(enemyCharacter);
    const [fight_index, setFightingIndex] = useAtom(fightingIndex);
    const [enemy_fight_index, setEnemyFightingIndex] = useAtom(enemyFightingIndex);
    let char: CharacterFields | null = null;
    char = isOpponent ? enemy_chars[enemy_fight_index]: chars[fight_index];

    const get_attack = (char:CharacterFields | null) => {
        if (!char) {
            return "";
        }
        return char.attack;
    }

    return <HStack>
        <Img style={{height:"10px"}} src="sword.png"/>
        <p>{get_attack(char)}sssas</p>
    </HStack >
}