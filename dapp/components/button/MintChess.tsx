import { useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock} from 'ethos-connect';
import { CHESS_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';

type Props = {
    username:string,
    is_arena: boolean
}

const useMintChess = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const mint = useCallback(async ({username, is_arena}: Props) => {
        if (!wallet) return;
        let method = is_arena ? "mint_arena_chess" : "mint_chess";
        let moveModule = "chess";
        try {
            const transactionBlock = new TransactionBlock();
            if (is_arena) {
                // 动态改成1,5,10，100, 500
                let price = 1;
                let coins = transactionBlock.splitCoins(transactionBlock.gas, [transactionBlock.pure(price * 1_000_000_000)]);
                let coin_vec = transactionBlock.makeMoveVec({objects:[coins]});
                transactionBlock.moveCall({
                    target: `${PACKAGE_ID}::${moveModule}::${method}`,
                    arguments: [
                        transactionBlock.pure(`${ROLE_GLOBAL}`),
                        transactionBlock.pure(`${CHESS_GLOBAL}`),
                        transactionBlock.pure(username),
                        coin_vec,
                    ]
                })
            } else {
                transactionBlock.moveCall({
                    target: `${PACKAGE_ID}::${moveModule}::${method}`,
                    arguments: [
                        transactionBlock.pure(`${ROLE_GLOBAL}`),
                        transactionBlock.pure(`${CHESS_GLOBAL}`),
                        transactionBlock.pure(username),
                    ]
                })
            }
            const response = await wallet.signAndExecuteTransactionBlock({
                transactionBlock,
                options: {
                    showObjectChanges: true,
                }
            });
            console.log("response:", response.objectChanges);
            
            if (response.objectChanges) {
                const createObjectChange = response.objectChanges.find(
                    (objectChange) => objectChange.type === "created"
                );

                if (!!createObjectChange && "objectId" in createObjectChange) {
                    setNftObjectId(createObjectChange.objectId)
                    console.log("objid", createObjectChange.objectId);
                }
            }
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

    return { nftObjectId, mint };
};

export default useMintChess;