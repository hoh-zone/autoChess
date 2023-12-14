import { useCallback } from 'react'
import { CHALLENGE_GLOBAL, PACKAGE_ID, SENDER } from '../../constants';
import {
    JsonRpcProvider,
    TransactionBlock,
    testnetConnection,
    normalizeSuiObjectId,
} from '@mysten/sui.js';

export interface LineUp {
    walletAddr: string;
    name: string;
    rank: number
}

function bytesArrayToString(input: Uint8Array): String {
    const bytes: Uint8Array = new Uint8Array(input);
    const decoder: TextDecoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}
function splitRankStr(data: String): LineUp[] {
    let array = data.split(";");
    let res:LineUp[] = []
    array.forEach((item) => {
      let temp = item.split(",");
      let lineUp : LineUp = {
        walletAddr: temp[0],
        name: temp[1],
        rank: parseInt(temp[2])
      }
      res.push(lineUp);
    })
    return res;
  }

const useQueryRanks = () => {
    const query_rank20 = useCallback(async () => {
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
        let source = result.results[0].returnValues[0][0];
        source = source.slice(2);
        let resultStr = bytesArrayToString(new Uint8Array(source));
        let resultArr = splitRankStr(resultStr);
        console.log('result:', resultArr);
        return resultArr;
    }, []);
    return { query_rank20 };
}

export default useQueryRanks;