import { useEffect, useState } from "react";
import useQueryFight from "./button/QueryFightResult";
import { ethos } from "ethos-connect";
import { Button, Tooltip } from "@chakra-ui/react";

export const Instruction = () => {
    const { status } = ethos.useWallet();

    return <Tooltip maxWidth="900px" label={
        <div>
            <p>|How to play|: Every chess, you will have 10 coins to buy your charactors, different charactors own its specific feature, try to use it to gain advantage.</p>
            <br/>
            <p>|Level up|: charactors can compose to level up, 3 one-star can be combined into a two-star character, 3 two-stars can be combined into a three-star character.</p>
            <br/>
            <p>|Normal Mode|: practice and construct your lineup to fight with different players, your enemy would be other players’ past lineup records.</p>
            <br/>
            <p>|Arena Mode|: you have to pay 1 sui ticket fee to enter, and you can check out to get rewards at anytime, the checkout reward depends on your fighting winning records, so try to win to get earn more sui.</p>
            <br/>
            <p>|Problem Feedback|: seansheng4486@gmail.com</p>
        </div>
    }>
    <Button>Instruction</Button>
    </Tooltip>

}