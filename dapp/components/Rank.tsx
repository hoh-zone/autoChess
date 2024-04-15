import { useEffect, useState } from "react"
import useQueryFight from "./transactions/QueryFightResult"
import { ethos } from "ethos-connect"
import { Button, Tooltip } from "@chakra-ui/react"
import useLocale from "../hooks/useLocale"

export const Rank = () => {
  const { ranks, query_fight_rank } = useQueryFight()
  const { status } = ethos.useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const getLocale = useLocale()

  useEffect(() => {
    if (status !== "connected") return

    async function fetch() {
      setIsLoading(true)
      await query_fight_rank()
      setIsLoading(false)
    }
    fetch()
  }, [status, query_fight_rank])

  return (
    <Tooltip
      maxW="1200px"
      label={
        isLoading ? (
          "loading"
        ) : (
          <div>
            {ranks.map((fight, i) => (
              <p key={i}>{fight}</p>
            ))}
          </div>
        )
      }
    >
      <Button>{getLocale("Recent-Records")}</Button>
    </Tooltip>
  )
}
