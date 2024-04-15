import { useAtom } from "jotai"

import { slotCharacter, enemyCharacter, stageAtom } from "../../store/stages"
import { HStack } from "@chakra-ui/react"
import { CharacterFields } from "../../types/nft"
export const HpBar = ({ id }: { id: number }) => {
  const [chars] = useAtom(slotCharacter)
  const [enemy_chars] = useAtom(enemyCharacter)
  const [stage] = useAtom(stageAtom)
  let char: CharacterFields | null = null
  let isOpponent = false
  if (id >= 10) {
    char = enemy_chars[id - 10]
    isOpponent = true
  } else {
    char = chars[id]
    isOpponent = false
  }

  const get_width_by_life = (char: CharacterFields | null) => {
    let start = 10
    let end = 40
    if (!char) {
      return start
    }
    let total = char.max_hp
    if (total == undefined) {
      return start
    }
    let life = char == null || char.hp < 0 ? 0 : char.hp
    return start + (life / total) * end
  }

  const get_img_url_by_effect = (char: CharacterFields | null) => {
    if (char != null && char.effect_type === "ring") {
      return "url('fix_inner.png') no-repeat"
    }
    return "url('mp_inner.png') no-repeat"
  }

  const get_level_icon = (char: CharacterFields | null) => {
    if (char != null) {
      return "url('level" + char.level + ".png') no-repeat"
    }
    return "url('level.png') no-repeat"
  }

  const get_width_by_sp = (char: CharacterFields | null) => {
    let start = 10
    let end = 45
    if (char?.effect_type == "ring") {
      return end
    }
    if (stage == "shop") {
      return end
    }
    if (!char) {
      return start
    }
    let max = char.sp_cap ? char.sp_cap : 0
    if (max == 0) {
      return end
    }
    if (max == 0) {
      return end
    }
    return start + ((end - start) * char.sp) / max
  }

  return (
    <HStack style={{ zIndex: 1000, position: "relative", justifyContent: "left" }}>
      <div style={{ justifyContent: "left", width: "50px", height: "30px", background: "url('status_bg.png') no-repeat", backgroundSize: "50px auto", backgroundPosition: "left" }}>
        <div style={{ width: `${get_width_by_sp(char)}px`, height: "30px", background: `${get_img_url_by_effect(char)}`, backgroundSize: "50px auto", backgroundPosition: "left" }}>
          <div style={{ width: `${get_width_by_life(char)}px`, height: "30px", background: "url('hp_inner.png') no-repeat", backgroundSize: "50px auto", backgroundPosition: "left" }}>
            <div style={{ width: "30px", height: "30px", background: `${get_level_icon(char)}`, backgroundSize: "50px auto", backgroundPosition: "left" }}></div>
          </div>
        </div>
      </div>
    </HStack>
  )
}
