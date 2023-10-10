import { StateProvider } from "@/context/StateProvider"
import "@/styles/globals.css"
import { ToastContainer } from "react-toastify"
import { SessionProvider, useSession } from "next-auth/react"
import "react-toastify/dist/ReactToastify.css"
import reducer from "@/context/reducer"
import { initialState } from "@/context/reducer"
import { useRouter } from "next/router"
import { ClipLoader } from "react-spinners"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <PayPalScriptProvider deferLoading={true}>
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
        <ToastContainer />
      </StateProvider>
    </SessionProvider>
  )
}
function Auth({ children, adminOnly }) {
  const router = useRouter()
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required")
    },
  })
  if (status === "loading") {
    return (
      <div className='flex justify-center items-center h-full min-h-screen'>
        {" "}
        <ClipLoader color='lightblue' size={80} />
      </div>
    )
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorized?message=admin login required")
  }

  return children
}
