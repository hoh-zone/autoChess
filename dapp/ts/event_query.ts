import {
    JsonRpcProvider,
    testnetConnection,
  } from '@mysten/sui.js';
import { PACKAGE_ID, SENDER } from '../lib/constants.js';
  
  export const queryValueFromContract = () => {
    const connect = async () => {
      const provider = new JsonRpcProvider(testnetConnection);
      const result = await provider.queryEvents(
        {
          query: {
            MoveEventType: PACKAGE_ID + '::chess::FightEvent',
          }
        }
      );
      console.log(result);
    };
    return { connect };
  };
  queryValueFromContract().connect();