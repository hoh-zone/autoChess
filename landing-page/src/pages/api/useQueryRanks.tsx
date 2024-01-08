import { useCallback } from 'react'
import { CHALLENGE_GLOBAL, ISMAINNET, PACKAGE_ID, SENDER } from '../../constants';
import {
    JsonRpcProvider,
    TransactionBlock,
    testnetConnection,
    mainnetConnection,
    normalizeSuiObjectId,
} from '@mysten/sui.js';
import { config } from 'process';
import { CONFIG_FILES } from 'next/dist/shared/lib/constants';

export interface LineUp {
    walletAddr: string;
    name: string;
    rank: number,
    roles: string[],
    score: number
}

function bytesArrayToString(input: Uint8Array): String {
    const bytes: Uint8Array = new Uint8Array(input);
    const decoder: TextDecoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

function get_name(data:string):string {
  if (data == "I'm a super robot") {
    return "AI";
  }
  return data;
}

function get_addr(data:string, name:string):string {
  if (data == "be379359ac6e9d0fc0b867f147f248f1c2d9fc019a9a708adfcbe15fc3130c18" && name == "AI") {
    return "...";
  }
  if (data) {
    return '0x' + data;
  }
  return data
}

function splitRankStr(data: String): LineUp[] {
    let array = data.split(";");
    let res:LineUp[] = []
    array.forEach((item) => {
      let temp = item.split(",");
      let name = get_name(temp[1]);
      let lineUp : LineUp = {
        walletAddr: get_addr(temp[0], name),
        name: name,
        rank: parseInt(temp[2]),
        roles: [temp[3], temp[4], temp[5], temp[6], temp[7], temp[8]],
        score: parseInt(temp[9]) / 100_000_000,
      }
      if (lineUp.walletAddr) {
        res.push(lineUp);
      }
    })
    return res;
  }
function bytesToU64(bytes: Uint8Array): number {
  const dataView = new DataView(bytes.buffer);
  const intValue = dataView.getInt32(0, true);
  return intValue;
}
const useQueryRanks = () => {
  const query_total_pools_value = useCallback(async () => {
    let provider;
    if (ISMAINNET) {
      provider = new JsonRpcProvider(mainnetConnection)
    } else {
      provider = new JsonRpcProvider(testnetConnection)
    }
    const tx = new TransactionBlock();
    const moveModule = "challenge";
    const method = "get_pool_value";
    tx.moveCall({
        target: `${PACKAGE_ID}::${moveModule}::${method}`,
        arguments: [tx.object(normalizeSuiObjectId(CHALLENGE_GLOBAL))]
    });
    const result = await provider.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: SENDER
    });
    if (!result || !result.results || !result.results[0] || !result.results[0].returnValues) return "";
    let res = result.results[0].returnValues[0][0];
    return bytesToU64(new Uint8Array(res));
}, []);
    const query_rank20 = useCallback(async () => {
        let provider;
        if (ISMAINNET) {
          provider = new JsonRpcProvider(mainnetConnection)
        } else {
          provider = new JsonRpcProvider(testnetConnection)
        }
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
        console.log('resultsss:', resultStr);
        return resultArr;
    }, []);
    return { query_rank20, query_total_pools_value };
}

export default useQueryRanks;