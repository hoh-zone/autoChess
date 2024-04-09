import { useCallback } from "react";
import {
  CHALLENGE_GLOBAL,
  ISMAINNET,
  SENDER,
  CHESS_CHALLENGE_PACKAGE_ID,
  CHESS_CHALLENGE_PACKAGE_ID1,
  CHESS_CHALLENGE_PACKAGE_ID2,
  CHESS_CHALLENGE_PACKAGE_ID3,
  CHESS_CHALLENGE_PACKAGE_ID4,
  CHESS_CHALLENGE_PACKAGE_ID5,
  CHESS_CHALLENGE_PACKAGE_ID6,
  CHESS_CHALLENGE_PACKAGE_ID7,
} from "../../constants";
import {
  JsonRpcProvider,
  TransactionBlock,
  testnetConnection,
  mainnetConnection,
  normalizeSuiObjectId,
} from "@mysten/sui.js";
import { config } from "process";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";
import { it } from "node:test";
import { Toast } from "@chakra-ui/react";

export interface LineUp {
  walletAddr: string;
  name: string;
  rank: number;
  roles: string[];
  score: number;
  estimateSui: number;
}

function bytesArrayToString(input: Uint8Array): String {
  const bytes: Uint8Array = new Uint8Array(input);
  const decoder: TextDecoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

function get_name(data: string): string {
  if (data == "I'm a super robot") {
    return "AI";
  }
  return data;
}

function get_addr(data: string, name: string): string {
  if (data == SENDER.replace("0x", "") && name == "AI") {
    return "...";
  }
  if (data) {
    return "0x" + data;
  }
  return data;
}

function splitRankStr(data: String): LineUp[] {
  let array = data.split(";");
  let res: LineUp[] = [];
  array.forEach((item) => {
    if (item === "") {
      return;
    }
    let temp = item.split(",");
    let name = get_name(temp[1]);
    let lineUp: LineUp = {
      walletAddr: get_addr(temp[0], name),
      name: name,
      rank: parseInt(temp[2]),
      roles: [temp[3], temp[4], temp[5], temp[6], temp[7], temp[8]],
      score: parseInt(temp[9]),
      estimateSui: 0,
    };
    if (lineUp.walletAddr) {
      res.push(lineUp);
    }
  });
  return res;
}

function bytesToU64(bytes: Uint8Array): number {
  const dataView = new DataView(bytes.buffer);
  const intValue = dataView.getInt32(0, true);
  return intValue;
}
const useQueryRanks = () => {
  const query_left_challenge_time = useCallback(async () => {
    let provider;
    if (ISMAINNET) {
      provider = new JsonRpcProvider(mainnetConnection);
    } else {
      provider = new JsonRpcProvider(testnetConnection);
    }
    const tx = new TransactionBlock();
    const moveModule = "challenge";
    const method = "query_left_challenge_time";
    tx.moveCall({
      target: `${CHESS_CHALLENGE_PACKAGE_ID}::${moveModule}::${method}`,
      arguments: [
        tx.object(normalizeSuiObjectId(CHALLENGE_GLOBAL)),
        tx.pure(normalizeSuiObjectId("0x06")),
      ],
    });
    const result = await provider.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: SENDER,
    });
    if (
      !result ||
      !result.results ||
      !result.results[0] ||
      !result.results[0].returnValues
    )
      return "";
    let res = result.results[0].returnValues[0][0];
    return bytesToU64(new Uint8Array(res));
  }, []);

  const query_rank20_reward = useCallback(async () => {
    let provider;
    if (ISMAINNET) {
      provider = new JsonRpcProvider(mainnetConnection);
    } else {
      provider = new JsonRpcProvider(testnetConnection);
    }
    const tx = new TransactionBlock();
    const moveModule = "challenge";
    const method = "get_estimate_reward_20_amounts";
    tx.moveCall({
      target: `${CHESS_CHALLENGE_PACKAGE_ID}::${moveModule}::${method}`,
      arguments: [tx.object(normalizeSuiObjectId(CHALLENGE_GLOBAL))],
    });
    const result = await provider.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: SENDER,
    });
    if (
      !result ||
      !result.results ||
      !result.results[0] ||
      !result.results[0].returnValues
    ) {
      return "";
    }
    let source = result.results[0].returnValues[0][0];
    let resultStr = bytesArrayToString(new Uint8Array(source));
    return resultStr;
  }, []);

  const query_rank20 = useCallback(async () => {
    let provider;
    if (ISMAINNET) {
      provider = new JsonRpcProvider(mainnetConnection);
    } else {
      provider = new JsonRpcProvider(testnetConnection);
    }
    const tx = new TransactionBlock();
    const moveModule = "challenge";
    const method = "generate_rank_20_description";
    tx.moveCall({
      target: `${CHESS_CHALLENGE_PACKAGE_ID}::${moveModule}::${method}`,
      arguments: [tx.object(normalizeSuiObjectId(CHALLENGE_GLOBAL))],
    });
    const result = await provider.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: SENDER,
    });
    if (
      !result ||
      !result.results ||
      !result.results[0] ||
      !result.results[0].returnValues
    ) {
      return "";
    }
    let source = result.results[0].returnValues[0][0];
    source = source.slice(2);
    let resultStr = bytesArrayToString(new Uint8Array(source));
    let resultArr = splitRankStr(resultStr);

    return resultArr;
  }, []);

  const filterMyChess = (data: any[], lineup: any[]) => {
    let res = "";
    data.map((item) => {
      if (res !== "") {
        return;
      }
      let info = item.data.content.fields;
      let arena = info.arena;
      let challenge_win = info.challenge_win;
      if (!arena || challenge_win == 0) {
        return;
      }
      let roles = info.lineup.fields.roles;
      let isEqual = true;
      roles.map((role: any, index: number) => {
        if (role.fields.class + "_" + role.fields.level !== lineup[index]) {
          isEqual = false;
        }
      });
      if (isEqual) {
        res = item.data.objectId;
      }
      return;
    });
    return res;
  };

  const claim_reward = useCallback(
    async (wallet: any, rank: any, lineup: any, toast: any) => {
      if (!wallet) {
        toast({
          title: "Please login, my lord~",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      let provider;
      if (ISMAINNET) {
        provider = new JsonRpcProvider(mainnetConnection);
      } else {
        provider = new JsonRpcProvider(testnetConnection);
      }
      const result = await provider.getOwnedObjects({
        owner: wallet.address,
        filter: {
          MatchAny: [
            {
              Package: CHESS_CHALLENGE_PACKAGE_ID1,
            },
            { Package: CHESS_CHALLENGE_PACKAGE_ID2 },
            {
              Package: CHESS_CHALLENGE_PACKAGE_ID3,
            },
            { Package: CHESS_CHALLENGE_PACKAGE_ID4 },
            {
              Package: CHESS_CHALLENGE_PACKAGE_ID5,
            },
            { Package: CHESS_CHALLENGE_PACKAGE_ID6 },
            {
              Package: CHESS_CHALLENGE_PACKAGE_ID7,
            },
          ],
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        },
      });
      let chessId = filterMyChess(result.data, lineup);
      if (chessId === "") {
        toast({
          title: "My lord, You don't have any chess in rank",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const tx = new TransactionBlock();
      const moveModule = "chess";
      const method = "claim_rank_reward";
      tx.moveCall({
        target: `${CHESS_CHALLENGE_PACKAGE_ID7}::${moveModule}::${method}`,
        arguments: [
          tx.object(normalizeSuiObjectId(CHALLENGE_GLOBAL)),
          tx.object(normalizeSuiObjectId(chessId)),
          tx.object(normalizeSuiObjectId("0x06")),
          tx.pure(Number(rank) - 1),
        ],
      });
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true,
        },
      });
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find(
          (objectChange: any) => objectChange.type === "created"
        );
        if (!!createObjectChange && "objectId" in createObjectChange) {
        }
      }
    },
    []
  );

  return {
    query_rank20,
    query_rank20_reward,
    query_left_challenge_time,
    claim_reward,
  };
};

export default useQueryRanks;
