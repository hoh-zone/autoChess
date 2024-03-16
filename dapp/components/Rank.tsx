import { useEffect, useState } from "react"
import useQueryFight from "./button/QueryFightResult"
import { ethos } from "ethos-connect"
import { Button, Tooltip } from "@chakra-ui/react"

export const Rank = () => {
  const { ranks, query_fight_rank } = useQueryFight()
  const { status } = ethos.useWallet()
  const [isLoading, setIsLoading] = useState(false)

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
      label={
        isLoading ? (
          "loading"
        ) : (
          <div>
            <p></p>
            {ranks.map((fight, i) => (
              <p key={i}>
                {i + 1}:{fight}
              </p>
            ))}
          </div>
        )
      }
    >
      <Button>Rank</Button>
    </Tooltip>
  )
}
