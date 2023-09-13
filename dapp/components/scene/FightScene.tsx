import { Box, Button, Center, HStack, Img, Stack } from "@chakra-ui/react"
import { Slot } from "../control/Slot"
import { StatusBar } from "../control/StatusBar"
import { SellButton } from "../control/SellButton"

export const FightScene = () => {
    return <div className="h-full w-full relative">
        <video style={{ objectFit: "cover" }} className="w-full h-full" autoPlay loop muted>
            <source src="bg6.mp4" type="video/mp4" />
        </video>
        <HStack className="absolute top-0 p-8 w-full justify-around">
            <StatusBar isOpponent={false}></StatusBar>
            <StatusBar isOpponent={true}></StatusBar>
        </HStack>
        <HStack className="absolute w-full h-[200px] bottom-0">
            <div className="w-1/2 h-full relative" >
                <div className="absolute right-0 top-0">
                    <Slot showInfo={false} id={0} />
                </div>
                <div className="absolute right-[10%] bottom-[10%]">
                    <Slot showInfo={false} id={1} />
                </div>
                <div className="absolute right-[15%] top-[10%]">
                    <Slot showInfo={false} id={2} />
                </div>
                <div className="absolute right-[25%] bottom-[25%]">
                    <Slot showInfo={false} id={3} />
                </div>
                <div className="absolute right-[35%] top-[10%]">
                    <Slot showInfo={false} id={4} />
                </div>
                <div className="absolute right-[45%] bottom-[20%]">
                    <Slot showInfo={false} id={5} />
                </div>
                <div className="absolute right-[55%] bottom-[30%]">
                    <Slot showInfo={false} id={6} />
                </div>
            </div>

            <div className="w-1/2 h-full relative" >
                <div className="absolute left-0 top-0">
                    <Slot showInfo={false} id={10} isOpponent={true} />
                </div>
                <div className="absolute left-[10%] bottom-[10%]">
                    <Slot showInfo={false} id={11} isOpponent={true} />
                </div>
                <div className="absolute left-[15%] top-[10%]">
                    <Slot showInfo={false} id={12} isOpponent={true} />
                </div>
                <div className="absolute left-[25%] bottom-[25%]">
                    <Slot showInfo={false} id={13} isOpponent={true} />
                </div>
                <div className="absolute left-[35%] top-[10%]">
                    <Slot showInfo={false} id={14} isOpponent={true} />
                </div>
                <div className="absolute left-[45%] bottom-[20%]">
                    <Slot showInfo={false} id={15} isOpponent={true} />
                </div>
                <div className="absolute left-[55%] bottom-[30%]">
                    <Slot showInfo={false} id={16} isOpponent={true} />
                </div>
            </div>

        </HStack>
    </div>
}
