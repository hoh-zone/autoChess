import { twMerge } from "tailwind-merge"
import { charTable } from "./charTable"
import { motion } from "framer-motion"
import { useAtom } from "jotai"
import { assetsAtom } from "../../store/stages"

export function Character({ isOpponent = false, charType, attack = 0, level = 1 }: { isOpponent?: boolean; charType: string; attack?: 0 | 1 | 2; level?: number }) {
  if (!charTable[charType as keyof typeof charTable]) {
    if (charType === "none") {
      return <></>
    }
    console.error("not found", charType)
    return <></>
  }
  const [assets, setAssets] = useAtom(assetsAtom)
  const { attackSrc, attack2Src, moveSrc, moveWidth, moveHeight, attackWidth, attackHeight } = charTable[charType as keyof typeof charTable]

  const src = attack === 1 ? assets?.[attackSrc] : attack === 2 ? assets?.[attack2Src] : assets?.[moveSrc]

  return (
    <motion.div initial={{ scale: 0.5, y: -200 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full h-full overflow-visible flex place-items-end z-10 pointer-events-none">
      {attack ? (
        <div
          className={twMerge(
            "animBasic mx-auto",
            `attack${attack}`,
            charType,
            isOpponent && level < 3 ? "opponentCharacter" : "",
            isOpponent && level >= 3 ? "enemy_effect" : "",
            !isOpponent && level >= 3 ? "effect" : ""
          )}
          style={{
            backgroundImage: `url(${src})`,
            width: attackWidth,
            height: attackHeight
          }}
        />
      ) : (
        <div
          className={twMerge(
            "move animBasic mx-auto",
            charType,
            isOpponent && level < 3 ? "opponentCharacter" : "",
            isOpponent && level >= 3 ? "enemy_effect" : "",
            !isOpponent && level >= 3 ? "effect" : ""
          )}
          style={{
            backgroundImage: `url(${src})`,
            width: moveWidth,
            height: moveHeight
          }}
        />
      )}
    </motion.div>
  )
}
