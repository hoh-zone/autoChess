import type { NextPage } from "next";
import { SignInButton, ethos } from "ethos-connect";
import { Disconnect, Fund, Mint } from "../components";
import { Stack } from "@chakra-ui/react";
import { Header } from "../components/scene/Header";
import { MainScene } from "../components/scene/MainScene";
import { Shop } from "../components/scene/Shop";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import { StartGame } from "../components/scene/StartGame";
import { useAtom } from "jotai";
import { stageAtom } from "../store/stages";
import { FightScene } from "../components/scene/FightScene";

const Home: NextPage = () => {
  const { status, wallet } = ethos.useWallet();
  const [stage, setStage] = useAtom(stageAtom);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current === null) return;
    var myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    });

    // two side, celebrate
    // const frame = () => {
    //   myConfetti({
    //     particleCount: 2,
    //     angle: 60,
    //     spread: 55,
    //     origin: { x: 0 },
    //     colors: ['#bb0000', '#ffffff']
    //   });
    //   myConfetti({
    //     particleCount: 2,
    //     angle: 120,
    //     spread: 55,
    //     origin: { x: 1 },
    //     colors: ['#bb0000', '#ffffff']
    //   });
    //   requestAnimationFrame(frame);
    // };

    var skew = 1;
    skew = Math.max(0.8, skew - 0.001);

    const frame = () => {
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 100,
        origin: {
          x: Math.random(),
          // since particles fall down, skew start toward the top
          y: (Math.random() * skew) - 0.2
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4)
      });
      requestAnimationFrame(frame);
    };

    // frame();
  }, [canvasRef]);
  return (
    <>
      <canvas ref={canvasRef} className="absolute h-[100vh] w-[100vw] z-50 pointer-events-none" />
      <Stack className="w-[100vw] aspect-video max-h-[100vh] bg-slate-600" gap={0}>
        {stage === "init" && <StartGame />}
        {(stage === "shop" || stage == "fight") && <Header />}
        {stage === "fight" && <FightScene />}
        {stage === "shop" && <MainScene />}
        {stage === "shop" && <Shop />}
      </Stack>
    </>
  );
};

export default Home;

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}