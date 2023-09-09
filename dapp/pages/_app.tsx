import { Chain, EthosConnectProvider } from "ethos-connect";
import ExampleIcon from "../icons/ExampleIcon";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NETWORK } from "../lib/constants";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  const ethosConfiguration = {
    apiKey: process.env.NEXT_PUBLIC_ETHOS_API_KEY,
    preferredWallets: ['Ethos Wallet'],
    network: NETWORK,
    chain: Chain.SUI_TESTNET
  };

  return (
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      dappName="EthosConnect Example App"
      dappIcon={<ExampleIcon />}
      connectMessage="Your connect message goes here!"
    >
      <ChakraProvider>
        <Head>
          <title>Ethos Connect Example App</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </EthosConnectProvider>
  );
}

export default MyApp;
