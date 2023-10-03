
import { useAtom } from "jotai"

import { CharacterFields } from "../../types/nft";
import { HStack, Img, Stack } from "@chakra-ui/react";
import { slotCharacter, enemyCharacter, shopCharacter, stageAtom, enemyCharacterV2, slotCharacterV2 } from "../../store/stages";

import { get_base_raw_life, get_effect, get_star_num } from "../character/rawDataV2";
import { CharacterFieldsV2 } from "../../types/entity";

export const FloatCharInfo = ({ id, isShowInfo = false, isShopSlot = false, isOpponent = false }: {
    id: number,
    isShowInfo?: boolean,
    isShopSlot?: boolean
    isOpponent?: boolean
}) => {
    const [chars] = useAtom(slotCharacterV2);
    const [enemy_chars] = useAtom(enemyCharacterV2);
    const [shopChars] = useAtom(shopCharacter);
    const [stage] = useAtom(stageAtom);
    let char: CharacterFieldsV2 | null = null;
    if (isShopSlot) {
        char = shopChars[id]
    } else {
        if (id >= 10) {
            char = enemy_chars[id - 10];
        } else {
            char = chars[id];
        }
    }

    const get_base_life = (char:CharacterFieldsV2 | null) => {
        if (!char) {
            return 0
        }
        if (isShopSlot) {
            return char.max_life
        } else {
            if (stage == "fight") {
                return char.life;
            } else {
                return char.max_life
            }
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
                <p className="text-[10px]" style={{fontSize:"8px"}}>Feature: {char.effect}</p>
                {/* <p className="text-[10px]">Feature: All features to be finished</p> */}
            </Stack>
        </>}
    </div>
}