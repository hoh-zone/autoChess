import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Input, Img } from "@chakra-ui/react"
import { assetsAtom } from "../store/stages"
import { useState } from "react"
import { useAtom } from "jotai"
import { getSimplifidyWalletAddr } from "../utils/TextUtils"
import useQueryMetaInfo from "./button/QueryMetaInfo"
import { useToast } from "@chakra-ui/react"
import { ethos } from "ethos-connect"

const ContinueGame = (props: { isLoading: boolean; address: any }) => {
  const { wallet } = ethos.useWallet()
  const [inputName, setInputName] = useState("")
  const [ava, setAva] = useState("avatar_ani")
  const [avaIndex, setAvaIndex] = useState(0)
  const [inputWallet, setInputWallet] = useState("")
  const [inputInvite, setInputInvite] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [assets, setAssets] = useAtom(assetsAtom)
  const { register_meta } = useQueryMetaInfo()
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  let avatarArr: any[] = []
  if (assets) {
    avatarArr = Object.keys(assets).filter((item) => {
      return item.indexOf("avatar_") > -1
    })
  }

  const preAvatar = () => {
    if (avaIndex > 0) {
      setAvaIndex(avaIndex - 1)
      setAva(avatarArr[avaIndex - 1])
    } else {
      setAvaIndex(avatarArr.length - 1)
      setAva(avatarArr[avatarArr.length - 1])
    }
  }
  const nextAvatar = () => {
    if (avaIndex < avatarArr.length - 1) {
      setAvaIndex(avaIndex + 1)
      setAva(avatarArr[avaIndex + 1])
    } else {
      setAvaIndex(0)
      setAva(avatarArr[0])
    }
  }
  const registerMeta = () => {
    let name = inputName.trim()
    if (name.length === 0) {
      toast({
        title: "Please input your name",
        status: "warning",
        duration: 2000,
        isClosable: true
      })
      return
    }
    register_meta(name, Number(inputInvite), ava)
    onClose()
  }

  return (
    <>
      <Button isLoading={props.isLoading} onClick={onOpen}>
        Register Account
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-[8px]" bg={"#1F143D"} overflowY={"auto"} maxH={"65vh"} style={{ width: "330px" }}>
          <ModalBody className="!p-[5px] rounded-[8px]">
            <div className="!p-[20px] rounded-[8px] border-2 border-solid" style={{ borderColor: "#352858" }}>
              <div className="text-white mb-2 text-se">Register your Account</div>
              <div className="flex items-center justify-center mt-6 text-white">
                <span style={{ cursor: "pointer" }} onClick={preAvatar}>
                  &lt;
                </span>
                <Img className="ml-4 mr-4" src={assets?.[ava]} width={"120px"}></Img>
                <span style={{ cursor: "pointer" }} onClick={nextAvatar}>
                  &gt;
                </span>
              </div>
              <div className="text-white mb-2 text-sm">Name</div>
              <Input type="text" className="rounded-[30px] text-white" width={"280px"} value={inputName} onChange={(v) => setInputName(v.target.value)} />
              <div className="text-white mt-4 mb-2 text-sm">Invite Code (Optional) </div>
              <Input type="text" className="text-white" width={"280px"} value={inputInvite} onChange={(v) => setInputInvite(v.target.value)} />
              <div className="text-white mt-4 mb-2 text-sm">Wallet Address</div>
              <Input type="text" className="text-white" width={"280px"} value={getSimplifidyWalletAddr(String(props.address), 8)} disabled={true} />

              <div className="flex justify-center mt-6">
                <Button style={{ width: "260px" }} onClick={registerMeta}>
                  Register
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContinueGame
