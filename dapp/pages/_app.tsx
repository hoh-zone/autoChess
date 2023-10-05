import { Chain, EthosConnectProvider } from "ethos-connect";
import ExampleIcon from "../icons/ExampleIcon";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NETWORK } from "../lib/constants";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { stageAtom } from "../store/stages";

function MyApp({ Component, pageProps }: AppProps) {
  const ethosConfiguration = {
    apiKey: process.env.NEXT_PUBLIC_ETHOS_API_KEY,
    preferredWallets: ['Ethos Wallet'],
    network: NETWORK,
    chain: Chain.SUI_TESTNET
  };
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFightRef = useRef<HTMLAudioElement>(null);
  const [stage, setStage] = useAtom(stageAtom);

  useEffect(() => {
    if (stage === "fight") {
      audioFightRef.current?.play();
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    }
    else {
      audioRef.current?.play();
      audioFightRef.current?.pause();
      if (audioFightRef.current) {
        audioFightRef.current.currentTime = 0
      }
    }

    const callback = () => {
      if (stage === "fight") {
        audioFightRef.current?.play();
        audioRef.current?.pause();
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      }
      else {
        audioRef.current?.play();
        audioFightRef.current?.pause();
        if (audioFightRef.current) {
          audioFightRef.current.currentTime = 0
        }
      }
    }
    window.addEventListener("keydown", callback);
    window.addEventListener("mousedown", callback);
    
    return () => {
      window.removeEventListener("keydown", callback)
      window.removeEventListener("mousedown", callback)
    }
  }, [audioRef.current, stage]);

  return (
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      dappName="EthosConnect Example App"
      dappIcon={<ExampleIcon />}
      connectMessage="Your connect message goes here!"
    >
      <ChakraProvider>
        <Head>
          <title>Sui Auto Chess</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        </Head>
        <Component {...pageProps} />
        <audio ref={audioRef} autoPlay>
          <source src="./shop.mp3" type="audio/ogg" />
        </audio>
        <audio ref={audioFightRef} autoPlay>
          <source src="./fight.mp3" type="audio/ogg" />
        </audio>
      </ChakraProvider>
    </EthosConnectProvider>
  );
}

export default MyApp;
