import { StateProvider } from "@/context/StateProvider"
import "@/styles/globals.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import reducer from "@/context/reducer"
import { initialState } from "@/context/reducer"
export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Component {...pageProps} />
      <ToastContainer />
    </StateProvider>
  )
}
