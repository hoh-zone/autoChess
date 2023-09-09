import { useCallback, useEffect, useState } from 'react'

import { ethos, TransactionBlock} from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '..';
import { CHESS_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';

type Props = {
    username:string
}
const MintChess = ({username}: Props) => {
    const { wallet } = ethos.useWallet();
    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);

    const signTransaction = useCallback(async () => {
        if (!wallet) return;
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
        if (response.objectChanges) {
            const createObjectChange = response.objectChanges.find(
                (objectChange) => objectChange.type === "created"
            );
            if (createObjectChange) {
                console.log("mint chess success");
            } else {
                console.log("mint chess failed");
            }
        }
    }, [wallet]);

    const reset = useCallback(() => {
        setSignSuccess(false);
        setSignError(false);
    }, [])

    useEffect(() => {
        reset();
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {signSuccess && (
                <SuccessMessage reset={reset}>
                    Check the developer console to see the result.
                </SuccessMessage>
            )}
            {signError && (
                <ErrorMessage reset={reset}>
                    Signing did not work. See the developer console for additional information.
                </ErrorMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={signTransaction}
            >
                Mint Chess
            </button>
        </div>
    )
}

export default MintChess;