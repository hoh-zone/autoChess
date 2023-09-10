import { useCallback, useEffect, useState } from 'react'

import { ethos} from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '..';
import { PACKAGE_ID } from '../../lib/constants';

const OperateChess = () => {
    const { wallet } = ethos.useWallet();
    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);
    const signTransaction = useCallback(async () => {
        if (!wallet) return;
        const result = await wallet.client.getOwnedObjects({
            owner: wallet.address,
            options: {
                showContent:true,
            },
            filter: {
                MoveModule: {
                    package: `${PACKAGE_ID}`,
                    module: "chess",
                }
            }
        });
        let len =  result.data.length;
        let i = 0;
        while (i < len) {
            let nft_data =  result.data[0].data?.content;
            console.log("nft:", nft_data);
            i++;
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
                Query my chesses
            </button>
        </div>
    )
}

export default OperateChess;