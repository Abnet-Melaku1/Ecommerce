import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { signOut, useSession } from "next-auth/react"
import Cookies from "js-cookie"
import { useStateValue } from "@/context/StateProvider"
import Link from "next/link"
export default function NavMenu({ name }) {
  // eslint-disable-next-line no-unused-vars
  const { status, data: session } = useSession()
  // eslint-disable-next-line no-unused-vars
  const [{ cart }, dispatch] = useStateValue()

  const logoutHandler = () => {
    dispatch({ type: "CART_RESET" })
    Cookies.remove("cart")
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className='   text-right'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md  px-4 py-2 text-md font-medium text-orange-700 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 '>
            {name}
            <ChevronDownIcon
              className='ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'>
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {session.user.isAdmin && (
              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Link href='/admin/dashboard'>
                      <button
                        className={`${
                          active ? "bg-orange-700 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                        Admin
                      </button>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            )}
            {session.user.isAdmin && (
              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Link href='/admin/orders'>
                      <button
                        className={`${
                          active ? "bg-orange-700 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                        Sales
                      </button>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            )}
            {session.user.isAdmin && (
              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Link href='/admin/products'>
                      <button
                        className={`${
                          active ? "bg-orange-700 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                        Products
                      </button>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            )}
            {session.user.isAdmin && (
              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Link href='/admin/users'>
                      <button
                        className={`${
                          active ? "bg-orange-700 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                        Users
                      </button>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            )}

            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <Link href='/profile'>
                    <button
                      className={`${
                        active ? "bg-orange-700 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      Profile
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <Link href='/order-history'>
                    <button
                      className={`${
                        active ? "bg-orange-700 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      Orders
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className='px-1 py-1'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-orange-700 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={logoutHandler}>
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
