import { useCallback, useState } from 'react'

import { ethos } from 'ethos-connect';
import { PACKAGE_ID, SENDER } from '../../lib/constants';

const useQueryFight = () => {
    const { wallet } = ethos.useWallet();
    const query_fight = useCallback(async () => {
        try {
            if (!wallet) return;
            const result = await wallet.client.queryEvents( {
                query: {
                  MoveEventType: PACKAGE_ID + '::chess::FightEvent',
                }
            });
            let json = result.data[0].parsedJson as any;
            // todo:根据nftid进行校验比对
            // let chess_id = json['chess_id'];
            let res = json['res'];
            let v2_name = json['v2_name'];
            let v2_lineup = json['v2_lineup'];
            return json;
        } catch(error) {
            console.log('err', error);
        }
    }, [wallet]);
    return { query_fight };
}

export default useQueryFight;