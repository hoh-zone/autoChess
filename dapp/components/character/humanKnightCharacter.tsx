import { Character } from "./character";

export function HumanKnightCharacter({ colorId }: { colorId: "Humans"}) {
    return <Character
        attackSrc={`./00_${colorId}_Tiny_Knight_Attack_11x1.png`}
        moveSrc={`./00_${colorId}_Tiny_Knight_Run_8x1.png`}
        width="96px"
        height="90px"
        className="humanKnight"
    />
}