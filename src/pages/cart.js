import dynamic from "next/dynamic"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { toast } from "react-toastify"
import {
  MinusIcon,
  PlusIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import useCartStore from "@/hooks/useCart"
import { useStateValue } from "@/context/StateProvider"
import { useRouter } from "next/router"

function Cart() {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  function dontClose() {
    setOpen(true)
  }
  const [{ cart }, dispatch] = useStateValue()

  const { toggleCart } = useCartStore()

  const increaseQuantityHandler = (product) => {
    const isItemExist = cart.cartItems.find(
      (item) => item.slug === product.slug
    )
    const quantity = isItemExist ? isItemExist.quantity + 1 : 1

    if (product.countInStock < quantity) {
      toast.warning("Product is out of stock.")
      return
    }

    dispatch({
      type: "INCREASE_QUANTITY",
      payload: { slug: product.slug },
    })
  }

  const decreaseQuantityHandler = (product) => {
    const isItemExist = cart.cartItems.find(
      (item) => item.slug === product.slug
    )

    if (!isItemExist) {
      return
    }

    const newQuantity = isItemExist.quantity - 1

    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_CART_ITEM", payload: product })
    } else {
      dispatch({
        type: "DECREASE_QUANTITY",
        payload: { slug: product.slug },
      })
    }
  }
  const onClick = () => {
    toggleCart()
    setOpen(false)
  }
  const removeItemHandler = (item) => {
    console.log(item.slug)
    dispatch({ type: "REMOVE_CART_ITEM", payload: item })
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={dontClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'>
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <div className='flex h-full flex-col overflow-y-scroll bg-white/80 p-6 shadow-xl'>
                    <div className='flex-1 overflow-y-auto px-4 py-6 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <Dialog.Title className='text-lg font-medium text-gray-900'>
                          Shopping cart
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='relative -m-2 p-2 text-gray-400 hover:text-gray-500'
                            onClick={onClick}>
                            <span className='absolute -inset-0.5' />
                            <span className='sr-only'>Close panel</span>
                            <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>

                      {cart.cartItems.length == 0 ? (
                        <div className='flex items-center justify-center flex-col mt-2'>
                          <p className='text-xl text-orange-800'>
                            Your cart is empty.
                          </p>
                          <ShoppingCartIcon />
                        </div>
                      ) : (
                        <div className='mt-8'>
                          <div className='flow-root'>
                            <ul
                              role='list'
                              className='-my-6 divide-y divide-gray-200'>
                              {cart?.cartItems.map((item) => (
                                <li key={item.id} className='flex py-6'>
                                  <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className='h-full w-full object-cover object-center'
                                    />
                                  </div>

                                  <div className='ml-4 flex flex-1 flex-col'>
                                    <div>
                                      <div className='flex justify-between text-base font-medium text-gray-900'>
                                        <h3>
                                          <a href={""}>{item.name}</a>
                                        </h3>
                                        <p className='flex justify-end space-y-2 text-right text-sm'>
                                          ${item.price} USD
                                        </p>
                                      </div>
                                      <p className='mt-1 text-sm text-gray-500'>
                                        {""}
                                      </p>
                                    </div>
                                    <div className='flex flex-1 items-end justify-between text-sm'>
                                      <div className='ml-2 flex  gap-3 flex-none items-center justify-center py-1  px-2 transition-all duration-200 border border-neutral-400  rounded-2xl'>
                                        <div
                                          onClick={() =>
                                            decreaseQuantityHandler(item)
                                          }>
                                          {" "}
                                          <MinusIcon className='h-4 w-4 dark:text-neutral-500 text-3xl cursor-pointer' />
                                        </div>

                                        <p className='text-gray-700 text-base'>
                                          {item.quantity}
                                        </p>
                                        <div
                                          onClick={() =>
                                            increaseQuantityHandler(item)
                                          }>
                                          <PlusIcon className='h-4 w-4 dark:text-neutral-500 cursor-pointer' />
                                        </div>
                                      </div>

                                      <div className='flex'>
                                        <button
                                          onClick={() =>
                                            removeItemHandler(item)
                                          }
                                          type='button'
                                          className='font-medium text-orange-700 hover:text-orange-600'>
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {cart.cartItems.length > 0 && (
                      <div className='border-t border-gray-200 px-4 py-6 sm:px-6'>
                        <div className='flex justify-between text-base font-medium text-gray-900'>
                          <p>
                            Subtotal{" "}
                            <span>
                              (
                              {cart.cartItems.reduce(
                                (a, c) => a + c.quantity,
                                0
                              )}
                              )
                            </span>
                          </p>{" "}
                          <p className='text-right text-base text-black dark:text-white'>
                            $
                            {cart.cartItems.reduce(
                              (a, c) => a + c.quantity * c.price,
                              0
                            )}
                            USD
                          </p>
                        </div>
                        <p className='mt-0.5 text-sm text-gray-500'>
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className='mt-6'>
                          <button
                            onClick={() => router.push("/shipping")}
                            className='flex items-center justify-center rounded-md border border-transparent bg-orange-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-800 w-full'>
                            Checkout
                          </button>
                        </div>
                        <div className='mt-6 flex justify-center text-center text-sm text-gray-500'>
                          <p>
                            or
                            <button
                              type='button'
                              className='font-medium text-orange-700 hover:text-orange-600'
                              onClick={() => setOpen(false)}>
                              Continue Shopping
                              <span aria-hidden='true'> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false })
