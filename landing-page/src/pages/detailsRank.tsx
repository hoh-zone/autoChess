import { Tektur } from "next/font/google";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Box, Center, VStack } from "@chakra-ui/react";
import { Character } from "@/components/character/character";

const inter = Tektur({ subsets: ["latin"] });

export default function DetailsRank() {
  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className} bg-[url('/bg0.jpg')] bg-top bg-no-repeat bg-cover overflow-x-hidden`}
      >
        <Header />

        <motion.div
          id="Index2"
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
                <h2 className={`mb-3 text-2xl font-semibold`}>
                  Rank Challenge
                </h2>
                <p
                  className={`m-0 text-md max-w-[130ch] font-sans text-gray-800`}
                >
                  🌟 Launch of the Massive Pump for SuiAutoChess 🌟 <br></br>
                  Dear Strategy Game Enthusiasts,<br></br>
                  We are thrilled to announce the official launch of
                  SuiAutoChess, a brand-new Play to Earn Auto Battler strategy
                  game. Embrace the digital world filled with strategy and
                  rewards, and experience unparalleled gaming pleasure.<br></br>
                  <br></br>
                  🎲 Game Introduction:<br></br>
                  SuiAutoChess combines the classic Auto Chess gameplay with
                  innovative blockchain technology, offering you a unique gaming
                  experience. Here, every victory is not just a tactical success
                  but also a tangible reward. By participating in the game, you
                  will have the opportunity to earn SUI tokens and even compete
                  for cash prizes. <br></br>
                  <br></br>
                  🥳 Limited-Time Events Now Open:<br></br>
                  To celebrate our launch, we are excited to introduce two
                  limited-time events: - **Invitation Event**: Invite new users
                  to join SuiAutoChess, and both you and the invited party will
                  receive point rewards. The more you invite, the richer the
                  rewards. - **Ladder Competition Event**: Participate in the
                  Arena battles, accumulate victories, and climb the ladder
                  rankings. The top 20 players will share a grand prize pool of
                  over $4,000 in cash.<br></br>
                  <br></br>
                  📢 Our Sincere Invitation:<br></br>
                  Join SuiAutoChess and showcase your wisdom in a world where
                  strategy reigns supreme. Whether you are a seasoned Auto Chess
                  player or a newcomer, there is a stage for you here. <br></br>
                  <br></br>
                  🔗 Learn More:<br></br>- Official Website:
                  https://www.autochess.app/<br></br>- Twitter:
                  https://twitter.com/SuiAutoChess<br></br>- Discord: TBD (To Be
                  Determined)<br></br>
                  <br></br>
                  Thank you for your support of SuiAutoChess. Let&apos;s embark
                  on this feast of strategy and wisdom together!<br></br>
                  <br></br>
                  Best regards,<br></br>
                  <br></br>
                  The SuiAutoChess Team<br></br>
                </p>
              </div>
            </VStack>
          </Center>
        </Box>
      </main>
    </>
  );
}
