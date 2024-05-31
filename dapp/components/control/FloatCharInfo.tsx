import { useAtom } from "jotai"

import { Text, HStack, Img, Stack, Divider } from "@chakra-ui/react"
import { shopCharacter, stageAtom, enemyCharacter, slotCharacter, assetsAtom } from "../../store/stages"

import { get_star_num } from "../character/rawData"
import { CharacterFields } from "../../types/nft"
import { SKILL_DESCRIPTION } from "../../utils/skillDescription"
import { SKILL_DESCRIPTION_CN } from "../../utils/skillDescriptionCn"
import { useContext } from "react"
import { AppContext } from "../../pages/_app"
import useLocale from "../../hooks/useLocale"

export const FloatCharInfo = ({ id, isShowInfo = false, isShopSlot = false, isOpponent = false }: { id: number; isShowInfo?: boolean; isShopSlot?: boolean; isOpponent?: boolean }) => {
  const [chars] = useAtom(slotCharacter)
  const [enemy_chars] = useAtom(enemyCharacter)
  const [shopChars] = useAtom(shopCharacter)
  const [stage] = useAtom(stageAtom)
  const [assets, setAssets] = useAtom(assetsAtom)
  const { lang } = useContext(AppContext)
  const getLocale = useLocale()

  // console.log(locale);

  let char: CharacterFields | null = null
  if (isShopSlot) {
    char = shopChars[id]
  } else {
    if (id >= 10) {
      char = enemy_chars[id - 10]
    } else {
      char = chars[id]
    }
  }

  const get_base_life = (char: CharacterFields | null) => {
    if (!char) {
      return 0
    }
    if (isShopSlot) {
      return char.max_hp
    } else {
      if (stage == "fight") {
        return char.hp < 0 ? 0 : char.hp
      } else {
        return char.max_hp < 0 ? 0 : char.max_hp
      }
    }
  }

  const get_base_speed = (char: CharacterFields | null) => {
    if (!char) {
      return 0
    }
    if (isShopSlot) {
      return char.base_speed
    } else {
      return char.speed
    }
  }

  return (
    <div className="float-container pointer-events-none">
      {/* 触发范围 */}
      {char && (
        <>
          <Stack className={"fix_float"}>
            <HStack gap={4}>
              <HStack pos={"relative"} bottom={1}>
                {Array.from({ length: get_star_num(char) }, (_, index) => (
                  <Img style={{ width: "20px" }} src={assets?.star} key={index} />
                ))}
                {(char?.level == 2 || (char?.level >= 6 && char?.level <= 8)) && <Img style={{ width: "20px" }} src={assets?.star_half} />}
                {/* <p className="text-[10px]">{capitalizeFirstChar(removeSuffix(char?.name))}</p> */}
              </HStack>
              <Text className="text-[8px]">
                {getLocale("HP")}:{get_base_life(char)}
              </Text>
              <Text className="text-[8px]">
                {getLocale("ACK")}:{char?.attack}
              </Text>
              <Text className="text-[8px]">
                {getLocale("SPEED")}:{get_base_speed(char)}
              </Text>
            </HStack>
            <Divider borderWidth={1} />
            <Text fontSize={"2xs"}>
              {char.effect_type === "skill" ? getLocale("Active-skill") : getLocale("Passive-skill")}
              {": "}
              {lang == "EN" ? SKILL_DESCRIPTION[char.effect]?.replace("$value", char.effect_value!) : SKILL_DESCRIPTION_CN[char.effect]?.replace("$value", char.effect_value!)}
            </Text>
          </Stack>
        </>
      )}
    </div>
  )
}
