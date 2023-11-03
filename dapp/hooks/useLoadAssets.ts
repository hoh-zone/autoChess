import axios from "axios"
import { useState, useEffect } from "react"

const useLoadAssets = (assets: any) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all(
      Object.entries(assets).map((asset: any) =>
        axios
          .request({
            url: asset[1],
            method: "get",
            onDownloadProgress({ progress: progress$2 }: any) {
              setProgress({
                ...(progress || {}),
                [asset[0]]: progress$2
              })
            },
            responseType: "blob"
          })
          .then((res) => {
            setData({
              ...(data || {}),
              [asset[0]]: URL.createObjectURL(res.data)
            })
          })
      )
    ).finally(() => {
      setTimeout(() => setIsLoading(false), 500)
    })
  }, [JSON.stringify(assets)])

  return {
    isLoading,
    data,
    progress
  }
}

export default useLoadAssets
