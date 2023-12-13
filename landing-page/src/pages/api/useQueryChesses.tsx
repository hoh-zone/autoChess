import { useCallback } from 'react'
import { CHALLENGE_GLOBAL, PACKAGE_ID, SENDER } from '../../constants';
import {
    JsonRpcProvider,
    TransactionBlock,
    testnetConnection,
    normalizeSuiObjectId,
} from '@mysten/sui.js';

function bytesArrayToString(input: Uint8Array): String {
    const bytes: Uint8Array = new Uint8Array(input);
    const decoder: TextDecoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

const useQueryChesses = () => {
    const query_chesses = useCallback(async () => {
        const provider = new JsonRpcProvider(testnetConnection);
        const tx = new TransactionBlock();
        const moveModule = "challenge";
        const method = "query_rank_20";
        tx.moveCall({
            target: `${PACKAGE_ID}::${moveModule}::${method}`,
            arguments: [tx.object(normalizeSuiObjectId(CHALLENGE_GLOBAL))]
        });
        const result = await provider.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: SENDER
        });
        if (!result || !result.results || !result.results[0] || !result.results[0].returnValues) return "";
        let ranks = result.results[0].returnValues[0][0];
        ranks = ranks.slice(2);
        console.log('result:', bytesArrayToString(new Uint8Array(ranks)));
    }, []);
    return { query_chesses };
}

export default useQueryChesses;