import { HStack, Link, Text, VStack } from "@chakra-ui/react";
import { Character } from "../character/character";
import { walletAddressEllipsis } from "@/utils/walletAddressEllipsis";
import Image from "next/image";
import useQueryRanks from "@/pages/api/useQueryRanks";
import { ethos } from "ethos-connect";
import { useToast } from "@chakra-ui/react";

function get_role_name(data: string): string {
  if (data) {
    let name = data.replace(/\d+/g, "").slice(0, -1);
    name = name.replace("_", "");
    return name;
  }
  return "";
}

function get_role_level(data: string): number {
  if (data) {
    return parseInt(data.slice(-1));
  }
  return 1;
}

export const LeaderboardItem = ({
  items,
  rank,
  address,
  reward,
  name,
  estimateSui,
}: {
  reward: number;
  name: String;
  address: string;
  rank: number;
  items: string[];
  estimateSui: String;
}) => {
  const toast = useToast();
  return (
    <HStack
      className="w-full flex py-8  text-black"
      justifyContent={"space-around"}
      bg={rank % 2 == 0 ? "#0000000b" : "#00000000"}
    >
      <Text className="text-2xl mr-8">N0.{rank}</Text>
      <Text className="text-2xl mr-8">{name}</Text>
      <Link
        as={"a"}
        href={`https://suiexplorer.com/address/${address}`}
        isExternal
      >
        {walletAddressEllipsis(address)}
      </Link>
      <HStack gap={0} maxW={"60%"}>
        {Array.isArray(items) &&
          items.map((item, i) => (
            <VStack key={i}>
              <Text>Lv{get_role_level(item)}</Text>
              <Character charType={get_role_name(item)} isOpponent={false} />
            </VStack>
          ))}
      </HStack>
      <HStack className="text-2xl mr-8">
        <Image alt={"gold"} width={24} height={24} src={"/gold.png"}></Image>
        <Text>Score:{reward}</Text>
      </HStack>

      <HStack className="text-2xl mr-1">
        <Image alt={"sui"} width={24} height={24} src={"/sui.png"}></Image>
        <Text>{Number(estimateSui) / 1_000_000_000} Sui</Text>
      </HStack>
      {
        <HStack className="text-2xl mr-1">
          <button
            onClick={() =>
              toast({
                title: "Sorry",
                description:
                  "The reward hasn't been unlocked, please wait for the end of rank activity",
                status: "warning",
                duration: 3000,
                isClosable: true,
              })
            }
          >
            <h6>Claim</h6>
          </button>
        </HStack>
      }
    </HStack>
  );
};
