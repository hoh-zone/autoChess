import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { moneyA as moneyAtom, selectedShopSlot, selectedSlot, shopCharacter, stageAtom, operationsA, enemyCharacter, slotCharacter } from "../../store/stages"
import { removeSuffix } from "../../utils/TextUtils"
import { upgrade } from "../character/rawData"
import { FloatCharInfo } from "./FloatCharInfo"
import { HpBar } from "./HpBar"
import { motion } from "framer-motion"
import { useToast } from "@chakra-ui/react"
import confetti from "canvas-confetti"
import { StatusChange } from "./StatusChange"
import { CharacterFields } from "../../types/nft"
import { get_buy_price } from "../character/rawData"
import { SkillTag } from "./SkillTag"

export const Slot = ({ isOpponent = false, id }: { isOpponent?: boolean; id: number }) => {
  const [slotNumber, setSlotNumber] = useAtom(selectedSlot)
  const [chars, setChars] = useAtom(slotCharacter)
  const [enemyChars, setEnemyChars] = useAtom(enemyCharacter)
  const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot)
  const [shopChars, setShopChars] = useAtom(shopCharacter)
  const [money, setMoney] = useAtom(moneyAtom)
  const [operations, setOperations] = useAtom(operationsA)
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

  let char: CharacterFields | null = null
  if (id >= 10) {
    char = enemyChars[id - 10]
  } else {
    char = chars[id]
  }

  const selected = slotNumber === id
  const [stage, setStage] = useAtom(stageAtom)
  const toast = useToast()

  function show_failed_toast() {
    toast({
      title: "Money is not enough",
      status: "warning",
      duration: 2000,
      isClosable: true
    })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={twMerge(
        "slot-container",
        "w-24 h-24 relative rounded-xl slotContainer",
        "border-4 border-transparent z-10",
        char == null && stage != "shop" ? "pointer-events-none" : "hover:border-slate-300",
        selected ? "border-slate-800" : ""
      )}
      onClick={async () => {
        // only shop scene can buy
        if (stage != "shop") return
        // try to buy
        let char_shop_choosen = shopChars[shopSlotNumber!]
        if (shopSlotNumber !== null && !char && char_shop_choosen) {
          if (money >= get_buy_price(char_shop_choosen)) {
            setMoney(money - get_buy_price(char_shop_choosen))
            chars[id] = shopChars[shopSlotNumber]
            shopChars[shopSlotNumber] = null
            setChars(chars.slice())
            setShopChars(shopChars)
            setShopSlotNumber(null)
            setSlotNumber(null)
            operations.push("buy")
            operations.push(shopSlotNumber + "-" + id)
          } else {
            show_failed_toast()
          }
          // buy and upgrad chars
        } else if (shopSlotNumber != null && char && char_shop_choosen && canUpgrade(char, char_shop_choosen)) {
          if (money >= get_buy_price(char_shop_choosen)) {
            setMoney(money - get_buy_price(char_shop_choosen))
            let tmp = upgrade(char, char_shop_choosen)
            chars[id] = tmp
            shopChars[shopSlotNumber] = null
            setChars(chars.slice())
            setShopSlotNumber(null)
            setSlotNumber(null)
            end = Date.now() + 1 * 1000
            level_up_effect()
            operations.push("buy_upgrade")
            operations.push(shopSlotNumber + "-" + id)
          } else {
            show_failed_toast()
          }
        }
        // swap or upgrad chars
        else if (slotNumber !== null && slotNumber !== id) {
          let temp = chars[id]
          chars[id] = chars[slotNumber]
          if (canUpgrade(chars[id], temp)) {
            chars[slotNumber] = null
            temp = upgrade(chars[id]!, temp!)
            chars[id] = temp
            setChars(chars.slice())
            setSlotNumber(null)
            setShopSlotNumber(null)
            end = Date.now() + 1 * 1000
            level_up_effect()
            operations.push("upgrade")
            operations.push(slotNumber + "-" + id)
          } else {
            chars[slotNumber] = temp
            setChars(chars)
            setSlotNumber(null)
            setShopSlotNumber(null)
            operations.push("swap")
            operations.push(slotNumber + "-" + id)
          }
        } else {
          if (slotNumber == null) {
            setSlotNumber(id)
          } else {
            // cancel choosen state
            setSlotNumber(null)
          }
          setShopSlotNumber(null)
        }
      }}
    >
      {stage == "shop" && <div className="slot rounded-full w-full h-24 bg-slate-400 absolute bottom-[-25px]" />}
      <div className="absolute  top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
        {char && char.name && <Character level={char.level} attack={char.attacking} charType={removeSuffix(char.name)} isOpponent={isOpponent} />}
        {char && (
          <div
            className="absolute "
            style={{
              top: "13%",
              left: "50%",
              transform: "translateX(-64%)"
            }}
          >
            <HpBar id={id} />
            <StatusChange id={id} />
            <SkillTag id={id} />
          </div>
        )}
      </div>

      {<FloatCharInfo isShowInfo={stage == "shop"} id={id} />}
    </motion.div>
  )
}

const canUpgrade = (char1: any, char2: any) => {
  if (char1 == null || char2 == null) {
    return false
  }
  if (removeSuffix(char1.name) != removeSuffix(char2.name)) {
    return false
  }
  let level1 = char1.level
  let level2 = char2.level
  if (level1 > level2) {
    let tmp = level2
    level2 = level1
    level1 = tmp
  }
  return level1 < 9 && level2 < 9
}
