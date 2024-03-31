

import { useContext, useState } from "react"
import { AppContext } from "../pages/_app"


import enUs from '../public/locales/EN/common.json';
import zhCN from '../public/locales/ZH_CN/common.json'

const ChangeLang = () => {
  const [lang,setlang] = useState('EN')
  const { setLocal } = useContext(AppContext)
  const handleLanguageChange = (value: string) => {
    if(value==='EN'){
      setLocal(enUs)
      setlang('EN')
    }
    if(value==='ZH_CN'){
      setLocal(zhCN)
      setlang('ZH_CN')
    }
  }
  return (
    
        <div className="changeLang">
            <div className={lang=='EN'?'changeLang-btn changeLang-btn-s' : 'changeLang-btn'}  onClick={()=>{
                handleLanguageChange('EN')
            }}>English</div>
            <div className={lang=='ZH_CN'?'changeLang-btn changeLang-btn-s' : 'changeLang-btn'} style={{'lineHeight':'26px'}} onClick={()=>{
                handleLanguageChange('ZH_CN')
            }}>中文</div>
        </div>
    
  )
}

export default ChangeLang
