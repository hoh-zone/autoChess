import { useCallback, useState } from 'react'

import { ethos } from 'ethos-connect';
import { PACKAGE_ID, SENDER } from '../../lib/constants';
import { sleep } from '../../utils/sleep';
import { join } from 'path';

interface HashMap<T> {
    [key: string]: T;
}

const useQueryFight = () => {
    const { wallet } = ethos.useWallet();
    const [ranks, setRanks] = useState<string[]>([]);
    const query_fight_rank = useCallback(async () => {
        const rank_score_map: HashMap<number> = {};
        const rank_map: HashMap<string> = {};
        try {
            if (!wallet) return;
            const result = await wallet.client.queryEvents( {
                query: {
                  MoveEventType: PACKAGE_ID + '::chess::FightEvent',
                },
            });
            result.data.map((fight) => {
                let json = fight.parsedJson as any;
                console.log(json);
                if (json['v1_name'] != "") {
                    let name = json['v1_name']; 
                    if (!rank_score_map.hasOwnProperty(name)) {
                        rank_score_map[name] = Number(json['v1_win']) - 0.1 * Number(json['v1_lose']);
                        rank_map[name] = json['v1_win'] + "-" + json['v1_lose'];
                    } else if (rank_score_map.hasOwnProperty(name) && (Number(json['v1_win']) - 0.1 * Number(json['v1_lose'])) > rank_score_map[name]) {
                        rank_score_map[name] = Number(json['v1_win']) - 0.1 * Number(json['v1_lose']);
                        rank_map[name] = json['v1_win'] + "-" + json['v1_lose'];
                    }
                }
            });
            
            let next = result['nextCursor'];
            let has_next = result['hasNextPage'];
            while (next != null && has_next) {
                let result_tmp = await wallet.client.queryEvents( {
                    query: {
                      MoveEventType: PACKAGE_ID + '::chess::FightEvent',
                    },
                    cursor: {
                        eventSeq: next.eventSeq,
                        txDigest: next?.txDigest
                    }
                });
                result_tmp.data.map((fight) => {
                    let json = fight.parsedJson as any;
                    if (json['v1_name'] != "") {
                        let name = json['v1_name']; 
                        if (!rank_score_map.hasOwnProperty(name)) {
                            rank_score_map[name] = Number(json['v1_win']) - 0.1 * Number(json['v1_lose']);
                            rank_map[name] = json['v1_win'] + "-" + json['v1_lose'];
                        } else if (rank_score_map.hasOwnProperty(name) && (Number(json['v1_win']) - 0.1 * Number(json['v1_lose'])) > rank_score_map[name]) {
                            rank_score_map[name] = Number(json['v1_win']) - 0.1 * Number(json['v1_lose']);
                            rank_map[name] = json['v1_win'] + "-" + json['v1_lose'];
                        }
                    }
                });
                next = result_tmp['nextCursor']; 
                has_next = result_tmp['hasNextPage'];
            }
            let res:string[] = [];
            const entries = Object.entries(rank_score_map);
            entries.sort((a, b) => b[1] - a[1]);
            entries.forEach(([key, value]) => {
                res.push(key + ":" + rank_map[key]);
            });
            setRanks(res);
            console.log("rank", res);
        } catch(error) {
            console.log('err', error);
        }
    }, [wallet]);

    const query_fight = useCallback(async (nft_id:string, last_win:number, last_lose:number) => {
        try {
            if (!wallet) return;
            let max_query = 0
            while(max_query < 3) {
                const result = await wallet.client.queryEvents( {
                    query: {
                      MoveEventType: PACKAGE_ID + '::chess::FightEvent',
                    }
                });
                for (let i = 0; i < result.data.length; i++) {
                    let json = result.data[i].parsedJson as any;
                    let chess_id = json['chess_id'];
                    if (chess_id == nft_id) {
                        console.log("fight result", json);
                        let win = Number(json['v1_win']);
                        let lose = Number(json['v1_lose']);
                        if (win <= last_win && lose <= last_lose) {
                            console.log("查询失败，触发下次查询");
                            await sleep(500);
                            break;
                        }
                        return json;
                    }
                }
                max_query += 1;
            }
            
        } catch(error) {
            console.log('err', error);
        }
    }, [wallet]);
    return {ranks, query_fight, query_fight_rank};
}

export default useQueryFight;