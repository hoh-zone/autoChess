import Image from "next/image";
import { Tektur } from "next/font/google";
import { CharacterLine } from "@/components/CharacterLine";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { Roadmap } from "@/components/Roadmap";

const inter = Tektur({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className} bg-[url('/bg0.jpg')] bg-top bg-no-repeat bg-cover overflow-x-hidden`}
      >
        <Header />

        <motion.div
          id="home"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mt-14 px-8 glass relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]"
        >
          <h1>Sui Auto Chess</h1>
        </motion.div>

        <a href="https://suiautochess.com" className="mt-16 mb-24">
          <button>Enter Game 🕹️</button>
        </a>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
          className="flex gap-16 md:flex-wrap lg:flex-nowrap mb-24"
        >
          <div className="glass2 p-4">
            <h2 className={`mb-3 text-2xl font-semibold`}>Play to earn</h2>
            <p className={`m-0 max-w-[30ch] text-md  font-sans text-gray-800`}>
              Maximize your Sui rewards by showcasing your skill.
            </p>
          </div>

          <div className="glass2 p-4">
            <h2 className={`mb-3 text-2xl font-semibold`}>PvP</h2>
            <p className={`m-0 max-w-[30ch] text-md  font-sans text-gray-800`}>
              Challenge and combat other players in intense PvP encounters.
            </p>
          </div>

          <div className="glass2 p-4">
            <h2 className={`mb-3 text-2xl font-semibold`}>Strategy</h2>
            <p className={`m-0 max-w-[30ch] text-md  font-sans text-gray-800`}>
              Showcase your strategy in turn-based battles featuring
              Auto-Battler gameplay.
            </p>
          </div>

          <div className="glass2 p-4">
            <h2 className={`mb-3 text-2xl font-semibold`}>Leaderboards</h2>
            <p className={`m-0 max-w-[30ch] text-md  font-sans text-gray-800`}>
              Climb the leaderboards for incredible rewards
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, ease: "backOut" }}
          className="w-full"
        >
          <CharacterLine />
        </motion.div>
      </main>
      <Leaderboard />
      <Roadmap />
    </>
  );
}
