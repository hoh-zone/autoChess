import { HStack, Spacer } from "@chakra-ui/react"
import { SignInButton } from "ethos-connect";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";

export const Header = () => {
    return <nav className="w-full fixed top-0 z-50">
        <HStack
            zIndex={10000}
            top={12}
            px={52}
            py={12}
            className="glass2"
            border={"unset"}
            borderRadius={0}
            gap={24}
        >
            <Image alt="profile" src="/profile.jpeg" width={38} height={38} className="rounded-full"/>
            <a href="#home">
                Home
            </a>
            <a href="#leaderboard">
                Leaderboard
            </a>
            <a href="#roadmap">
                Roadmap
            </a>
            <Spacer />
            <a href="https://twitter.com/SuiAutoChess" target="_blank">
                <FaXTwitter />
            </a>
            <SignInButton />
        </HStack>
    </nav>
}