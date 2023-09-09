import { CharColor, CharType } from "./type";

const charTable: {
    [key: number]: {
        charType: CharType, charColor: CharColor
    };
}
    = {
    1: {
        charType: "orcBarbare",
        charColor: "1"
    },
    2: {
        charType: "orcBarbare",
        charColor: "2"
    },
    3: {
        charType: "orcBarbare",
        charColor: "3"
    },
    4: {
        charType: "orcArcher",
        charColor: "1"
    },
    5: {
        charType: "orcArcher",
        charColor: "2"
    },
    6: {
        charType: "orcArcher",
        charColor: "3"
    },
    7: {
        charType: "humanKnight",
        charColor: "Humans"
    },
};

export const getCharacter = (id: keyof typeof charTable): {
    charType: CharType, charColor: CharColor
} => {
    return charTable[id];
}