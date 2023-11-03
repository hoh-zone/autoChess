import type { NextPage } from "next"
import { useEffect, useRef } from "react"
import { Stack } from "@chakra-ui/react"
import { Header } from "../components/scene/Header"
import { MainScene } from "../components/scene/MainScene"
import { Shop } from "../components/scene/Shop"
import { StartGame } from "../components/scene/StartGame"
import { useAtom } from "jotai"
import { stageAtom } from "../store/stages"
import { FightScene } from "../components/scene/FightScene"

const Home: NextPage = () => {
  const [stage, setStage] = useAtom(stageAtom)

  return (
    <>
      <div className="w-[100vw] aspect-video max-h-[100vh] bg-black relative">
        {stage === "init" && <StartGame />}
        {(stage === "shop" || stage == "fight") && <Header />}
        {stage === "fight" && <FightScene />}
        {stage === "shop" && <MainScene />}
        {stage === "shop" && <Shop />}
      </div>
    </>
  )
}

export default Home
