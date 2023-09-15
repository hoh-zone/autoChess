
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { HStack, Img } from "@chakra-ui/react";
import { slotCharacter, enemyCharacter} from "../../store/stages";

import { get_star_num, get_total_life } from "../character/rawData";
import { capitalizeFirstChar, removeSuffix } from "../../utils/TextUtils";

export const FloatCharInfo = ({ id, isShowInfo = false, isOpponent = false}: {
    id: number,
    isShowInfo?: boolean,
    isOpponent?: boolean
}) => {
    const [chars] = useAtom(slotCharacter);
    const [enemy_chars] = useAtom(enemyCharacter);
    let char: CharacterFields | null = null;
    if (id >= 10) {
        char = enemy_chars[id - 10];
    } else {
        char = chars[id];
    }
    return <div className="float-container pointer-events-none" >
            {/* 触发范围 */}
            {char && <>
            <div className={isShowInfo? "fix_float":"float"} >
                <HStack>
                    {Array.from({ length: get_star_num(char) }, (_, index) => (
                        <Img style={{width:'20px'}} src="star.png"/>
                    ))}
                    {(char?.level == 2 || char?.level == 6) && <Img style={{width:'20px'}} src="star_half.png"/>}
                </HStack>
                <p>{capitalizeFirstChar(removeSuffix(char?.name))}</p>
                <p>HP:{get_total_life(char)}</p>
                <p>AK:{char?.attack}</p>
                <p>Feature: All features to be finished</p>
            </div>
            </>}
  </div>
}