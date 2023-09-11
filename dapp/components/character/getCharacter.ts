import { CharType } from "./type";

const charMapTable: { [key: number]: CharType }
    = {
    1: "kunoichi",
    2: "ani",
    3: "archer",
    4: "assa",
    5: "cleric",
    6: "fighter",
    7: "golem",
    8: "mega",
    9: "priest",
    10: "shaman",
    11: "shinobi",
    12: "firemega",
    13: "slime",
    14: "tank",
    15: "tree",
    16: "wizard",
};

export const getCharacterById = (id: number): CharType => {
    return charMapTable[id];
}