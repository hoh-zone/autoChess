import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Progress, Img, useToast } from "@chakra-ui/react"
import { assetsAtom } from "../store/stages"
import { useAtom } from "jotai"
import { Character } from "./character/character"
import useQueryMetaInfo from "./button/QueryMetaInfo"
import useLocale from "../hooks/useLocale"

const ContinueGame = (props: { metaInfo: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [assets, setAssets] = useAtom(assetsAtom)
  const { claim_invite_exp } = useQueryMetaInfo()
  const toast = useToast()
  const getLocale = useLocale()

  let exp_max_array = [20, 40, 80, 100, 200]
  let exp_prop: string = 100 * (props.metaInfo.exp / exp_max_array[props.metaInfo.level]) + "%"
  const getInviteLink = async (metaId: string) => {
    try {
      await navigator.clipboard.writeText(metaId)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
    toast({
      title: getLocale('Your-account-Id-is-copied'),
      status: "success",
      duration: 5000,
      isClosable: true
    })
  }

  const unlockSkill = () => {
    toast({
      title: getLocale('This-feature-is-released-soon'),
      status: "warning",
      duration: 5000,
      isClosable: true
    })
  }

  const claim_invite_reward = (inviteNum: number) => {
    console.log("num:", props.metaInfo.invited_claimed_num)
    if (inviteNum == 0) {
      toast({
        title: getLocale('You-have-to-invite'),
        status: "warning",
        duration: 5000,
        isClosable: true
      })
      return
    }
    if (inviteNum == props.metaInfo.invited_claimed_num) {
      toast({
        title: getLocale('You-have-claimed')! + inviteNum + getLocale('players')!,
        status: "warning",
        duration: 5000,
        isClosable: true
      })
      return
    }
    claim_invite_exp(props.metaInfo)
  }

  return (
    <>
      <Button onClick={onOpen}>{getLocale('My-Account-Info')}</Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxWidth={500} className="rounded-[8px] border-4 border-solid overflow-hidden" bg={"#22314D"} style={{ borderColor: "#050F16" }}>
          <ModalBody className="relative !p-[0px]" maxWidth={500}>
            <div>
              <div style={{ height: "82px" }}>
                <Img className="absolute top-0 left-0" src={assets?.account_title_icon} style={{ width: "100%" }} />
                <div className="absolute left-0 top-0 text-center" style={{ width: "100%", lineHeight: "82px" }}>
                  {getLocale('Account-Id')}: {props.metaInfo.metaId}
                </div>
              </div>
              <div className="flex justify-between !p-[20px]">
                <div>
                  <div>
                    <div className="flex items-center">
                      <div className="inline-block mr-2" style={{ width: "5px", height: "5px", backgroundColor: "#85B8C7" }}></div>
                      <div className="accountInfoInput" style={{ backgroundColor: "#6F91B1" }}>
                        <span>{getLocale('Name')}: {props.metaInfo.name} </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 mb-2">
                      <div className="inline-block mr-2" style={{ width: "5px", height: "5px", backgroundColor: "#85B8C7" }}></div>
                      <div className="accountInfoInput" style={{ backgroundColor: "#6F91B1" }}>
                        <span>{getLocale('Level')}: {props.metaInfo.level} </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="inline-block mr-2" style={{ width: "5px", height: "5px", backgroundColor: "#85B8C7" }}></div>
                      <div className="accountInfoInput" style={{ backgroundColor: "#85B8C7" }}>
                        <div className="accountInfoInputExp" style={{ width: `${exp_prop}` }}></div>
                        <span className="relative">{getLocale('Exp')} {props.metaInfo.exp} </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <div className="inline-block mr-2" style={{ width: "5px", height: "5px", backgroundColor: "#85B8C7" }}></div>
                      <div className="accountInfoInput" style={{ backgroundColor: "#6F91B1" }}>
                        <span>{getLocale('Arena-Win')}: {props.metaInfo.total_arena_win} </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 mb-2">
                      <div className="inline-block mr-2" style={{ width: "5px", height: "5px", backgroundColor: "#85B8C7" }}></div>
                      <div className="accountInfoInput" style={{ backgroundColor: "#6F91B1" }}>
                        <span>{getLocale('Arena-Lose')}: {props.metaInfo.total_arena_lose} </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-white mt-20 mb-4 text-xs">{getLocale('InviteNum')}: {props.metaInfo.invited_num}</div>
                  <Button
                    onClick={() => {
                      getInviteLink(props.metaInfo.metaId)
                    }}
                  >
                    {getLocale('INVITE')}
                  </Button>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      claim_invite_reward(props.metaInfo.invited_num)
                    }}
                  >
                    {getLocale('CLAIM-REWARDS')}
                  </Button>
                </div>
                <div>
                  <div className="overflow-hidden">
                    <div style={{ width: "300px", marginLeft: "20px", transform: "scale(2)" }}>
                      <Character charType={props.metaInfo.avatar_name ? String(props.metaInfo.avatar_name).replace("avatar_", "") : "fighter"} isOpponent={false}></Character>
                    </div>
                  </div>
                  <div className="text-white text-xs">{getLocale('Skills-Unlock')}: 0</div>
                  <Button
                    className="mt-3"
                    onClick={() => {
                      unlockSkill()
                    }}
                  >
                    {getLocale('Unlock')}
                  </Button>
                  {/* <div className="relative flex w-200 flex-wrap ml-10 mt-10 text-white">
                    <div className="accountCharacterText">Lv 1</div>
                    <div className="accountCharacterText">Lv 2</div>
                    <div className="accountCharacterText">Lv 3</div>
                    <div className="accountCharacterText">Lv 4</div>
                    <div className="accountCharacterText">Lv 5</div>
                  </div> */}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContinueGame
