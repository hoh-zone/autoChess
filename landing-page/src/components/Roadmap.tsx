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
        <HStack></HStack>
      </Box>
    </Box>
  );
};
