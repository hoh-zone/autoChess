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
                <Character charType="ani" attack={1} isOpponent={false} />
                <h2 className={`mb-3 text-2xl font-semibold`}>Invite Event</h2>
                <p className={`m-0 text-md  font-sans text-gray-800`}>
                  SuiAutoChess: Rally Friends for a Shared Points Feast<br></br>
                  <br></br>
                  Event Duration: 3/27 to 4/10<br></br>
                  How to Participate: Each player will receive a unique
                  invitation code. Share your invitation code with friends and
                  invite them to join the world of “SuiAutoChess”!<br></br>
                  Valid Users: New users need to register using your invitation
                  code and complete at least one battle in the Arena. Regardless
                  of the outcome, both you and your new comrade will <br></br>
                  receive points rewards!<br></br>
                  Invitation Limit: Each player can invite up to 5 valid users.
                  The more successful invitations, the more generous the
                  rewards!<br></br>
                  Permanent Rewards: Inviters will receive 20% of the ticket
                  handling fees and points rewards from the invitees in each
                  round!<br></br>
                  Mysterious Airdrop: Players who successfully invite 5 valid
                  users will also receive a mysterious airdrop reward prepared
                  by us!<br></br>
                  <br></br>
                  💡 Event Rules:<br></br>
                  <br></br>
                  The invitation code must be filled in during new user
                  registration.<br></br>
                  Valid Arena battles must be completed within the event
                  duration.<br></br>
                  Points rewards will be updated within 24 hours after the
                  battle ends.<br></br>
                  Mysterious airdrop rewards will be distributed within a week
                  after the event ends.<br></br>
                  <br></br>
                  🌟 Let’s fight together and win glory! Not only can you enjoy
                  the fun of strategic battles, but you can also win rewards
                  with friends.<br></br>
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
