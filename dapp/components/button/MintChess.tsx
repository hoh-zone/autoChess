import { useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock} from 'ethos-connect';
import { CHESS_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';

type Props = {
    username:string
}

const mint_chess = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const mint = useCallback(async ({username}: Props) => {
        if (!wallet) return;
        try {
            const transactionBlock = new TransactionBlock();
            transactionBlock.moveCall({
                target: `${PACKAGE_ID}::chess::mint_chess`,
                arguments: [
                    transactionBlock.pure(`${ROLE_GLOBAL}`),
                    transactionBlock.pure(`${CHESS_GLOBAL}`),
                    transactionBlock.pure(username),
                ]
            })

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

export default mint_chess;