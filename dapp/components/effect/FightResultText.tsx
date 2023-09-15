import { Center } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { fightResultEffectA } from "../../store/stages";
import { motion } from "framer-motion";

export const FightResultText = () => {
    const [fightResult, setFightResult] = useAtom(fightResultEffectA);

    return <>
        {fightResult !== null && (<Center className="absolute top-0 w-full h-full z-50 text-[500%]  text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
            >{fightResult}
            </motion.div>
        </Center>)}
    </>;
}
