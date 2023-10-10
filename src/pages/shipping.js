import Layout from "@/components/Layout"
import StepsM from "./steps"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { useStateValue } from "@/context/StateProvider"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Shipping() {
  const [{ cart }, dispatch] = useStateValue()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()
  const { shippingAddress } = cart
  useEffect(() => {
    setValue("fullName", shippingAddress.fullName)
    setValue("address", shippingAddress.address)
    setValue("city", shippingAddress.city)
    setValue("postalCode", shippingAddress.postalCode)
    setValue("country", shippingAddress.country)
    setValue("email", shippingAddress.email)
  }, [
    setValue,
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.country,
    shippingAddress.email,
    shippingAddress.fullName,
    shippingAddress.postalCode,
  ])

  const submitHandler = ({
    email,
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    console.log(fullName, address, city, postalCode, country, email)
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country, email },
    })
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          email,
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    )
    setLoading(true)
    router.push("/payment")
  }
  return (
    <>
      <Layout title='Shipping'>
        <div>
          <StepsM currentStep={2} />
          <div class='grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32'>
            <div class='px-4 pt-8'>
              <p class='text-xl font-medium'>Order Summary</p>

              <div class='mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6'>
                {cart?.cartItems.map((item) => (
                  <div
                    key={item.slug}
                    class='flex flex-col rounded-lg bg-white sm:flex-row'>
                    <Image
                      width={112}
                      height={96}
                      objectFit='cover'
                      src={item.image}
                      alt={item.name}
                    />
                    <div class='flex w-full flex-col px-4 py-4'>
                      <span class='font-semibold'>{item.name}</span>
                      <span class='float-right text-gray-400'>
                        Quantity: {item.quantity}
                      </span>
                      <p class='text-lg font-bold'>${item.price} USD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div class='mt-10 bg-gray-50 px-4 pt-8 lg:mt-0'>
              <p class='text-xl font-medium'>Payment Details</p>
              <p class='text-gray-400'>
                Complete your order by providing your payment details.
              </p>
              <form class='' onSubmit={handleSubmit(submitHandler)}>
                <label for='email' class='mt-4 mb-2 block text-sm font-medium'>
                  Email
                </label>
                <div class='relative'>
                  <input
                    type='text'
                    id='email'
                    name='email'
                    {...register("email", {
                      required: "Please enter email",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                        message: "Please enter valid email",
                      },
                    })}
                    class='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-orange-500 focus:ring-orange-500'
                    placeholder='your.email@gmail.com'
                  />
                  {errors.email && (
                    <small classemail='text-red-500 tex-base'>
                      {errors.email.message}
                    </small>
                  )}
                  <div class='pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      stroke-width='2'>
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                      />
                    </svg>
                  </div>
                </div>
                <label
                  for='card-holder'
                  class='mt-4 mb-2 block text-sm font-medium'>
                  Card Holder
                </label>
                <div class='relative'>
                  <input
                    type='text'
                    id='fullName'
                    name='fullName'
                    {...register("fullName", {
                      required: "Please insert name on card",
                    })}
                    class='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-orange-500 focus:ring-orange-500'
                    placeholder='Your full name here'
                  />
                  {errors.fullName && (
                    <small className='text-red-500 tex-base'>
                      {errors.fullName.message}
                    </small>
                  )}
                  <div class='pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      stroke-width='2'>
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z'
                      />
                    </svg>
                  </div>
                </div>

                <label
                  for='billing-address'
                  class='mt-4 mb-2 block text-sm font-medium'>
                  Billing Address
                </label>
                <div class='flex flex-col sm:flex-row'>
                  <div class='relative flex-shrink-0 sm:w-7/12'>
                    <input
                      type='text'
                      id='address'
                      {...register("address", {
                        required: "Please enter address",
                        minLength: {
                          value: 3,
                          message: "Address should be more than 5 characteder",
                        },
                      })}
                      class='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-orange-500 focus:ring-orange-500'
                      placeholder='Street Address'
                    />
                    {errors.address && (
                      <div className='text-red-500'>
                        {errors.address.message}
                      </div>
                    )}
                  </div>
                  <input
                    type='text'
                    placeholder='City'
                    id='city'
                    {...register("city", {
                      required: "Please enter city",
                    })}
                    className='w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-orange-500 focus:ring-orange-500'
                  />
                  {errors.city && (
                    <div className='text-red-500 '>{errors.city.message}</div>
                  )}
                </div>
                <label
                  for='country'
                  class='mt-4 mb-2 block text-sm font-medium'>
                  Country
                </label>
                <div class='flex flex-col sm:flex-row'>
                  <div class='relative flex-shrink-0 sm:w-7/12'>
                    <input
                      type='text'
                      id='country'
                      name='country'
                      {...register("country", {
                        required: "Please insert your country name",
                      })}
                      class='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-orange-500 focus:ring-orange-500'
                      placeholder='YOUR COUNTRY'
                    />
                    {errors.country && (
                      <small className='text-red-500 tex-base'>
                        {errors.country.message}
                      </small>
                    )}
                  </div>
                  <input
                    type='text'
                    id='postalCode'
                    {...register("postalCode", {
                      required: "Please enter postal code",
                    })}
                    className='w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-orange-500 focus:ring-orange-500'
                    placeholder='Postal Code'
                  />
                  {errors.postalCode && (
                    <small className='text-red-500 '>
                      {errors.postalCode.message}
                    </small>
                  )}
                </div>

                <button
                  type='submit'
                  class='mt-4 mb-8 w-full rounded-md bg-orange-800 px-6 py-3 font-medium text-white'>
                  {loading ? "loading" : "Next"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
Shipping.auth = true
