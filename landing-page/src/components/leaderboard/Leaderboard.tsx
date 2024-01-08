import { Box, Center, Stack, Text } from "@chakra-ui/react"
import { LeaderboardItem } from "./LeaderboardItem"
import { useEffect } from "react"
import React, { useState } from 'react';
import useQueryRanks, { LineUp } from "@/pages/api/useQueryRanks"


export const Leaderboard : React.FC = () => {
    const [data, setData] = useState<LineUp[]>([]);
    const [poolValue, setPoolValue] = useState<number>(0);
    const { query_rank20, query_total_pools_value } = useQueryRanks()
    useEffect(() => {
        fetch();
    }, [])

    const fetch = async () => {
        const results = await Promise.all([
            query_rank20(),
            query_total_pools_value()
        ]);
        if (results[1]) {
            setPoolValue(results[1]);
        }
        if (Array.isArray(results[0])) {
            console.log(results[0])
            setData(results[0]);
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
        
        <Stack className="mt-16 glass2" gap={0}>
            {/* todo:先不显示，要存点钱进去的 */}
            {/* <Text>Total Pool: {poolValue / 100_000_000} SUI</Text> */}
            {Array.from(data).map((item, i) => {
                return <LeaderboardItem
                    reward={item.score}
                    name = {item.name}
                    address={item.walletAddr} key={i} rank={item.rank} items={item.roles} />
                })
            }
        </Stack>
    </Box>
}