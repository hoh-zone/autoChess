import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { ErrorMessage, SuccessMessage } from '.';
import { NETWORK, FAUCET } from '../lib/constants';
import useLocale from "../hooks/useLocale"

const Fund = () => {
    const { wallet } = ethos.useWallet();

    const [funding, setFunding] = useState(false);
    const [fundingSuccess, setFundingSuccess] = useState(false);
    const [fundingError, setFundingError] = useState(false);
    const getLocale = useLocale()

    const fund = useCallback(async () => {
        if (!wallet || !NETWORK || funding) return;
    
        setFunding(true);
        setFundingError(false);
        try {
            await ethos.dripSui({ address: wallet.address, networkName: NETWORK });
            setFundingSuccess(true);
        } catch (e) {
            console.log("Error", e)
            setFundingError(true);
        }
        setFunding(false);
    }, [wallet, funding]);

    const reset = useCallback(() => {
        setFunding(false);
        setFundingSuccess(false);
        setFundingError(false);
    }, [])

    useEffect(() => {
        reset();
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {fundingError && (
                <ErrorMessage reset={reset}>
                    <>{getLocale('The-faucet-did-not-work')}</>
                </ErrorMessage>
            )}
            {fundingSuccess && (
                <SuccessMessage reset={reset}>
                    <>{getLocale('Your-new-balance-is')} {wallet?.contents?.suiBalance.toString()} {getLocale('Mist')}!</>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={fund}
            >
                {funding ? <>{getLocale('Funding')}...</> : <>{getLocale('Fund')}</>}
            </button>
        </div>
    )
}

export default Fund;