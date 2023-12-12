import { Text, Box, Center } from "@chakra-ui/react"

export const Roadmap = () => {
    return <Box
        id="roadmap"
        px={128} py={64}
        minH={"100vh"}
        className={"bg-[url('/bg2.jpg')] bg-top"}
    >
        <Box className="glass py-0 w-full">
            <Center as="h2" >
                Roadmap
            </Center>
        </Box>

        <Center className="w-full">
            <Box className="glass2 py-0 w-fit mt-32 px-8">
                <Text as="h2" fontSize={"4vw"} >
                    Coming Soon
                </Text>
            </Box>
        </Center>

    </Box>
}