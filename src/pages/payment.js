import { useRouter } from "next/router"

import { toast } from "react-toastify"
import Cookies from "js-cookie"

import Layout from "../components/Layout"
import { useEffect, useState } from "react"
import { useStateValue } from "@/context/StateProvider"
import StepsM from "./steps"
import { AiOutlineLeft } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
export default function Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")

  const [{ cart }, dispatch] = useStateValue()
  const { shippingAddress, paymentMethod } = cart

  const router = useRouter()

  const submitHandler = (e) => {
    e.preventDefault()
    if (!selectedPaymentMethod) {
      return toast.warning("Payment method is required")
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod })
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    )

    router.push("/placeorder")
  }
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping")
    }
    setSelectedPaymentMethod(paymentMethod || "")
  }, [paymentMethod, router, shippingAddress.address])

  return (
    <Layout title='Payment Method'>
      <StepsM currentStep={3} />
      <form className='mx-auto max-w-screen-md' onSubmit={submitHandler}>
        <h1 className='mb-4 text-xl'>Payment Method</h1>
        {["Stripe", "PayPal", "CashOnDelivery"].map((payment) => (
          <div key={payment} className='mb-4'>
            <input
              name='paymentMethod'
              className='p-2 outline-none focus:ring-0'
              id={payment}
              type='radio'
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className='p-2' htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className='mb-4 flex justify-between'>
          <button
            onClick={() => router.push("/shipping")}
            type='button'
            className='flex justify-center items-center bg-gray-500 text-white px-4 py-1 gap-1 rounded-md'>
            <div>
              <AiOutlineLeft />
            </div>{" "}
            Back
          </button>
          <button className='flex  items-center justify-center bg-orange-800 text-white px-4 py-1 gap-1 rounded-md'>
            Next{" "}
            <div>
              <AiOutlineRight color='white' />
            </div>
          </button>
        </div>
      </form>
    </Layout>
  )
}

Payment.auth = true
