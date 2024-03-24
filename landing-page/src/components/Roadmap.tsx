import { Text, Box, Center, HStack, VStack } from "@chakra-ui/react";
import { Character } from "./character/character";

export const Roadmap = () => {
  return (
    <Box
      id="roadmap"
      px={128}
      py={64}
      minH={"100vh"}
      className={"bg-[url('/bg2.jpg')] bg-top"}
    >
      <Box className="glass py-0 w-full">
        <Center as="h2">Roadmap</Center>
      </Box>

      <Box className="glass py-0 w-full mt-16">
        <HStack>
          <Box className="glass2 py-0 w-fit ml-32 mt-80 mb-32 pb-8 px-8">
            <VStack>
              <Character charType="tank" attack={1} isOpponent={false} />
              <Text as="h5" fontSize={"2vw"}>
                {"Milestone 1"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📌Launch on Sui Mainnet on March 27"}
              </Text>
              <p
                className={`m-0 max-w-[30ch] text-md  font-sans text-gray-800`}
              >
                Construct Discord, promotion on Twiiter
              </p>
              <Text as="h5" style={{ textAlign: "left" }} fontSize={"1vw"}>
                {"📌Airdrop distribution for early participators"}
              </Text>
              <p
                className={`m-0 max-w-[30ch] text-md  font-sans text-gray-800`}
              >
                {"Airdrop will be distributed according to player's level"}
              </p>
            </VStack>
          </Box>
          <Box className="glass2 py-0 w-fit ml-32 mt-40 mb-32 pb-8 px-8">
            <VStack>
              <Character charType="wizard" isOpponent={false} />
              <Text as="h5" fontSize={"2vw"}>
                {"Milestone 2"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📋 Fight Balance modification"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📋 add new roles before May 2024"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📋 Add object items in shop"}
              </Text>
            </VStack>
          </Box>
          <Box className="glass2 py-0 w-fit ml-32 mt-0 mb-32  pb-8 px-8">
            <VStack>
              <Character charType="tree" isOpponent={false} />
              <Text as="h5" fontSize={"2vw"}>
                {"Milestone 3"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📋 Achievement Systgem"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📋 Market System"}
              </Text>
              <Text as="h5" fontSize={"1vw"}>
                {"📋 Add object items in shop"}
              </Text>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};
