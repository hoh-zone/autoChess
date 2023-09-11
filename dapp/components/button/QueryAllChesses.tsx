import { useCallback, useEffect, useState } from 'react'

import { ethos} from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '..';
import { PACKAGE_ID } from '../../lib/constants';

const QueryChesses = () => {
    const { wallet } = ethos.useWallet();
    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);
    const [nfts, setNfts] = useState<string[] | null>(null);
    const chesses:string[] = [];
    const query_chesses = useCallback(async () => {
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
            let nft_data =  result.data[i].data?.content;
            let json = JSON.stringify(nft_data);
            chesses.push(json);
            i++;
        }
        setNfts(chesses);
    }, [wallet]);

    const reset = useCallback(() => {
        setSignSuccess(false);
        setSignError(false);
    }, [])

    useEffect(() => {
        reset();
    }, [reset])
    return {nfts, query_chesses};
}

export default QueryChesses;