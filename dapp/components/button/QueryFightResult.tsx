import { useCallback, useState } from 'react'

import { ethos } from 'ethos-connect';
import { PACKAGE_ID, SENDER } from '../../lib/constants';

interface HashMap<T> {
    [key: string]: T;
}

const useQueryFight = () => {
    const { wallet } = ethos.useWallet();
    const [ranks, setRanks] = useState<string[]>([]);
    const query_fight_rank = useCallback(async () => {
        const rank_win_map: HashMap<number> = {};
        const rank_map: HashMap<string> = {};
        try {
            if (!wallet) return;
            const result = await wallet.client.queryEvents( {
                query: {
                  MoveEventType: PACKAGE_ID + '::chess::FightEvent',
                }
            });
            console.log("enemy:", result);
            result.data.map((fight) => {
                let json = fight.parsedJson as any;
                if (json['v1_name'] != "") {
                    let name = json['v1_name']; 
                    if (!rank_win_map.hasOwnProperty(name)) {
                        rank_win_map[name] = json['v1_win'];
                        rank_map[name] = json['v1_win'] + "-" + json['v1_lose'];
                    } else if (rank_win_map.hasOwnProperty(name) && json['v1_win'] > rank_win_map[name]) {
                        rank_win_map[name] = json['v1_win'];
                        rank_map[name] = json['v1_win'] + "-" + json['v1_lose'];
                    }
                }
            });
            let res:string[] = [];

            // order print
            const entries = Object.entries(rank_win_map);
            entries.sort((a, b) => b[1] - a[1]);
            entries.forEach(([key, value]) => {
                res.push(key + ":" + rank_map[key]);
            });
            setRanks(res);
        } catch(error) {
            console.log('err', error);
        }
    }, [wallet]);

    const query_fight = useCallback(async (nft_id:string) => {
        try {
            if (!wallet) return;
            const result = await wallet.client.queryEvents( {
                query: {
                  MoveEventType: PACKAGE_ID + '::chess::FightEvent',
                }
            });
            console.log("fight result", result);
            for (let i = 0; i < result.data.length; i++) {
                let json = result.data[i].parsedJson as any;
                let chess_id = json['chess_id'];
                if (chess_id == nft_id) {
                    return json;
                }
            }
        } catch(error) {
            console.log('err', error);
        }
    }, [wallet]);
    return {ranks, query_fight, query_fight_rank};
}

export default useQueryFight;