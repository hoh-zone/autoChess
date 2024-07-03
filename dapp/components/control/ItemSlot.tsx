import { twMerge } from "tailwind-merge"
import { useAtom } from "jotai"
import {
  moneyA as moneyAtom,
  boughtItems,
  selectedShopItemSlot,
  selectedItemSlot,
  selectedShopSlot,
  selectedSlot,
  shopCharacter,
  stageAtom,
  operationsA,
  itemsA,
  slotCharacter
} from "../../store/stages"
import { motion } from "framer-motion"
import { HStack, useToast } from "@chakra-ui/react"
import confetti from "canvas-confetti"
import { CharacterFields, ItemFields } from "../../types/nft"
import { FloatItemInfo } from "./FloatItemInfo"
import useLocale from "../../hooks/useLocale"
import { item_list } from "../items/RawData"

export const ItemSlot = ({ id }: { id: number }) => {
  const [items, setItems] = useAtom(itemsA)
  const [shopItemSlotName, setShopItemSlotName] = useAtom(selectedShopItemSlot)
  const [itemSlotNumber, setItemSlotNumber] = useAtom(selectedItemSlot)
  const [money, setMoney] = useAtom(moneyAtom)
  const [operations, setOperations] = useAtom(operationsA)
  const getLocale = useLocale()

  let end = Date.now() + 1 * 1000
  const level_up_effect = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#bb0000", "#ffffff"],
      ticks: 100
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#bb0000", "#ffffff"],
      ticks: 100
    })
    if (Date.now() < end) {
      requestAnimationFrame(level_up_effect)
    }
  }

  const selected = itemSlotNumber === id
  const [stage, setStage] = useAtom(stageAtom)
  const toast = useToast()

  let item: ItemFields | null = items[id]
  let img_src: string = "items/" + item?.name + ".png"

  function show_failed_toast() {
    toast({
      title: getLocale("Money-is-not-enough"),
      status: "warning",
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.4 }}
      className={twMerge(
        "bg-stone-300",
        "shop-slot-container",
        "w-12 h-12 relative rounded-xl",
        selected ? "border-4 border-transparent z-20 hover:border-slate-800" : "border-4 border-transparent z-20 hover:border-slate-300",
        selected ? "border-slate-800" : ""
      )}
      onClick={async () => {
        //test
        // only shop scene can buy
        if (stage != "shop") return

        // try to buy
        console.log("Chosen item:", item)
        console.log("Gold left:", money)

        if (itemSlotNumber == null) {
          // chose item
          setItemSlotNumber(id)
        } else {
          if (itemSlotNumber != id) {
            // swich choosen item
            setItemSlotNumber(id)
          } else {
            // cancel choosen item
            setItemSlotNumber(null)
          }
        }
      }}
    >
      <div className="absolute pointer-events-none">{item && <img src={img_src} />}</div>
      {item && <FloatItemInfo isShopSlot={true} isShowInfo={true} name={item.name} />}
    </motion.div>
  )
}
