
import { useAtom } from "jotai"
import { hpChangeA, attackChangeA, enemyHpChangeA, enemyAttackChangeA} from "../../store/stages";

export const StatusChange = ({id}: {
    id: number,
}) => {
    const [hpChange, setHpChange] = useAtom(hpChangeA);
    const [enemyHpChange, setEnemyHpChange] = useAtom(enemyHpChangeA);
    const [attackChange, setAttackChange] = useAtom(attackChangeA);
    const [enemyAttackChange, setEnemyAttackChange] = useAtom(enemyAttackChangeA);
    let hp_change = 0;
    let attack_change = 0;
    if (id >= 10) {
        hp_change = enemyHpChange[id - 10];
        attack_change = enemyAttackChange[id - 10];
        if (hp_change != 0) {
            setTimeout(() => {
                enemyHpChange[id - 10] = 0;
                hp_change = 0;
            }, 1000);
        }
        if (attack_change != 0) {
            console.log("ene ak:", enemyAttackChange);
            setTimeout(() => {
                enemyAttackChange[id - 10] = 0;
                attack_change = 0;
            }, 1000);
        }
    } else {
        hp_change = hpChange[id];
        if (hp_change != 0) {
            setTimeout(() => {
                hpChange[id] = 0;
                hp_change = 0;
            }, 1000);
        }
        if (attack_change != 0) {
            setTimeout(() => {
                attackChange[id] = 0;
                attack_change = 0;
            }, 1000);
        }
    }

    const get_hp_text_color = (change: number) => {
        if (change > 0) {
            return "green"
        } else {
            return "red"
        }
    }

    const get_hp_text = (change: number) => {
        if (change > 0) {
            return "HP+" +change;
        } else {
            return "HP" + change;
        }
    }

    return <div style={{zIndex:1000,position:"relative", justifyContent:"left"}}>
        {hp_change != 0 && <div className="text_animation">
            <p style={{color:`${get_hp_text_color(hp_change)}`}} className="moving-text">{get_hp_text(hp_change)}</p>
        </div>}
        {attack_change != 0 && <div className="text_animation">
            <p style={{color:`green`}} className="moving-text">AK+{attack_change}</p>
        </div>}
    </div >
}