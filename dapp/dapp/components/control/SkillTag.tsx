import { useAtom } from "jotai"
import { skillTagA, enemySkillTagA, enemyCharacter, slotCharacter, stageAtom, assetsAtom} from "../../store/stages"
import { CharacterFields } from "../../types/nft"
import { motion } from "framer-motion"
import { HStack, Img } from "@chakra-ui/react"

export const SkillTag = ({ id }: { id: number }) => {
  const [skillTag, setSkillTag] = useAtom(skillTagA)
  const [stage, setStage] = useAtom(stageAtom)
  const [enemySkillTag, setEnemySkillTag] = useAtom(enemySkillTagA)
  const [chars] = useAtom(slotCharacter)
  const [assets, setAssets] = useAtom(assetsAtom)
  const [enemy_chars] = useAtom(enemyCharacter)
  let isOpponent = id > 10
  let char: CharacterFields | null = null
  char = isOpponent ? enemy_chars[id - 10] : chars[id]
  let skill = ""
  if (id >= 10) {
    skill = enemySkillTag[id - 10]
    if (skill !== "") {
      setTimeout(() => {
        enemySkillTag[id - 10] = ""
        skill = ""
      }, 500)
    }
  } else {
    skill = skillTag[id]
    if (skill !== "") {
      setTimeout(() => {
        skillTag[id] = ""
        skill = ""
      }, 500)
    }
  }

  const get_img_url = (effect:undefined | string) => {
    if (effect == 'forbid_debuff') {
      return assets?.forbid_debuff;
    } else if (effect === 'forbid_buff') {
      return assets?.forbid_buff;
    } else if (effect === 'add_all_tmp_max_sp') {
      return assets?.add_all_tmp_max_sp;
    } else {
      return assets?.forbid_buff;
    }
  }

  return (
    <div style={{ zIndex: 1000, position: "relative", justifyContent: "left" }}>
      {(skill !== "" || char?.effect_type === "ring") && stage === "fight" && (
        <div className="absolute  top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -250%)" }}>
              <div className="skill_animation">
                <Img src={get_img_url(char?.effect)}></Img>
              </div>
        </div>
      )}
      {char?.effect_type === "skill" && char.attacking == 2 && stage === "fight" && (
        <div className="absolute  top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -250%)" }}>
          <motion.div
            animate={{
              y: -50,
              opacity: 0
            }}
            transition={{ duration: 1 }}
          >
            <div style={{ border: "3px solid black" }}>
              <div style={{ border: "2px solid red" }}>
                <div className="skill_animation">
                  <p className="skill-text">{char?.effect}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
