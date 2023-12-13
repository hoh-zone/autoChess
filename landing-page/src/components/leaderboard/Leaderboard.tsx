import { Box, Center, Stack } from "@chakra-ui/react"
import { LeaderboardItem } from "./LeaderboardItem"
import { useEffect, useState } from "react"
import QueryRank from "@/pages/api/useQueryChesses"
import useQueryChesses from "@/pages/api/useQueryChesses"


export const Leaderboard = () => {
    const { query_chesses } = useQueryChesses()
    useEffect(() => {
        fetch();
    }, [])

    const fetch = async () => {
        const result = await query_chesses();
        return result
      }

    return <Box
        id="leaderboard"
        px={128} py={64}
        className={"bg-[url('/bg1.jpg')] bg-top"}
    >
        <Box className="glass py-0 w-full">
            <Center as="h2" >
                Leaderboard
            </Center>
        </Box>

        <Stack
            className="mt-16 glass2"
            gap={0}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((item, i) => {
                return <LeaderboardItem
                    reward={20}
                    address={"0x12341235452354123"} key={i} rank={i + 1} items={[
                        "tank",
                        "tree",
                        "fighter",
                        "golem",
                        "kunoichi",
                        "wizard",
                        "shinobi",
                        "priest",
                    ]} />
            })}
        </Stack>
    </Box>
}