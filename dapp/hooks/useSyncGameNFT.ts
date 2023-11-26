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
            if (role.fields.name == "none") {
                return null;
            }
            role.fields.max_life = role.fields.life;
            role.fields.magic = 0;
            return role.fields
        }));
        console.log("nft:", nft.lineup);
        setShopCharacter(nft.cards_pool.fields.roles.map((role) => {
            if (role.fields.name == "none") {
                return null;
            }

            // todo:待删除
            role.fields.name = role.fields.name.replace("fireMega", "firemega");
            role.fields.attack = Number(role.fields.attack);
            role.fields.life = Number(role.fields.life);
            role.fields.max_life = role.fields.life;
            return role.fields
        }));
        console.log("pool:",nft.cards_pool.fields.roles);
    }, []);
}
