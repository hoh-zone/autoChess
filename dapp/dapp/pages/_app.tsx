import { Chain, EthosConnectProvider } from "ethos-connect"
import type { AppProps } from "next/app"
import Head from "next/head"
import { ChakraProvider } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { appWithTranslation } from "next-i18next"
import { useAtom } from "jotai"
import { stageAtom } from "../store/stages"
import "../styles/globals.css"
import Image from "next/image"

import enUs from "../public/locales/EN/common.json"
export const AppContext = React.createContext<any>({})

function MyApp({ Component, pageProps }: AppProps) {
  const ethosConfiguration = {
    apiKey: process.env.NEXT_PUBLIC_ETHOS_API_KEY,
    preferredWallets: ["Ethos Wallet"],
    network: "https://fullnode.mainnet.sui.io",
    chain: Chain.SUI_MAINNET
  }
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioFightRef = useRef<HTMLAudioElement>(null)
  const [stage, setStage] = useAtom(stageAtom)
  const [locale, setLocal] = useState(enUs)
  const [lang, setLang] = useState("EN")

  useEffect(() => {
    if (stage === "fight") {
      audioFightRef.current?.play()
      audioRef.current?.pause()
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else {
      audioRef.current?.play()
      audioFightRef.current?.pause()
      if (audioFightRef.current) {
        audioFightRef.current.currentTime = 0
      }
    }

    const callback = () => {
      if (stage === "fight") {
        audioFightRef.current?.play()
        audioRef.current?.pause()
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      } else {
        audioRef.current?.play()
        audioFightRef.current?.pause()
        if (audioFightRef.current) {
          audioFightRef.current.currentTime = 0
        }
      }
    }
    window.addEventListener("keydown", callback)
    window.addEventListener("mousedown", callback)

    return () => {
      window.removeEventListener("keydown", callback)
      window.removeEventListener("mousedown", callback)
    }
  }, [audioRef.current, stage])
  return (
    <AppContext.Provider value={{ locale, setLocal, lang, setLang }}>
      <EthosConnectProvider
        ethosConfiguration={ethosConfiguration}
        dappName="Sui Auto Chess"
        dappIcon={<Image src={"/favicon.ico"} className="rounded-full" width={32} height={32} alt="" />}
        connectMessage=" "
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
    </AppContext.Provider>
  )
}

export default appWithTranslation(MyApp)
