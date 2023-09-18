import { useCallback, useEffect, useState } from 'react'

import { ethos, TransactionBlock} from 'ethos-connect';
import { CHESS_GLOBAL, LINEUP_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';
import { chessId, moneyA as moneyAtom, slotCharacter} from "../../store/stages";
import { useAtom } from 'jotai';
import { addLevelSuffix, removeSuffix } from '../../utils/TextUtils';

const useOperateAndMatch = () => {
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
            vec.push(cha.name + ":" + cha.base_life + ":" + cha.attack);
        }
        console.log("operate: ",vec);
        return vec;
    }

    const operate_submit = async () => {
        if (!wallet) return;
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
            if (response.objectChanges) {
                const createObjectChange = response.objectChanges.find(
                    (objectChange) => objectChange.type === "created"
                );
                if (!!createObjectChange && "objectId" in createObjectChange) {
                    console.log("objid", createObjectChange.objectId);
                }
            }

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
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return { nftObjectId, operate_submit };
};

export default useOperateAndMatch;