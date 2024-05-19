import { useCallback } from "react"
import { GameNft } from "../types/nft";
import { useAtom } from "jotai";
import { chessId, loseA, moneyA, nameA, shopCharacter, slotCharacter, winA, challengeWinA, challengeLoseA, itemsA, myHash0A} from "../store/stages";

export const useSyncGameNFT = () => {
    const [_myHash0, setMyHash0] = useAtom(myHash0A)
    const [_chessId, setChessId] = useAtom(chessId);
    const [_gold, setGold] = useAtom(moneyA);
    const [_win, setWin] = useAtom(winA);
    const [_lose, setLose] = useAtom(loseA);
    const [_challengeWin, setChallengeWin] = useAtom(challengeWinA);
    const [_challengeLose, setChallengeLose] = useAtom(challengeLoseA);
    const [_name, setName] = useAtom(nameA);
    const [_slotCharacter, setSlotCharacter] = useAtom(slotCharacter);
    const [_shopCharacter, setShopCharacter] = useAtom(shopCharacter);
    const [_items, setItems] = useAtom(itemsA)

    return useCallback((nft: GameNft) => {
        setMyHash0(nft?.hash0)
        setChessId(nft?.id?.id)
        setGold(Number(nft.gold));
        setWin(nft.win);
        setLose(nft.lose);
        setName(nft.name);
        setChallengeWin(nft.challenge_win);
        setChallengeLose(nft.challenge_lose);
        setSlotCharacter(nft.lineup.fields.roles.map((role) => {
            if (role.fields.class == "none") {
                return null;
            }
            role.fields.hp = Number(role.fields.hp);
            role.fields.max_hp = Number(role.fields.hp);
            role.fields.attack = Number(role.fields.attack);
            role.fields.sp_cap = Number(role.fields.sp_cap);
            role.fields.sp = Number(role.fields.sp);
            role.fields.speed = Number(role.fields.speed);
            role.fields.base_speed = Number(role.fields.speed);
            return role.fields
        }));
        setShopCharacter(nft.cards_pool.fields.roles.map((role) => {
            if (role.fields.class == "none") {
                return null;
            }
            role.fields.hp = Number(role.fields.hp);
            role.fields.attack = Number(role.fields.attack);
            role.fields.max_hp = Number(role.fields.hp);
            role.fields.sp_cap = Number(role.fields.sp_cap);
            role.fields.sp = Number(role.fields.sp);
            role.fields.speed = Number(role.fields.speed);
            role.fields.base_speed = Number(role.fields.speed);
            return role.fields
        }));
        
        // todo: for test
        setItems([
            {
                name: "rice_ball",
                effect: "Permanently increase hp",
                range: 1,
                duration: "permanent",
                effect_value: 3,
                cost: 2,
                selling_price: 1,
            },
            {
                name: "dragon_fruit",
                effect: "Permanently increase attack",
                range: 1,
                duration: "permanent",
                effect_value: 3,
                cost: 2,
                selling_price: 1,
            },
            {
                name: "boot",
                effect: "Permanently increase speed",
                range: 1,
                duration: "permanent",
                effect_value: 2,
                cost: 2,
                selling_price: 1,
            },
            {
                name: "devil_fruit",
                effect: "Permanently reduce hp and increase attack",
                range: 1,
                duration: "permanent",
                effect_value: 20,
                cost: 2,
                selling_price: 1,
            },
            {
                name: "magic_potion",
                effect: "Increase sp for one battle",
                range: 1,
                duration: "once",
                effect_value: "max",
                cost: 2,
                selling_price: 1,
            },
            {
                name: "red_potion",
                effect: "Increase hp for one battle",
                range: 6,
                duration: "once",
                effect_value: 3,
                cost: 3,
                selling_price: 2,
            },
            {
                name: "purple_potion",
                effect: "Increase sp for one battle",
                range: 6,
                duration: "once",
                effect_value: 1,
                cost: 3,
                selling_price: 2,
            },
            {
                name: "whet_stone",
                effect: "Increase attack for one battle",
                range: 6,
                duration: "once",
                effect_value: 2,
                cost: 3,
                selling_price: 2,
            },
            {
                name: "chicken_drumstick",
                effect: "Increase speed for one battle",
                range: 6,
                duration: "once",
                effect_value: 1,
                cost: 3,
                selling_price: 2,
            },
            {
                name: "invisibility_cloak",
                effect: "Suffer no damage when attacked the first time",
                range: 1,
                duration: "once",
                effect_value: "no_damage_one_round",
                cost: 2,
                selling_price: 2,
            },
            {
                name: "chess",
                effect: "Replace the chosen character with a randomly decided character of the same level",
                range: 1,
                duration: "once",
                effect_value: "random_replace",
                cost: 3,
                selling_price: 2,
            }
        ])

    }, []);
}
