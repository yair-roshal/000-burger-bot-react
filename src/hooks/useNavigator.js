import { useState, useCallback, useEffect } from "react"

export function useNavigator() {
  const [env, setEnv] = useState("init")
  useEffect(() => {
    navigator.sayswho = (function () {
      const ua = navigator.userAgent
      let tem
      let M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || []

      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || []
        setEnv("browser")
        return "IE " + (tem[1] || "")
      }

      if (M[1] === "Chrome") {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
        if (tem != null) {
          setEnv("browser")
          return tem.slice(1).join(" ").replace("OPR", "Opera")
        }
      }
      M[2] ? setEnv("browser") : setEnv("tele")
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"]
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1])
      return M.join(" ")
    })()

   }, [])

  return {
    env,
  }
}
