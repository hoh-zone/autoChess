import { Box, Center, Stack, Text } from "@chakra-ui/react";
import { LeaderboardItem } from "./LeaderboardItem";
import { useEffect } from "react";
import React, { useState } from "react";
import useQueryRanks, { LineUp } from "@/pages/api/useQueryRanks";

export const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LineUp[]>([]);
  const [rewards, setRewards] = useState<Number[]>([]);
  const { query_rank20, query_rank20_reward } = useQueryRanks();
  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const results = await Promise.all([query_rank20(), query_rank20_reward()]);
    let ranks: any = results[0];
    let rewardsSui = results[1];
    let array: any = String(rewardsSui).split(",");
    console.log(ranks);
    setData(ranks);
    setRewards(array);
  };

  return (
    <Box
      id="leaderboard"
      px={128}
      py={64}
      className={"bg-[url('/bg1.jpg')] bg-top"}
    >
      <Box className="glass py-0 w-full">
        <Center as="h2">Leaderboard</Center>
      </Box>

      <Stack className="mt-16 glass2" gap={0}>
        {/* todo:先不显示，要存点钱进去的 */}
        {/* <Text>Total Pool: {poolValue / 100_000_000} SUI</Text> */}
        {Array.from(data).map((item, index) => {
          return (
            <LeaderboardItem
              reward={item.score}
              name={item.name}
              address={item.walletAddr}
              key={index}
              rank={item.rank}
              items={item.roles}
              estimateSui={String(rewards[index])}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
