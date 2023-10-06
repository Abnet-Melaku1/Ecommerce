import { StateProvider } from "@/context/StateProvider"
import "@/styles/globals.css"
import { ToastContainer } from "react-toastify"
import { SessionProvider } from "next-auth/react"
import "react-toastify/dist/ReactToastify.css"
import reducer from "@/context/reducer"
import { initialState } from "@/context/reducer"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <Component {...pageProps} />
        <ToastContainer />
      </StateProvider>
    </SessionProvider>
  )
}
