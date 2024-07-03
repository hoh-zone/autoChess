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
        console.log('nft:', nft)
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
        console.log("nft:", nft)
        setShopCharacter(nft.cards_pool_roles.map((role) => {
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
        setItems(nft.cards_pool_items.map((item) => {
            item.fields.cost = Number(item.fields.cost);
            item.fields.effect_value = Number(item.fields.effect_value);
            item.fields.range = Number(item.fields.range);
            return item.fields;
        }));
    }, []);
}
