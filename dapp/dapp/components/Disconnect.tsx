import { useCallback } from 'react'
import { ethos } from 'ethos-connect'
import { PrimaryButton } from '.';
import useLocale from "../hooks/useLocale"

const Disconnect = () => {
    const { wallet } = ethos.useWallet();
    const getLocale = useLocale()

    const disconnect = useCallback(() => {
        if (!wallet) return;
        wallet.disconnect();
    }, [wallet])

    return (
        <PrimaryButton
            onClick={disconnect}
        >
            {getLocale('Sign-Out')}
        </PrimaryButton>
    )
}

export default Disconnect;