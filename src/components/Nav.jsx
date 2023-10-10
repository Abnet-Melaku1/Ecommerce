import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useStateValue } from "@/context/StateProvider"

import useCartStore from "@/hooks/useCart"

import Cart from "@/pages/cart"
import { useSession } from "next-auth/react"
import { ClipLoader } from "react-spinners"
import NavMenu from "./NavMenu"
const Nav = () => {
  const { status, data: session } = useSession()

  const [{ cart }] = useStateValue()
  const { isCartOpen, toggleCart } = useCartStore()
  const [cartItems, setCartItems] = useState(0)
  useEffect(() => {
    setCartItems(cart.cartItems.reduce((a, c) => a + c?.quantity, 0))
  }, [cart.cartItems])

  return (
    <>
      {isCartOpen && <Cart />}
      <div className='dark:bg-gray-900 fixed w-full z-10 bg-white bg-opacity-90 '>
        <div className='container mx-auto relative'>
          <div className='pt-4 mx-4 md:mx-6'>
            <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-4'>
              <div>
                <Link href='/'>
                  <div className='hidden lg:block cursor-pointer' role='img'>
                    <Image
                      src='/logo-no-background.svg'
                      alt='logo'
                      width={150}
                      height={110}
                    />
                  </div>
                </Link>
                <Link href='/'>
                  <div
                    className='hidden md:block lg:hidden cursor-pointer'
                    role='img'
                    aria-label='luxe. Logo.'>
                    <Image
                      src='/logo-no-background.svg'
                      alt='logo'
                      width={150}
                      height={110}
                    />
                  </div>
                </Link>
                <div
                  className='md:hidden cursor-pointer'
                  role='img'
                  aria-label='luxe. Logo.'>
                  <Image
                    src='/logo-no-background.svg'
                    alt='logo'
                    width={150}
                    height={110}
                  />
                </div>
              </div>
              <div className=''>
                <ul className='flex items-center space-x-6'></ul>
              </div>
              <div className='flex items-center space-x-4'>
                <div className='cursor-pointer flex gap-1' onClick={toggleCart}>
                  <svg
                    className='fill-stroke text-gray-800 dark:text-white'
                    width={20}
                    height={22}
                    viewBox='0 0 20 22'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M4 1L1 5V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5L16 1H4Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M1 5H19'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M14 9C14 10.0609 13.5786 11.0783 12.8284 11.8284C12.0783 12.5786 11.0609 13 10 13C8.93913 13 7.92172 12.5786 7.17157 11.8284C6.42143 11.0783 6 10.0609 6 9'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {cartItems > 0 && (
                    <span className='px-2 py-1 text-xs text-white rounded-full bg-orange-700 text-center'>
                      {cartItems}
                    </span>
                  )}
                </div>

                {status === "loading" ? (
                  <ClipLoader
                    size={15}
                    aria-label='Loading Spinner'
                    data-testid='loader'
                  />
                ) : session?.user ? (
                  <NavMenu name={session.user.name} />
                ) : (
                  <Link href='/login'>
                    <button className='focus:outline-none focus:ring-2 focus:ring-gray-800 rounded bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white px-3 py-1'>
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Nav
