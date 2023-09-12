import { useCallback, useState } from 'react'

import { ethos } from 'ethos-connect';
import { PACKAGE_ID } from '../../lib/constants';
import { GameNft } from '../../types/nft';

const useQueryChesses = () => {
    const { wallet } = ethos.useWallet();
    const [nfts, setNfts] = useState<GameNft[]>([]);


    const query_chesses = useCallback(async () => {
        if (!wallet) return;

        const result = await wallet.client.getOwnedObjects({
            owner: wallet.address,
            options: {
                showContent: true,
            },
            filter: {
                MoveModule: {
                    package: `${PACKAGE_ID}`,
                    module: "chess",
                }
            }
        });
        setNfts(
            result.data.map(d => (d.data?.content as any)?.fields).filter(Boolean) as GameNft[]
        );
    }, [wallet]);
    return { nfts, query_chesses };
}

export default useQueryChesses;