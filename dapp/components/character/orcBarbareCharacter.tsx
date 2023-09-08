import { Character } from "./character";

export function OrcBarbareCharacter({ colorId }: { colorId: "1" | "2" | "3" }) {
    return <Character
        attackSrc={`./Orc_Barbare_0${colorId}_ATK_Full_12x1.png`}
        moveSrc={`./Orc_Barbare_0${colorId}_Move_5x1.png`}
        width="114px"
        height="116px"
        attackAnim="attack"
        moveAnim="move"
        className="orcBarbare"
    />
}