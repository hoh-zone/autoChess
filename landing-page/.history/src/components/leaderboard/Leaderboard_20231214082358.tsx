import { Box, Center, Stack } from "@chakra-ui/react"
import { LeaderboardItem } from "./LeaderboardItem"
import { useEffect, useState } from "react"
import useQueryRanks, { LineUp } from "@/pages/api/useQueryRanks"


export const Leaderboard = () => {
    const { query_rank20 } = useQueryRanks()
    let array :LineUp[] = [];
    useEffect(() => {
        fetch();
    }, [])

    const fetch = async () => {
        let res = await query_rank20();
        if (Array.isArray(res)) {
            console.log("get", res.length);
            array = res;
        }
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
            {array.map((item, index) => {
                return <text key={index} >sdsa</text>
            })}
        </Stack>
    </Box>
}