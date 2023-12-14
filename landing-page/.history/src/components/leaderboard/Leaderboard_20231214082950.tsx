import { Box, Center, Stack } from "@chakra-ui/react"
import { LeaderboardItem } from "./LeaderboardItem"
import { useEffect } from "react"
import React, { useState } from 'react';
import useQueryRanks, { LineUp } from "@/pages/api/useQueryRanks"


export const Leaderboard : React.FC = () => {
    const [data, setData] = useState<LineUp[]>([]);
    const { query_rank20 } = useQueryRanks()
    let array :LineUp[] = [];
    useEffect(() => {
        fetch();
    }, [])

    const fetch = async () => {
        let res = await query_rank20();
        if (Array.isArray(res)) {
            setData(res);
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
            {Array.from(data).map((item, i) => {
                return <LeaderboardItem
                    reward={20}
                    address={"0x12341235452354123"} key={i} rank={item.rank} items={[
                        "tank",
                        "tree",
                        "fighter",
                        "golem",
                        "kunoichi",
                        "wizard",
                        "shinobi",
                        "priest",
                    ]} />
                })
            }
        </Stack>
    </Box>
}