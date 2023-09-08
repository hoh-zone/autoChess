import { Character } from "./character";

export function OrcArcherCharacter({ colorId }: { colorId: "1" | "2" | "3" }) {
    return <Character
        attackSrc={`./Orc_Archer_0${colorId}_ATK_Full_18x1.png`}
        moveSrc={`./Orc_Archer_0${colorId}_Move_6x1.png`}
        width="148px"
        height="82px"
        className="orcArcher"
    />
}