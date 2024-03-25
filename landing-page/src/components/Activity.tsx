import { Box, Center, HStack, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export const Activity = () => {
  const router = useRouter();
  const handleJump = (path: string) => {
    router.push(path);
  };
  return (
    <Box
      id="activity"
      px={128}
      py={64}
      minH={"100vh"}
      className={"bg-[url('/bg2.jpg')] bg-top"}
    >
      <Box className="glass py-0 w-full mt-16">
        <Center as="h2">Launch Events</Center>
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
            <a
              onClick={() => {
                handleJump("/detailsRank");
              }}
            >
              <Image
                className="blackglass"
                alt={"sui"}
                layout="responsive"
                width={500}
                height={500}
                src={"/rank.png"}
              ></Image>
            </a>
          </Box>
          <Box className="mt-20 mb-16 mr-16">
            <a
              onClick={() => {
                handleJump("/detailsInvite");
              }}
            >
              <Image
                className="blackglass"
                alt={"sui"}
                layout="responsive"
                width={500}
                height={500}
                src={"/invite.png"}
              ></Image>
            </a>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};
