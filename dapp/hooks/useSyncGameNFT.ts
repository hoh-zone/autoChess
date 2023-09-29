import { useCallback } from "react"
import { GameNft } from "../types/nft";
import { useAtom } from "jotai";
import { chessId, loseA, moneyA, nameA, shopCharacter, slotCharacter, winA } from "../store/stages";

export const useSyncGameNFT = () => {
    const [_chessId, setChessId] = useAtom(chessId);
    const [_gold, setGold] = useAtom(moneyA);
    const [_win, setWin] = useAtom(winA);
    const [_lose, setLose] = useAtom(loseA);
    const [_name, setName] = useAtom(nameA);
    const [_slotCharacter, setSlotCharacter] = useAtom(slotCharacter);
    const [_shopCharacter, setShopCharacter] = useAtom(shopCharacter);

    return useCallback((nft: GameNft) => {
        setChessId(nft.id.id)
        setGold(Number(nft.gold));
        setWin(nft.win);
        setLose(nft.lose);
        setName(nft.name);
        setSlotCharacter(nft.lineup.fields.roles.map((role) => {
            if (role.fields.name == "none") {
                return null;
            }
            role.fields.base_life = role.fields.life;
            return role.fields
        }));
        setShopCharacter(nft.cards_pool.fields.roles.map((role) => {
            if (role.fields.name == "none") {
                return null;
            }
            role.fields.base_life = role.fields.life;
            return role.fields
        }));
    }, []);
}
