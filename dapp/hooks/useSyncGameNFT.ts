import { useCallback } from "react"
import { GameNft } from "../types/nft";
import { useAtom } from "jotai";
import { chessId, loseA, moneyA, nameA, shopCharacter, slotCharacter, winA, challengeWinA, challengeLoseA} from "../store/stages";

export const useSyncGameNFT = () => {
    const [_chessId, setChessId] = useAtom(chessId);
    const [_gold, setGold] = useAtom(moneyA);
    const [_win, setWin] = useAtom(winA);
    const [_lose, setLose] = useAtom(loseA);
    const [_challengeWin, setChallengeWin] = useAtom(challengeWinA);
    const [_challengeLose, setChallengeLose] = useAtom(challengeLoseA);
    const [_name, setName] = useAtom(nameA);
    const [_slotCharacter, setSlotCharacter] = useAtom(slotCharacter);
    const [_shopCharacter, setShopCharacter] = useAtom(shopCharacter);

    return useCallback((nft: GameNft) => {
        setChessId(nft.id.id)
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
            role.fields.max_hp = Number(role.fields.hp);
            role.fields.attack = Number(role.fields.attack);
            role.fields.sp_cap = Number(role.fields.sp_cap);
            role.fields.sp = Number(role.fields.sp);
            return role.fields
        }));
        setShopCharacter(nft.cards_pool.fields.roles.map((role) => {
            if (role.fields.class == "none") {
                return null;
            }
            role.fields.attack = Number(role.fields.attack);
            role.fields.max_hp = Number(role.fields.hp);
            role.fields.sp_cap = Number(role.fields.sp_cap);
            role.fields.sp = Number(role.fields.sp);
            return role.fields
        }));
    }, []);
}
