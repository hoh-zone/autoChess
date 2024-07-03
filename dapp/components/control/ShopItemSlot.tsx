import { twMerge } from "tailwind-merge"
import { useAtom } from "jotai"
import { selectedShopItemSlot, selectedItemSlot } from "../../store/stages"
import { useEffect } from "react"
import { FloatItemInfo } from "./FloatItemInfo"
import { motion } from "framer-motion"
import { sleep } from "../../utils/sleep"

export const ShopItemSlot = ({ name }: { name: string }) => {
  const [shopItemSlotName, setShopItemSlotName] = useAtom(selectedShopItemSlot)
  const [, setItemSlotNumber] = useAtom(selectedItemSlot)
  const selected = shopItemSlotName === name

  const img_src: string = "items/" + name + ".png"

  useEffect(() => {
    setInterval(async () => {
      await sleep(1500)
    }, 3000 + Math.random() * 2000)
  }, [])

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={twMerge("bg-stone-300", "shop-slot-container", "w-24 h-24 relative rounded-xl", "border-4 border-transparent z-20 hover:border-slate-300", selected ? "border-slate-800" : "")}
      onClick={() => {
        setShopItemSlotName(name)
        setItemSlotNumber(null)
      }}
    >
      <div className="pointer-events-none absolute  top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
        <img src={img_src} />
      </div>
      {<FloatItemInfo isShopSlot={true} isShowInfo={true} name={name} />}
    </motion.div>
  )
}
