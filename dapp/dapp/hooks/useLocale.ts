
import { useContext } from "react";
import { AppContext } from "../pages/_app";


const useLocale = () => {
    const { locale } = useContext(AppContext);
    const getLocale = (key: string) => {
        if (!key) throw new Error(`key is not defined`);
        const keys = key.split('.');
        let nowValue = locale;
        let res = null;
        try {
            keys.forEach((item, index) => {
                const subItem = nowValue[item];
                if (index === keys.length - 1) {
                    res = subItem;
                } else {
                    if (typeof subItem === 'object' && subItem !== null) {
                        nowValue = subItem;
                    } else {
                        res = null;
                        console.log(res)
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }
        return res;
    }
    return getLocale;
}

export default useLocale