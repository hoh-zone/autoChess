import { useState, useEffect } from "react"

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 1,
    height: 1
  })

  useEffect(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [typeof window])

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener("resize", handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return screenSize
}

const useScale = () => {
  const [screenSize, setScreenSize] = useState({
    width: 1,
    height: 1
  })

  useEffect(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [typeof window])

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener("resize", handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return screenSize.width / screenSize.height > 16 / 9 ? screenSize.height / 562.5 : screenSize.width / 1000
}

export default useScreenSize
export { useScale }
