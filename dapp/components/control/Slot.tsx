import { twMerge } from "tailwind-merge"
import { Character } from "../character/character"
import { useAtom } from "jotai"
import { moneyA as moneyAtom, selectedItemSlot, selectedShopSlot, selectedSlot, shopCharacter, stageAtom, operationsA, enemyCharacter, slotCharacter, itemsA } from "../../store/stages"
import {
  use_rice_ball,
  use_dragon_fruit,
  use_boot,
  use_thick_cloak,
  use_devil_fruit,
  use_magic_potion,
  use_red_potion,
  use_purple_potion,
  use_whet_stone,
  use_chicken_drumstick,
  use_chess
} from "../items/RawData"
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
import useLocale from "../../hooks/useLocale"

export const Slot = ({ isOpponent = false, id }: { isOpponent?: boolean; id: number }) => {
  const [slotNumber, setSlotNumber] = useAtom(selectedSlot)
  const [chars, setChars] = useAtom(slotCharacter)
  const [enemyChars, setEnemyChars] = useAtom(enemyCharacter)
  const [shopSlotNumber, setShopSlotNumber] = useAtom(selectedShopSlot)
  const [itemSlotNumber, setItemSlotNumber] = useAtom(selectedItemSlot)
  const [shopChars, setShopChars] = useAtom(shopCharacter)
  const [money, setMoney] = useAtom(moneyAtom)
  const [items, setItems] = useAtom(itemsA)
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

  let char: CharacterFields | null = null
  if (id >= 10) {
    char = enemyChars[id - 10]
  } else {
    char = chars[id]
  }

  const selected = slotNumber === id
  const [stage, setStage] = useAtom(stageAtom)
  const toast = useToast()

  function show_failed_toast(code: string) {
    if (code == "insufficient_gold") {
      toast({
        title: getLocale("Money-is-not-enough"),
        status: "warning",
        duration: 2000,
        isClosable: true
      })
    } else if (code == "item_banned_ring") {
      toast({
        title: getLocale("item-banned-ring-effect"),
        status: "warning",
        duration: 2000,
        isClosable: true
      })
    } else if (code == "item_banned_sp_max") {
      toast({
        title: getLocale("item_banned_sp_max"),
        status: "warning",
        duration: 2000,
        isClosable: true
      })
    }
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
        //buy a new character and put on an empty slot
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
            show_failed_toast("insufficient_gold")
          }
          // buy and upgrad a char, the bought character must be put on a slot with the same class hero
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
            show_failed_toast("insufficient_gold")
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
        } else if (char && itemSlotNumber !== null && items[itemSlotNumber] != null) {
          //use an item, when a bought item and a char are together selected
          //
          //
          //test
          console.log(
            "Before using an item: Char hp: ",
            char.hp,
            ", Char max_hp: ",
            char.max_hp,
            ", Char attack: ",
            char.attack,
            ", Char base_attack: ",
            char.base_attack,
            ", Char speed: ",
            char.speed,
            ", Char base_speed: ",
            char.base_speed,
            ", Char sp: ",
            char.sp,
            ", Char sp_cap: ",
            char.sp_cap
          )

          //test
          let item = items[itemSlotNumber]
          console.log(item)
          if (item!.name == "magic_potion" && char.sp_cap! == 0) {
            console.log("item_banned_ring")
            show_failed_toast("item_banned_ring")
          } else if (item!.name == "magic_potion" && char.sp_cap! > 0 && char.sp == char.sp_cap) {
            console.log("item_banned_sp_max")
            show_failed_toast("item_banned_sp_max")
          } else {
            if (item != null && item != undefined) {
              if (money < item!.cost) {
                toast({
                  title: getLocale("Money-is-not-enough"),
                  status: "warning",
                  duration: 2000,
                  isClosable: true
                })
                return
              }
              setMoney(money - item!.cost)
            }
            if (item!.name == "rice_ball") {
              use_rice_ball(char)
            } else if (item!.name == "dragon_fruit") {
              use_dragon_fruit(char)
            } else if (item!.name == "boot") {
              use_boot(char)
            } else if (item!.name == "devil_fruit") {
              use_devil_fruit(char)
            } else if (item!.name == "magic_potion" && char.sp_cap! > 0) {
              console.log("Miao Item " + item!.name + " is used!")
              use_magic_potion(char)
            } else if (item!.name == "red_potion") {
              use_red_potion(chars)
            } else if (item!.name == "purple_potion") {
              use_purple_potion(chars)
            } else if (item!.name == "whet_stone") {
              use_whet_stone(chars)
            } else if (item!.name == "chicken_drumstick") {
              use_chicken_drumstick(chars)
            } else if (item!.name == "thick_cloak") {
              use_thick_cloak(char)
            } else if (item!.name == "chess") {
              char = use_chess(char)
            }

            if (item!.name == "chess") {
              //Because the number is randomly chosen, so the chain end may generate a different number, to avoid
              //discrepancy, the replaced hero is passed directly back to the chain end
              operations.push("use_chess")
              operations.push(char.class + "-" + id)
            } else {
              operations.push("use_item")
              operations.push(item!.name + "-" + id)
            }
            chars[id] = char
            setChars(chars)
            items[itemSlotNumber] = null
            setItemSlotNumber(null)
            setItems(items)

            //test
            console.log("Item " + item!.name + " is used!")
            console.log(
              "After using the item: Char hp: ",
              char.hp,
              ", Char max_hp: ",
              char.max_hp,
              ", Char attack: ",
              char.attack,
              ", Char base_attack: ",
              char.base_attack,
              ", Char speed: ",
              char.speed,
              ", Char base_speed: ",
              char.base_speed,
              ", Char sp: ",
              char.sp,
              ", Char sp_cap: ",
              char.sp_cap
            )
            //test
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
        {char && char.class && <Character level={char.level} attack={char.attacking} charType={removeSuffix(char.class)} isOpponent={isOpponent} />}
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
  if (removeSuffix(char1.class) != removeSuffix(char2.class)) {
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
