import {  Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Input, Img } from "@chakra-ui/react"
import { assetsAtom } from "../store/stages"
import {  useState } from "react"
import { useAtom } from "jotai"

const ContinueGame = (props: {getName:any }) => {
  const [inputName, setInputName] = useState("")
  const [inputWallet, setInputWallet] = useState("")
  const [inputInvite, setInputInvite] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
    const [assets, setAssets] = useAtom(assetsAtom)

    const sendName = () => {
        props.getName(inputName)
        setInputName('')
        onClose()
    }

  return (
    <>
      <Button onClick={onOpen}>
        Register Account
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-[8px]" bg={"#1F143D"} overflowY={"auto"} maxH={"65vh"} style={{width:'330px'}}>
          <ModalBody className="!p-[5px] rounded-[8px]" >
            <div className="!p-[20px] rounded-[8px] border-2 border-solid" style={{borderColor:'#352858'}}>
                <div className="text-white mb-2 text-se">Register your Charactor</div>
            <div className="flex justify-center mt-6">
                <Img src={assets?.avatar} width={"120px"}></Img>
            </div>
            <div className="text-white mb-2 text-sm">Name</div>
            <Input type="text" className="rounded-[30px] text-white" width={"280px"} value={inputName}  onChange={(v) => setInputName(v.target.value)}/>
            <div className="text-white mt-4 mb-2 text-sm">Invite Code</div>
            <Input type="text" className="text-white" width={"280px"} value={inputInvite}  onChange={(v) => setInputInvite(v.target.value)}/>
            <div className="text-white mt-4 mb-2 text-sm">Wallet Address</div>
            <Input type="text" className="text-white" width={"280px"} value={inputWallet} onChange={(v) => setInputWallet(v.target.value)}/>
            <div className="flex justify-center mt-6">
                <Button style={{width:'260px'}}  onClick={sendName}>
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
