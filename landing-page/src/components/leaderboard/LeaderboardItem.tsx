import { HStack, Link, Spacer, Text } from "@chakra-ui/react"
import { Character } from "../character/character"
import { walletAddressEllipsis } from "@/utils/walletAddressEllipsis"
import Image from "next/image"

export const LeaderboardItem = ({ items, rank, address, reward }: { reward: number, address: string, rank: number, items: string[] }) => {
    return <HStack className="w-full flex py-8" justifyContent={"space-around"} bg={rank % 2 == 0 ? "#0000000b" : "#00000000"}>
        <Text className="text-2xl mr-8">
            #{rank}
        </Text>
        <Link as={"a"} href={`https://suiexplorer.com/address/${address}`} isExternal>
            {walletAddressEllipsis(address)}
        </Link>
        <HStack gap={0} maxW={"60%"} >
            {
                items.map((item, i) => <Character charType={item} key={i} isOpponent={false} />)
            }
        </HStack>
        <HStack className="text-2xl mr-8" >
            <Image alt={"gold"} width={24} height={24} src={"/gold.png"}></Image>
            <Text>{reward} Sui</Text>
        </HStack>
    </HStack>
}