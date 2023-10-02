import { ethos } from "ethos-connect";
import { Button, Tooltip } from "@chakra-ui/react";
import { getVw } from '../utils/index';

export const CharInstruction = () => {
    return <Tooltip maxWidth={getVw(900)} label={
        <div>
            <p>Charactor Features:</p>
            <br/>
            <p>|aoe|: attack all enemies at once.</p>
            <br/>
            <p>|add_all_hp|: add all the charactors&apos; max hp every match, the effect is permanent even when match ends.</p>
            <br/>
            <p>|add_all_tmp_attack|: add all the charactors&apos; attack every match, the effect is temporary within match.</p>
            <br/>
            <p>|add_all_tmp_hp|: add all the charactors&apos; max hp every match, the effect is temporary within match.</p>
            <br/>
            <p>|forbid_buff|: if only charactor is alive, any positive buff upon enemy is invalid.</p>
            <br/>
            <p>|attack_lowest_hp|: prioritize attacking the lowest hp charactor.</p>
            <br/>
        </div>
    }>
    <Button>Instruction</Button>
    </Tooltip>

}