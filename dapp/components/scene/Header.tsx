import { Button, Center, HStack, Spacer, Text } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { loseA, moneyA as moneyAtom, nameA, stageAtom, winA, challengeWinA, challengeLoseA, selectedItemSlot, selectedShopItemSlot, selectedSlot } from "../../store/stages"
import { Fight } from "../Fight"
import useLocale from "../../hooks/useLocale"

export const Header = () => {
  const [money] = useAtom(moneyAtom)
  const [win, _setWin] = useAtom(winA)
  const [lose, _setLose] = useAtom(loseA)
  const [challengeWin, _setChallengeWin] = useAtom(challengeWinA)
  const [challengeLose, _setChallengeLose] = useAtom(challengeLoseA)
  const [name, _setName] = useAtom(nameA)
  const [stage, setStage] = useAtom(stageAtom)
  const [_selectedItemSlot, setSelectedItemSlot] = useAtom(selectedItemSlot)
  const [_selectedSlot, setSelectedSlot] = useAtom(selectedSlot)
  const [_selectedShopslot, setSelectedShopslot] = useAtom(selectedShopItemSlot)
  const getLocale = useLocale()

  return (
    <HStack className="w-full h-[10%] bg-slate-700/50 text-white px-8 absolute z-[100]" spacing={8}>
      <Button
        onClick={async () => {
          setStage("init")

          // clear cache
          setSelectedItemSlot(null)
          setSelectedShopslot(null)
          setSelectedSlot(null)
        }}
      >
        ⬅
      </Button>
      <Text>
        {getLocale("Name")}: {name}
      </Text>
      <Text>
        {getLocale("Money")}: {money}
      </Text>
      <Text>
        {getLocale("Win")}: {win}
      </Text>
      <Text>
        {getLocale("Lose")}: {lose}/3
      </Text>
      {win >= 10 && (
        <Text>
          {getLocale("ChallengeWin")}: {challengeWin}
        </Text>
      )}
      {win >= 10 && (
        <Text>
          {getLocale("ChallengeLose")}: {challengeLose}
        </Text>
      )}
      <Spacer />
      <Fight />
    </HStack>
  )
}
