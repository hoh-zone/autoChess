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
      <Box className="glass py-0 w-full">
        <Center as="h2">Roadmap</Center>
      </Box>

      <Box className="glass py-0 w-full mt-16">
        <HStack>
          <Box
            className="mt-20 ml-16 mb-16"
            style={{ position: "relative", width: "100%", height: "auto" }}
          >
            <Image
              className="blackglass"
              alt={"sui"}
              layout="responsive"
              width={400}
              height={600}
              src={"/battle2.png"}
            ></Image>
            <a href="https://suiautochess.com">
              <Button
                style={{
                  position: "absolute",
                  width: "auto",
                  height: "15%",
                  left: "5%",
                  top: "80%",
                }}
              >
                Plat to earn 🕹️
              </Button>
            </a>
          </Box>
          <Box className="mt-20 mb-16 mr-16 ml-16">
            <Image
              className="blackglass"
              alt={"sui"}
              layout="responsive"
              width={500}
              height={500}
              src={"/rank.png"}
            ></Image>
          </Box>
          <Box className="mt-20 mb-16 mr-16">
            <Image
              className="blackglass"
              alt={"sui"}
              layout="responsive"
              width={500}
              height={500}
              src={"/invite.png"}
            ></Image>
          </Box>
          {/* <Image
            className="glass2 py-0 w-fit ml-12 mt-40 mb-32 pb-8 pt-8 px-8"
            alt={"sui"}
            width={354}
            height={354}
            src={"/invite.png"}
          ></Image>
          <Image
            className="glass2 py-0 w-fit ml-12 mt-40 mb-32 pb-8 pt-8 px-8"
            alt={"sui"}
            width={354}
            height={354}
            src={"/rank.png"}
          ></Image> */}
        </HStack>
      </Box>
    </Box>
  );
};
