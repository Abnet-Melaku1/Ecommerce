import Layout from "@/components/Layout"
import StepsM from "./steps"
import { useStateValue } from "@/context/StateProvider"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { getError } from "@/utils/error"
import Image from "next/image"

export default function PlaceOrder() {
  const [{ cart }, dispatch] = useStateValue()
  const { cartItems, shippingAddress, paymentMethod } = cart
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )

  const shippingPrice = itemsPrice > 200 ? 0 : 15
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  const router = useRouter()
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment")
    }
  }, [paymentMethod, router])

  const [loading, setLoading] = useState(false)

  const placeOrderHandler = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
      setLoading(false)
      dispatch({ type: "CART_CLEAR_ITEMS" })
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      )
      router.push(`/order/${data._id}`)
    } catch (err) {
      setLoading(false)
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Order'>
      <StepsM currentStep={4} />
      <div className='py-14 px-4 md:px-6 2xl:px-20 container mx-auto'>
        <div className='flex justify-start item-start space-y-2 flex-col '>
          <h1 className='text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800'>
            Order
          </h1>
          <p className='text-base font-medium leading-6 text-gray-600'>Time</p>
        </div>
        <div className='mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0'>
          <div className='flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8'>
            <div className='flex flex-col justify-start items-start bg-orange-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full'>
              <p className='text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800'>
                Customer’s Cart
              </p>
              {cart.cartItems.map((item) => (
                <div
                  key={item._id}
                  className='mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full '>
                  <div className='pb-4 md:pb-8 w-full md:w-40'>
                    <Image
                      className='w-full hidden md:block'
                      src={item.image}
                      height={160}
                      width={160}
                      alt={item.name}
                    />
                    <Image
                      className='w-full md:hidden'
                      height={160}
                      width={160}
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className='border-b border-orange-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0'>
                    <div className='w-full flex flex-col justify-start items-start space-y-8'>
                      <h3 className='text-xl xl:text-2xl font-semibold leading-6 text-gray-800'>
                        {item.name}
                      </h3>
                      <div className='flex justify-start items-start flex-col space-y-2'>
                        <p className='text-sm leading-none text-gray-800'>
                          <span className='text-gray-500'>Category: </span>{" "}
                          {item.category}
                        </p>
                        <p className='text-sm leading-none text-gray-800'>
                          <span className='text-gray-500'>Brand: </span>{" "}
                          {item.brand}
                        </p>
                        <p className='text-sm leading-none text-orange-800'></p>
                      </div>
                    </div>
                    <div className='flex justify-between space-x-8 items-start w-full'>
                      <p className='text-base xl:text-lg leading-6'>
                        ${item.price}
                      </p>
                      <p className='text-base xl:text-lg leading-6 text-gray-800'>
                        {item.quantity}
                      </p>
                      <p className='text-base xl:text-lg font-semibold leading-6 text-gray-800'>
                        Subtotal: {item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8'>
              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-orange-50 space-y-6   '>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>
                  Summary
                </h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-orange-200 border-b pb-4'>
                  <div className='flex justify-between  w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      Subtotal
                    </p>
                    <p className='text-base leading-4 text-gray-600'>
                      ${itemsPrice}USD
                    </p>
                  </div>
                  <div className='flex justify-between items-center w-full'>
                    <p className='text-base leading-4 text-gray-800'>Tax</p>
                    <p className='text-base leading-4 text-gray-600'>
                      -${taxPrice} (50%)
                    </p>
                  </div>
                  <div className='flex justify-between items-center w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      Shipping
                    </p>
                    <p className='text-base leading-4 text-gray-600'>
                      ${shippingPrice}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between items-center w-full'>
                  <p className='text-base font-semibold leading-4 text-gray-800'>
                    Total
                  </p>
                  <p className='text-base font-semibold leading-4 text-gray-600'>
                    ${totalPrice}
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={placeOrderHandler}
                  className='hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 py-5 w-1/2 md:w-full bg-orange-800 text-base font-medium leading-4 text-white'>
                  {loading ? "loading" : "Place Order"}
                </button>
              </div>
            </div>
          </div>
          <div className='bg-orange-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col '>
            <h3 className='text-xl font-semibold leading-5 text-gray-800'>
              Customer
            </h3>
            <div className='flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 '>
              <div className='flex flex-col justify-start items-start flex-shrink-0'>
                <div className='flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-orange-200'>
                  <div className=' flex justify-start items-start flex-col space-y-2'>
                    <p className='text-base font-semibold leading-4 text-left text-gray-800'>
                      {cart.shippingAddress.fullName}
                    </p>
                  </div>
                </div>

                <div className='flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-orange-200 w-full'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z'
                      stroke='#1F2937'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M3 7L12 13L21 7'
                      stroke='#1F2937'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <p className='cursor-pointer text-sm leading-5 text-gray-800'>
                    {cart.shippingAddress.email}
                  </p>
                </div>
              </div>
              <div className='flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0'>
                <div className='flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start '>
                  <div className='flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8'>
                    <p className='text-base font-semibold leading-4 text-center md:text-left text-gray-800'>
                      Shipping Address
                    </p>
                    <p className='w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600'>
                      {cart.shippingAddress.address}
                    </p>
                  </div>
                  <div className='flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 '>
                    <p className='text-base font-semibold leading-4 text-center md:text-left text-gray-800'>
                      Billing Address
                    </p>
                    <p className='w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600'>
                      {cart.shippingAddress.address}
                    </p>
                  </div>
                </div>
                <div className='flex w-full justify-center items-center md:justify-start md:items-start'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

PlaceOrder.auth = true
