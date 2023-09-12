import { Box, Button, HStack } from "@chakra-ui/react"
import { ShopSlot } from "../control/ShopSlot"
import { useAtom } from "jotai"
import { chessId, enemyCharacter, moneyA as moneyAtom, shopCharacter, stageAtom } from "../../store/stages"
import OperateAndMatch from "../button/OperateAndMatch"
import useQueryFight from "../button/QueryFightResult"


export const Shop = () => {
    const [stage, setStage] = useAtom(stageAtom);
    const [money, setMoney] = useAtom(moneyAtom);
    const [chars, setChars] = useAtom(shopCharacter);
    const [chess_id, setChessId] = useAtom(chessId);
    const { nftObjectId, operate_submit } = OperateAndMatch();
    const {query_fight} = useQueryFight();
    const [enemyChars, setEnemyChars] = useAtom(enemyCharacter);

    return <Box flexBasis={"15%"} className="bg-indigo-200">
        <HStack className="justify-around relative top-[-20px] " gap={0}>
            <ShopSlot id={0} />
            <ShopSlot id={1} />
            <ShopSlot id={2} />
            <ShopSlot id={3} />
            <ShopSlot id={4} />

            <HStack className="relative top-[20px]">
            <   Button onClick={async () => {
                        setStage("init");;
                    }}
                >GO BACK</Button>
                <Button className=""
                    onClick={
                        () => {
                            if (money < 2) return;
                            setMoney(money-2);
                            setChars(chars.slice(5));
                        }
                    }>Refresh(-2💰)
                </Button>
                <Button className="" onClick={async () => {
                            await operate_submit();
                            console.log("start fight");
                            let json = await query_fight();
                            let enemy = json['v2_lineup']['roles'];
                            setEnemyChars(enemy);
                            console.log("播放战斗动作，战斗计算");
                            let res = json['res']
                            if (res == 1) {
                                console.log("you win");
                            } else if (res == 2) {
                                console.log("you lose")
                            } else {
                                console.log("even");
                            }
                        }}>Fight</Button>
            </HStack>
        </HStack>
    </Box>
}
