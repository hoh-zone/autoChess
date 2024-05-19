import { useAtom } from "jotai"

import { Text, HStack, Img, Stack, Divider } from "@chakra-ui/react"
import { stageAtom, boughtItems, selectedShopItemSlot, selectedItemSlot, assetsAtom } from "../../store/stages"
import { ItemFields } from "../../types/nft"
import { item_list } from "../items/RawData"
import { useContext } from "react"
import { AppContext } from "../../pages/_app"
import useLocale from "../../hooks/useLocale"

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
                {getLocale("range")}:{item.range}
              </Text>
              <Text className="text-[6px]">
                {getLocale("effect-value")}:{item.effect_value}
              </Text>
            </HStack>
            <Divider borderWidth={1} />
            <Text fontSize={"3xs"}>
              {getLocale("description")}
              {": "}
              {item.effect}
            </Text>
          </Stack>
        </>
      )}
    </div>
  )
}
