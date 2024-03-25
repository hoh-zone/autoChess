import { Tektur } from "next/font/google";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Box, Center, VStack } from "@chakra-ui/react";
import { Character } from "@/components/character/character";

const inter = Tektur({ subsets: ["latin"] });

export default function DetailsInvite() {
  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className} bg-[url('/bg0.jpg')] bg-top bg-no-repeat bg-cover overflow-x-hidden`}
      >
        <Header />

        <motion.div
          id="invite"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mt-14 px-8 glass relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]"
        >
          <h1>Sui Auto Chess</h1>
        </motion.div>
        <Box className="glass py-0 w-auto mt-16">
          <Center>
            <VStack>
              <div className="glass2 p-16">
                <Character charType="fighter" attack={1} isOpponent={false} />
                <h2 className={`mb-3 text-2xl font-semibold`}>Invite Event</h2>
                <p className={`m-0 text-md  font-sans text-gray-800`}></p>
              </div>
            </VStack>
          </Center>
        </Box>
      </main>
    </>
  );
}
