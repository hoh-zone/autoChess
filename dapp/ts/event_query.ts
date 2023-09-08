import {
    JsonRpcProvider,
    testnetConnection,
  } from '@mysten/sui.js';
  import { config } from './constants.js';
  
  export const queryValueFromContract = () => {
    const connect = async () => {
      const provider = new JsonRpcProvider(testnetConnection);
      const result = await provider.getOwnedObjects({
        owner:config.SENDER,
        filter: {
          Package:config.PACKAGE_ID,
        },
        options: {
          showContent:true,
          showDisplay:true,
          showType:true,
        },
      });
      console.log(result);
    };
    return { connect };
  };
  queryValueFromContract().connect();