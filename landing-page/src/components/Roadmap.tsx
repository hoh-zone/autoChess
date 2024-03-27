import {
  Text,
  Box,
  Center,
  HStack,
  VStack,
  Img,
  Button,
  Link,
} from "@chakra-ui/react";
import { Character } from "./character/character";
import Image from "next/image";

export const Roadmap = () => {
  return (
    <Box
      id="roadmap"
      px={128}
      py={64}
      minH={"100vh"}
      className={"bg-[url('/bg2.jpg')] bg-top"}
    >
      <Box className="glass py-0 w-full mt-16">
        <Center as="h2">Roadmap</Center>
        <HStack>
          <Box className="glass py-0 w-full m-16 p-16 pb-8">
            <Character charType="tank" attack={2} isOpponent={false} />
            <HStack>
              <p>🚬</p>
              <h2 className={`mb-3 text-2xl font-semibold`}>Milestone1</h2>
            </HStack>

            <p className={`m-0 max-w-[30ch] text-md  font-sans`}>
              🎁 Launch on Mainnet
            </p>
            <p>🎁 Invite Friends Activites</p>
            <p>🎁 Airdrop Distribution</p>
          </Box>
          <Box className="glass py-0 w-full m-16 p-16 pb-8">
            <Character charType="fighter" isOpponent={false} />
            <h2 className={`mb-3 text-2xl font-semibold`}>Milestone2</h2>
            <p>⏰Character Skill System</p>
            <p>⏰Item Shop</p>
            <p>⏰Speed System</p>
          </Box>
          <Box className="glass py-0 w-full m-16 p-16 pb-8">
            <Character charType="tree" isOpponent={false} />
            <h2 className={`mb-3 text-2xl font-semibold`}>Milestone3</h2>
            <p>📋Gamefi Market</p>
            <p>📋Achievements System</p>
            <p>📋Connect with other Sui Partners</p>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};
