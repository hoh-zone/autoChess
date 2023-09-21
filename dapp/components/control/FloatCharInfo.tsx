
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { HStack, Img, Stack } from "@chakra-ui/react";
import { slotCharacter, enemyCharacter, shopCharacter } from "../../store/stages";

import { get_base_raw_life, get_effect, get_star_num } from "../character/rawData";
import { capitalizeFirstChar, removeSuffix } from "../../utils/TextUtils";

export const FloatCharInfo = ({ id, isShowInfo = false, isShopSlot = false, isOpponent = false }: {
    id: number,
    isShowInfo?: boolean,
    isShopSlot?: boolean
    isOpponent?: boolean
}) => {
    const [chars] = useAtom(slotCharacter);
    const [enemy_chars] = useAtom(enemyCharacter);
    const [shopChars] = useAtom(shopCharacter);
    let char: CharacterFields | null = null;
    if (isShopSlot) {
        char = shopChars[id]
    } else {
        if (id >= 10) {
            char = enemy_chars[id - 10];
        } else {
            char = chars[id];
        }
    }

    const get_base_life = (char:CharacterFields | null) => {
        if (!char) {
            return 0
        }
        if (isShopSlot) {
            return get_base_raw_life(char)
        } else {
            return char.base_life;
        }
    }

    return <div className="float-container pointer-events-none" >
        {/* 触发范围 */}
        {char && <>
            <Stack className={isShowInfo ? "fix_float" : "float"} >
                <HStack>
                    {Array.from({ length: get_star_num(char) }, (_, index) => (
                        <Img style={{ width: '20px' }} src="star.png" />
                    ))}
                    {(char?.level == 2 || char?.level == 6) && <Img style={{ width: '20px' }} src="star_half.png" />}
                    {/* <p className="text-[10px]">{capitalizeFirstChar(removeSuffix(char?.name))}</p> */}
                </HStack>
                <p className="text-[10px]">HP:{get_base_life(char)}</p>
                <p className="text-[10px]">ACK:{char?.attack}</p>
                <p className="text-[10px]" style={{fontSize:"8px"}}>Feature: {get_effect(char)}</p>
                {/* <p className="text-[10px]">Feature: All features to be finished</p> */}
            </Stack>
        </>}
    </div>
}