import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Progress , Img } from "@chakra-ui/react"
import { assetsAtom } from "../store/stages"
import { useAtom } from "jotai"
import {Character} from "./character/character"
const ContinueGame = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [assets, setAssets] = useAtom(assetsAtom)
  return (
    <>
      <Button onClick={onOpen}>My Account Info</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxWidth={500} className="rounded-[8px] border-4 border-solid overflow-hidden" bg={"#22314D"}  style={{borderColor:"#050F16" }}>
          <ModalBody className="relative !p-[0px]" maxWidth={500}>
            <div >
                <div style={{height:'82px'}}>
                    <Img className="absolute top-0 left-0" src={assets?.account_title_icon} style={{width:"100%"}}/>
                    <div className="absolute left-0 top-0 text-center" style={{width:"100%",lineHeight:'82px'}}>BEEDIL REAILL</div>
                </div>
                <div className="flex justify-between !p-[20px]">
                    <div>
                        <div>
                            <div className="flex items-center">
                                <div className="inline-block mr-2" style={{width:'5px',height:'5px','backgroundColor':'#2D3E60'}}></div>
                                <div className="accountInfoInput" style={{backgroundColor:'#2D3E60'}}>
                                    <span>Name</span>
                                </div>
                            </div>
                            <div className="flex items-center mt-2 mb-2" >
                                <div className="inline-block mr-2" style={{width:'5px',height:'5px','backgroundColor':'#6F91B1'}}></div>
                                <div className="accountInfoInput" style={{backgroundColor:'#6F91B1'}}>
                                    <span>Level</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="inline-block mr-2" style={{width:'5px',height:'5px','backgroundColor':'#85B8C7'}}></div>
                                <div className="accountInfoInput" style={{backgroundColor:'#85B8C7'}}>
                                    <div className="accountInfoInputExp" style={{width:'80%'}}></div>
                                    <span className="relative">Exp</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-center">
                                <div className="inline-block mr-2" style={{width:'5px',height:'5px','backgroundColor':'#2D3E60'}}></div>
                                <div className="accountInfoInput" style={{backgroundColor:'#2D3E60'}}>
                                    <span>Bset Rank:</span>
                                </div>
                            </div>
                            <div className="flex items-center mt-2 mb-2">
                                <div className="inline-block mr-2" style={{width:'5px',height:'5px','backgroundColor':'#6F91B1'}}></div>
                                <div className="accountInfoInput" style={{backgroundColor:'#6F91B1'}}>
                                    <span>Bset Rank:</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="inline-block mr-2" style={{width:'5px',height:'5px','backgroundColor':'#85B8C7'}}></div>
                                <div className="accountInfoInput" style={{backgroundColor:'#85B8C7'}}>
                                    <span>Bset Rank:</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-white mt-20 mb-4 text-xs">InviteNum : 13</div>
                        <Button>AIRDOP</Button>
                    </div>
                    <div>
                        <div className="overflow-hidden">
                            <div style={{width:"300px",marginLeft:"20px", transform:"scale(2.8)"}}>
                            <Character charType="archer" isOpponent={false}></Character>
                        </div>
                        </div>
                        <div className="relative flex w-200 flex-wrap ml-10 mt-10 text-white">
                            <div className="accountCharacterText">skill1</div>
                            <div className="accountCharacterText">skill1</div>
                            <div className="accountCharacterText">skill1</div>
                            <div className="accountCharacterText">skill1</div>
                        </div>
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
