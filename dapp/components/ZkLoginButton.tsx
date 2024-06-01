import { Button } from "@radix-ui/themes";
import { generateNonce, generateRandomness } from '@mysten/zklogin';
//import { jwtToAddress, getExtendedEphemeralPublicKey } from '@mysten/zklogin';
//import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { JwtPayload, jwtDecode } from "jwt-decode";
//import { jwtDecode } from "jwt-decode";

//pnpm build
//pnpm run dev
const FULLNODE_URL = 'https://fullnode.devnet.sui.io'; // replace with the RPC URL you want to use
const suiClient = new SuiClient({ url: FULLNODE_URL });
const ephemeralKeyPair = new Ed25519Keypair();

//Only for google acount Oauth
const CLIENT_ID = '15551813151-do454v0l676ic4b4stm4iuorudsie7rt.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:5173/';


const {epoch} = await suiClient.getLatestSuiSystemState();
const maxEpoch = Number(epoch) + 10; // this means the ephemeral key will be active for 2 epochs from now.
const randomness = generateRandomness();
const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
const params = new URLSearchParams({
  // Configure client ID and redirect URI with an OpenID provider
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: 'id_token',
  scope: 'openid',
  // See below for details about generation of the nonce
  nonce: nonce,
});

const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
/**
 * Problem 1 being:  how to use pass the client id, redirct uri and nounce to the google service, should 
 * be calling the service through the uri?
 * Answer: Just let user click the loginURL, after user logins in its google account, google redirect to the
 * redirect_uri passed, the id_token is attached in the redirected uri
 * const urlFragment = window.location.hash;
 * const urlParams = new URLSearchParams(urlFragment.substring(1));
 * The code above is for it.
 */

  // Get the URL fragment
  const urlFragment = window.location.hash;

  // Parse the fragment to get the id_token
  const urlParams = new URLSearchParams(urlFragment.substring(1));
  const idToken = urlParams.get('id_token');
  if(idToken != null ){
    const jwtPayload = jwtDecode(idToken) as JwtPayload;;
  
    console.log("zkLoginUserAddress iss:", jwtPayload.iss);
    console.log("zkLoginUserAddress sub:", jwtPayload.sub);
    console.log("zkLoginUserAddress aud:", jwtPayload.aud);

  }

// example, use the post
//const proofResponse = await post('/your-internal-api/zkp/get', zkpRequestPayload);

/**
 * Problem 2 being: salt
 */

/**
 * Problem 3 being: zk-proof
 */

/*

  const zkLoginUserAddress = jwtToAddress(jwt, userSalt);
  const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
    ephemeralKeyPair.getPublicKey()
  );

const zkProofResult = await axios.post(
  "https://prover-dev.mystenlabs.com/v1",
  {
    jwt: oauthParams?.id_token as string,
    extendedEphemeralPublicKey: extendedEphemeralPublicKey,
    maxEpoch: maxEpoch,
    jwtRandomness: randomness,
    salt: userSalt,
    keyClaimName: "sub",
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
).data;

const partialZkLoginSignature = zkProofResult as PartialZkLoginSignature

*/


export const ZkLoginButton = () =>{
    return (
        <>         
           <a href={loginURL}>
                     <Button color="cyan" variant="soft" radius="large" size="3">Login to Google </Button>
           </a>
        </>
  )
}

export default ZkLoginButton;
