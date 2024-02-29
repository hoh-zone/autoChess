import { useState } from 'react'
import { ethos, TransactionBlock} from 'ethos-connect';
import { chessId, moneyA as moneyAtom, slotCharacter} from "../../store/stages";
import { CHALLENGE_GLOBAL, CHESS_GLOBAL, LINEUP_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';
import { useAtom } from 'jotai';

const useOperateAndMatch = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);
    const [money] = useAtom(moneyAtom);
    const [chars] = useAtom(slotCharacter);
    const [chess_id] = useAtom(chessId);

    const get_chars_strvec = () => {
        let vec:string[] = [];
        for (let index = 0; index < chars.length; index++) {
            let cha = chars[index];
            if (cha == null || cha == undefined) {
                vec.push("");
            } else {
                vec.push(cha.class + "-" +cha.level + ":" + cha.attack + ":" + cha.max_hp);
            }
        }

        console.log("operate: ",vec);
        return vec;
    }

    const operate_submit = async (operations: string[]) => {
        console.log("operations:", operations);
        console.log("chess:", chess_id);
        if (!wallet) return;
        try {
            const tx = new TransactionBlock();
            const left_gold = money;
            tx.moveCall({
                target: `${PACKAGE_ID}::chess::operate_and_battle`,
                arguments: [
                    tx.pure(`${CHESS_GLOBAL}`),
                    tx.pure(`${ROLE_GLOBAL}`),
                    tx.pure(`${LINEUP_GLOBAL}`),
                    tx.pure(`${CHALLENGE_GLOBAL}`),
                    tx.pure(chess_id),
                    tx.pure(operations),
                    tx.pure(left_gold),
                    tx.pure(get_chars_strvec())
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
            console.log("response:", response);
            if (response.objectChanges) {
                const createObjectChange = response.objectChanges.find(
                    (objectChange) => objectChange.type === "created"
                );
                if (!!createObjectChange && "objectId" in createObjectChange) {
                    console.log("objid", createObjectChange.objectId);
                }
            }

            if (response.events != null) {
                let event = response.events[0];
                if (event == null) {
                    console.log("event 异常", event);
                    return;
                }
                let event_json = event.parsedJson as any;
                console.log("event json:", event);
                let res = event_json['res']
                if (res == 1) {
                    console.log("you win");
                } else if (res == 2) {
                    console.log("you lose")
                } else {
                    console.log("even");
                }
                return event_json;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return { nftObjectId, operate_submit };
};

export default useOperateAndMatch;