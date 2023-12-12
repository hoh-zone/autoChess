import { HStack, Spacer, Stack } from "@chakra-ui/react"
import { Character } from "./character/character"

export const CharacterLine = () => {
    return <Stack className="w-full">
        <HStack className="w-full flex h-24" gap={24}>
            <Character charType="tank" isOpponent={false} />
            <Character charType="tree" isOpponent={false} />
            <Character charType="fighter" isOpponent={false} />
            <Character charType="golem" isOpponent={false} attack={2}/>
            <Spacer />
            <Character charType="kunoichi" isOpponent={true} attack={2}/>
            <Character charType="wizard" isOpponent={true} />
            <Character charType="shinobi" isOpponent={true} />
            <Character charType="priest" isOpponent={true} />
            
        </HStack>
        <HStack className="w-full flex h-24" gap={24}>
            <Character charType="archer" isOpponent={false} />
            <Character charType="slime" isOpponent={false} />
            <Character charType="assa" isOpponent={false} />
            <Character charType="shaman" isOpponent={false} attack={2}/>
            <Spacer />
            <Character charType="firemega" isOpponent={true} attack={2}/>
            <Character charType="mega" isOpponent={true} />
            <Character charType="cleric" isOpponent={true} />
            <Character charType="ani" isOpponent={true} />
        </HStack>
    </Stack>
}