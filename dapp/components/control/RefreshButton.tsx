import { Button, useToast } from "@chakra-ui/react"
import { useAtom } from "jotai"
import { moneyA as moneyAtom, operationsA, shopCharacter, itemsA } from "../../store/stages"
import useLocale from "../../hooks/useLocale"

export const RefreshButton = () => {
  const [money, setMoney] = useAtom(moneyAtom)
  const [chars, setChars] = useAtom(shopCharacter)
  const [items, setItems] = useAtom(itemsA)
  const [operations, setOperations] = useAtom(operationsA)
  const toast = useToast()
  const getLocale = useLocale()

  function refresh_failed_toast() {
    toast({
      title: getLocale("Money-is-not-enough"),
      status: "warning",
      duration: 2000,
      isClosable: true
    })
  }
  return (
    <Button
      colorScheme="blue"
      onClick={() => {
        if (money < 2) {
          refresh_failed_toast()
          return
        }
        setMoney(money - 2)
        setChars(chars.slice(5))
        setItems(items.slice(3))
        operations.push("refresh")
      }}
    >
      {getLocale("Refresh")}(-2💰)
    </Button>
  )
}
