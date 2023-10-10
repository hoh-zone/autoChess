
import { useAtom } from "jotai"
import { skillTagA, enemySkillTagA, enemyCharacterV2, slotCharacterV2} from "../../store/stages";
import { CharacterFields } from "../../types/nft";

export const SkillTag = ({id}: {
    id: number,
}) => {
    const [skillTag, setSkillTag] = useAtom(skillTagA);
    const [enemySkillTag, setEnemySkillTag] = useAtom(enemySkillTagA);
    const [chars] = useAtom(slotCharacterV2);
    const [enemy_chars] = useAtom(enemyCharacterV2);
    let isOpponent = id > 10;
    let char: CharacterFields | null = null;
    char = isOpponent ? enemy_chars[id - 10]: chars[id];
    let skill = "";
    if (id >= 10) {
        skill = enemySkillTag[id - 10];
        if (skill !== "") {
            setTimeout(() => {
                enemySkillTag[id - 10] = "";
                skill = "";
            }, 500);
        }
    } else {
        skill = skillTag[id];
        if (skill !== "") {
            setTimeout(() => {
                skillTag[id] = "";
                skill = "";
            }, 500);
        }
    }

    return <div style={{zIndex:1000,position:"relative", justifyContent:"left"}}>
        {skill !== "" &&  <div className="absolute  top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -250%)" }} >
            <div style={{border:"3px solid black"}}>
                    <div style={{border:"2px solid red"}}>
                        <div className="skill_animation">
                            <p className="skill-text">{char?.effect}</p>
                        </div>
                    </div>
                </div >
            </div>}
        </div>
}