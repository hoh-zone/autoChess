import { useCallback, useEffect, useState } from 'react'

import { ethos, TransactionBlock} from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '..';
import { CHESS_GLOBAL, LINEUP_GLOBAL, PACKAGE_ID, ROLE_GLOBAL } from '../../lib/constants';

type Props = {
    username:string
}

const OperateAndMatch = ({username}: Props) => {
    
    const { wallet } = ethos.useWallet();
    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);

    const signTransaction = useCallback(async () => {
        if (!wallet) return;
        const left_gold = 3;
        const chess_id = "0x7c553fc28e0f2c1650a0b21003553b6c8011784e01e561ebef14d7432f9f1140";
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${PACKAGE_ID}::chess::operate_and_match`,
            arguments: [
                tx.pure(`${CHESS_GLOBAL}`),
                tx.pure(`${ROLE_GLOBAL}`),
                tx.pure(`${LINEUP_GLOBAL}`),
                tx.pure(left_gold),
                tx.pure(["warrior1", "warrior2", "warrior3"]),
                tx.pure(chess_id),
            ]
        })

        const response = await wallet.signAndExecuteTransactionBlock({ 
            transactionBlock: tx, 
            options: { 
                showObjectChanges: true,
            }
          });
        console.log("res:", response);
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
                submit chess operations
            </button>
        </div>
    )
}

export default OperateAndMatch;