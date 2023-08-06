import { StateProvider } from "@/context/StateProvider"
import "@/styles/globals.css"
import reducer from "@/context/reducer"
import { initialState } from "@/context/reducer"
export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Component {...pageProps} />
    </StateProvider>
  )
}
