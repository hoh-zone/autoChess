import type { NextPage } from "next";
import { SignInButton, ethos } from "ethos-connect";
import { Disconnect, Fund, Mint, WalletActions } from "../components";
import MintChess from "../components/button/MintChess";
import OperateAndMatch from "../components/button/OperateAndMatch";
import QueryAllChesses from "../components/button/QueryAllChesses";
import { Stack } from "@chakra-ui/react";
import { Header } from "../components/scene/Header";
import { MainScene } from "../components/scene/MainScene";
import { Shop } from "../components/scene/Shop";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

const Home: NextPage = () => {
  const { status, wallet } = ethos.useWallet();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if(canvasRef.current === null) return;
    var myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    });
    myConfetti({
      particleCount: 100,
      spread: 160
      // any other options from the global
      // confetti function
    });
  }, [canvasRef]);
  return (
    <>
      <canvas ref={canvasRef} className="absolute h-[100vh] w-[100vw] z-50 pointer-events-none" />
      <Stack className="h-[100vh] w-[100vw] bg-slate-600" gap={0}>
        <Header />
        <MainScene />
        <Shop />
      </Stack>

      <div className="flex justify-between items-start">

        <div className="p-12 flex-1">Status: {status}</div>
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex-6">
          {!wallet ? (
            <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Connect
            </SignInButton>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Connected to wallet
                </h2>
                <code>{wallet.address}</code>
                <div className="place-content-center text-base font-medium text-ethos-primary space-x-1">
                  <div>
                    Wallet balance: <code>{wallet.contents?.suiBalance.toString()}</code>{" "}
                    Mist
                  </div>
                  <div className="text-xs text-gray-500">
                    (1 sui is 10^9 Mist)
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                Register Name:
                <input type="text" defaultValue="sean"/>
                <MintChess username="sean"/>
                Query My Chess Nft:
                <QueryAllChesses />
                My Operations:
                <input type="text" defaultValue="['buy1-2', 'd1', 'sell2', 'buy2-1', 'buy3-5', 'swap1-2']"/>
                <OperateAndMatch username="sean"/>
                <Fund />
                then
                <Mint />
                or
                <WalletActions />
                or
                <Disconnect />
              </div>
            </div>
          )}
        </div>

        <div className="p-12 flex-1 flex justify-end">
          <ethos.components.AddressWidget
          // excludeButtons={[
          //   ethos.enums.AddressWidgetButtons.WalletExplorer
          // ]} 
          />
        </div>
      </div>
    </>

  );
};

export default Home;

