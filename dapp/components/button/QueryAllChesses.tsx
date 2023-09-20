import { useCallback, useState } from 'react'

import { ethos } from 'ethos-connect';
import { PACKAGE_ID } from '../../lib/constants';
import { GameNft } from '../../types/nft';
import { useSyncGameNFT } from '../../hooks/useSyncGameNFT';
import { PaginatedObjectsResponse } from '@mysten/sui.js';

const useQueryChesses = () => {
    const { wallet } = ethos.useWallet();
    const [nfts, setNfts] = useState<GameNft[]>([]);
    const syncGameNFT = useSyncGameNFT();
    const record_nfts = (result: PaginatedObjectsResponse) => {
        console.log("resut:", result);
        let games = result.data.map(d => (d.data?.content as any)?.fields).filter(Boolean) as GameNft[];
        setNfts(games);
        return games;
    }

    const update_chess = useCallback(async (chess_id:string) => {
        if (!wallet) return;
        const result = await wallet.client.getObject({
            id: chess_id,
            options: {
                showContent: true,
            },
        });
        let updated_nft = (result.data?.content as any)?.fields as GameNft;
        console.log("updated nft:",updated_nft);
        syncGameNFT(updated_nft);
    }, [wallet]);

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
        return record_nfts(result);
    }, [wallet]);
    return { nfts, query_chess: update_chess, query_chesses };
}

export default useQueryChesses;