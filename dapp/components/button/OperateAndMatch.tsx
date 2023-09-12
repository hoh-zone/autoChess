import { useCallback, useEffect, useState } from 'react'

import { ethos, TransactionBlock} from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '..';
import { CHESS_GLOBAL, LINEUP_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';
import { chessId, moneyA as moneyAtom, slotCharacter} from "../../store/stages";
import { useAtom } from 'jotai';

const OperateAndMatch = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);
    const [money] = useAtom(moneyAtom);
    const [chars] = useAtom(slotCharacter);
    const [chess_id] = useAtom(chessId);

    const get_chars_strvec = () => {
        let vec:string[] = [];
        for (const index in chars) {
            let cha = chars[index];
            if (cha == null) {
                continue
            }
            // version1:
            vec.push(cha.name);
            // todo: version2:
            // vec.push(cha.name + ":" + cha.level + ":" + cha.attack + ":" + cha.life + ":" + cha.price);
        }
        return vec;
    }

    const operate_submit = useCallback(async () => {
        if (!wallet) return;
        console.log("chars vec:", get_chars_strvec());
        console.log("chessId:", chess_id);
        try {
            const tx = new TransactionBlock();
            const left_gold = money;
            tx.moveCall({
                target: `${PACKAGE_ID}::chess::operate_and_match`,
                arguments: [
                    tx.pure(`${CHESS_GLOBAL}`),
                    tx.pure(`${ROLE_GLOBAL}`),
                    tx.pure(`${LINEUP_GLOBAL}`),
                    tx.pure(left_gold),
                    tx.pure(get_chars_strvec()),
                    tx.pure(chess_id),
                ]
            })

            const response = await wallet.signAndExecuteTransactionBlock({
                transactionBlock:tx,
                options: {
                    showObjectChanges: true,
                    showEffects:true,
                    showEvents:true,
                }
            });
            if (response.events != null) {
                let event_json = response.events[0].parsedJson as any;
                let res = event_json['res']
                if (res == 1) {
                    console.log("you win");
                } else if (res == 2) {
                    console.log("you lose")
                } else {
                    console.log("even");
                }
            }
            console.log("response", response);
        } catch (error) {
            console.log(error);
        }
    }, [wallet]);

    const reset = useCallback(() => {
        setNftObjectId(null)
    }, [])

    useEffect(() => {
        reset();
    }, [reset])

    return { nftObjectId, operate_submit };
};

export default OperateAndMatch;