import { Button } from "@chakra-ui/react"
import { generateNonce, generateRandomness } from '@mysten/zklogin';
//import { jwtToAddress, getExtendedEphemeralPublicKey } from '@mysten/zklogin';
//import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

//import { JwtPayload, jwtDecode } from "jwt-decode";



const FULLNODE_URL = 'https://fullnode.devnet.sui.io'; // replace with the RPC URL you want to use
const suiClient = new SuiClient({ url: FULLNODE_URL });
const {epoch} = await suiClient.getLatestSuiSystemState();

const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
const ephemeralKeyPair = new Ed25519Keypair();
const randomness = generateRandomness();
const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
//Only for google acount Oauth
const CLIENT_ID = '218247839757-v0qa1odrjfriku6mk8vac242gdgvojag.apps.googleusercontent.com';
const REDIRECT_URI = '<YOUR_SITE_URL>';

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

// example, use the post
//const proofResponse = await post('/your-internal-api/zkp/get', zkpRequestPayload);

/**
 * Problem 1 being:  how to use pass the client id, redirct uri and nounce to the google service, should 
 * be calling the service through the uri?
 */

/**
 * Problem 2 being: salt
 */

/**
 * Problem 3 being: zk-proof
 */

/*

const jwtPayload = jwtDecode(id_token);
const decodedJwt = jwt_decode(jwtPayload) as JwtPayload;
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
          <Button color="cyan" variant="soft" size="3">
                    Miao miao zk-login
          </Button>

        </>
  )
}

export default ZkLoginButton;
