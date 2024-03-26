import "@/styles/globals.css";
import { Chain, EthosConnectProvider } from "ethos-connect";
import type { AppProps } from "next/app";
import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  const ethosConfiguration = {
    apiKey: process.env.NEXT_PUBLIC_ETHOS_API_KEY,
    preferredWallets: ["Ethos Wallet"],
    network: "https://fullnode.mainnet.sui.io",
    chain: Chain.SUI_MAINNET,
  };
  return (
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      dappName="Sui Auto Chess"
      dappIcon={
        <Image
          src={"/favicon.ico"}
          className="rounded-full"
          width={32}
          height={32}
          alt=""
        />
      }
      connectMessage=" "
    >
      <Component {...pageProps} />
    </EthosConnectProvider>
  );
}
