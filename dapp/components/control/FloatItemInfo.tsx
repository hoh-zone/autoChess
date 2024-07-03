import { useAtom } from "jotai"

import { Text, HStack, Img, Stack, Divider } from "@chakra-ui/react"
import { stageAtom, boughtItems, selectedShopItemSlot, selectedItemSlot, assetsAtom } from "../../store/stages"
import { ItemFields } from "../../types/nft"
import { item_list } from "../items/RawData"
import { useContext } from "react"
import { AppContext } from "../../pages/_app"
import useLocale from "../../hooks/useLocale"
import { ITEM_DESCRIPTION, ITEM_NAME } from "../../utils/itemDescription"
import { ITEM_DESCRIPTION_CN, ITEM_NAME_CN } from "../../utils/itemDescriptionCn"

export const FloatItemInfo = ({ name, isShowInfo = false, isShopSlot = false }: { name: string; isShowInfo?: boolean; isShopSlot?: boolean }) => {
  const [stage] = useAtom(stageAtom)
  const [assets, setAssets] = useAtom(assetsAtom)
  const { lang } = useContext(AppContext)
  const getLocale = useLocale()

  // console.log(locale);

  let item: ItemFields = item_list[name]
  return (
    <div className="float-container pointer-events-none">
      {/* 触发范围 */}
      {item && (
        <>
          <Stack className={"fix_float"}>
            <HStack gap={4}>
              <Text className="text-[6px]">
                {lang == "EN" ? ITEM_NAME[item.name] : ITEM_NAME_CN[item.name]}(-{item.cost}💰)
              </Text>
            </HStack>
            <Divider borderWidth={1} />
            <Text fontSize={"3xs"}>
              {getLocale("description")}
              {": "}
              {lang == "EN" ? ITEM_DESCRIPTION[item.name]?.replace("$value", String(item.effect_value)) : ITEM_DESCRIPTION_CN[item.name]?.replace("$value", String(item.effect_value))}
            </Text>
          </Stack>
        </>
      )}
    </div>
  )
}
