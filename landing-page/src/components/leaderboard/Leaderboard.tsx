import { Box, Center, Stack, Text } from "@chakra-ui/react";
import { LeaderboardItem } from "./LeaderboardItem";
import { useEffect } from "react";
import React, { useState } from "react";
import useQueryRanks, { LineUp } from "@/pages/api/useQueryRanks";

export const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LineUp[]>([]);
  const [rewards, setRewards] = useState<Number[]>([]);
  const [countdown, setCountDown] = useState("");
  const { query_rank20, query_rank20_reward, query_left_challenge_time } =
    useQueryRanks();

  const formatMilliseconds = (milliseconds: any) => {
    if (milliseconds == 0) {
      return "";
    }
    var seconds = Math.floor(milliseconds / 1000);
    var days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    var hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    if (days >= 1) {
      return days + " days " + hours + " hours " + minutes + " min";
    } else {
      if (hours >= 1) {
        return hours + " hours " + minutes + " min";
      } else {
        return minutes + " min";
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const results = await Promise.all([
      query_rank20(),
      query_left_challenge_time(),
    ]);
    let ranks: any = results[0];
    let estimateRewards: any[] = [];
    let leftTime = results[1];
    setCountDown(formatMilliseconds(Number(leftTime)));
    let array: [] = [];
    let init_sui_reward = 2000;
    let total_scores = 0;
    ranks.map((item: any) => {
      total_scores += item.score;
    });
    ranks.map((item: any, index: number) => {
      estimateRewards[index] = String(
        ((item.score / total_scores) * init_sui_reward).toFixed(2)
      );
    });
    setData(ranks);
    setRewards(estimateRewards);
  };

  return (
    <Box
      id="leaderboard"
      px={128}
      py={64}
      className={"bg-[url('/bg1.jpg')] bg-top"}
    >
      <Center as="h2">Leaderboard</Center>
      <Center as="h4">
        Congratulations for the rank20 heros of 1st season!
      </Center>
      <Center as="h4">
        If you have any claim problem, please contact us suiautochess@gmail.com
      </Center>
      {countdown !== "" && (
        <Center as="h3">Unlock Countdown: {countdown}</Center>
      )}
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
              isEnd={countdown === ""}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
