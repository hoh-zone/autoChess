import { twMerge } from "tailwind-merge"
import { charTable } from "./charTable"
import { motion } from "framer-motion"

export function Character({ isOpponent = false, charType, attack = 0, level = 1 }: { isOpponent?: boolean; charType: string; attack?: 0 | 1 | 2; level?: number }) {
  if (!charTable[charType as keyof typeof charTable]) {
    console.error("not found", charType)
    return <>no</>
  }

  const { attackSrc, attack2Src, moveSrc, moveWidth, moveHeight, attackWidth, attackHeight } = charTable[charType as keyof typeof charTable]

  const src = (attack === 1 ? attackSrc : attack === 2 ? attack2Src : moveSrc) + ".png"

  return (
    <div className="relative w-24 h-24 pointer-events-none overflow-visible">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%]">
        <div className="w-full h-full overflow-visible flex place-items-end z-10 pointer-events-none">
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
        </div>    </div>
    </div>

  )
}
