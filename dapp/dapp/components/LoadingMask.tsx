import React, { useState, useEffect } from "react"

const LoadingMask = () => {
  const [loadingTextIndex, setLoadingTextIndex] = useState(0)
  const loadingText = ["loading.", "loading..", "loading..."]
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTextIndex((loadingTextIndex + 1) % 3)
    }, 500)
    return () => clearInterval(timer)
  }, [loadingTextIndex])
  return (
    <div className="w-full h-full bg-black text-white z-[11111]">
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] -translate-y-[-50%]">{loadingText[loadingTextIndex]}</div>
    </div>
  )
}

export default LoadingMask
