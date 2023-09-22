import {
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
  TransactionBlock,
  testnetConnection,
  fromB64,
  PRIVATE_KEY_SIZE,
  normalizeSuiObjectId,
} from '@mysten/sui.js';
import { config } from './constants.js';


const sigin = (param: { sBase64?: string; provider: JsonRpcProvider }) => {
  const { sBase64, provider } = param;
  const raw = fromB64(
    sBase64 || 'AIH+KaXFiMO4rvInzYrVmejyjWxEU/2gMC1tdJZWWwTE='
  );
  if (raw[0] !== 0 || raw.length !== PRIVATE_KEY_SIZE + 1) {
    throw new Error('invalid key');
  }
  const keypair = Ed25519Keypair.fromSecretKey(raw.slice(1));

  const signer = new RawSigner(keypair, provider);
  return signer;
};

export const mint_chess = () => {
  let module = 'chess';
  let fn = 'withdraw';
  const connect = async () => {
    const provider = new JsonRpcProvider(testnetConnection);
    const signer = sigin({ provider });
    const tx = new TransactionBlock();
    let res = tx.moveCall({
      target: `${config.PACKAGE_ID}::${module}::${fn}`,
      arguments: [tx.pure(1), tx.object(normalizeSuiObjectId(config.CHESS_GLOBAL))],
    });
    const result = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showInput: true,
        showEvents: true,
        showBalanceChanges: true
      },
    });
    console.log('res', result);
    console.log('cache res', res);
  };
  return { connect };
};
mint_chess().connect();