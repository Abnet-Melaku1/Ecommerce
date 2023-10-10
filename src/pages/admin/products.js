import Layout from "@/components/Layout"
import { getError } from "@/utils/error"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useReducer } from "react"
import { ClipLoader } from "react-spinners"
import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true }
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false }
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false }
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true }
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true }
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false }
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false }

    default:
      state
  }
}
const Products = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [productId, setProductId] = useState("")
  const cancelButtonRef = useRef(null)
  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/admin/products`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" })
    } else {
      fetchData()
    }
  }, [successDelete])
  const openHandler = (id) => {
    setOpen(true)
    setProductId(id)
  }
  const deleteHandler = async () => {
    try {
      dispatch({ type: "DELETE_REQUEST" })
      await axios.delete(`/api/admin/products/${productId}`)
      dispatch({ type: "DELETE_SUCCESS" })
      setOpen(false)
      toast.success("Product deleted successfully")
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" })
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Prouducts'>
      {open && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-10'
            initialFocus={cancelButtonRef}
            onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
            </Transition.Child>

            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
              <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                  <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                    <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                      <div className='sm:flex sm:items-start'>
                        <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                          <ExclamationTriangleIcon
                            className='h-6 w-6 text-red-600'
                            aria-hidden='true'
                          />
                        </div>
                        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                          <Dialog.Title
                            as='h3'
                            className='text-base font-semibold leading-6 text-gray-900'>
                            Delete Product
                          </Dialog.Title>
                          <div className='mt-2'>
                            <p className='text-sm text-gray-500'>
                              Are you sure you want to delte this Product? All
                              of your data will be permanently removed. This
                              action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                      <button
                        onClick={deleteHandler}
                        type='button'
                        disable={loadingDelete}
                        className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'>
                        {loadingDelete ? (
                          <ClipLoader
                            size={15}
                            color='white'
                            aria-label='Loading Spinner'
                            data-testid='loader'
                          />
                        ) : (
                          "Delete"
                        )}
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}>
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      {loading ? (
        <div className='flex justify-center items-center h-full min-h-screen'>
          {" "}
          <ClipLoader color='lightblue' size={80} />
        </div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <section className='container px-4 mx-auto mt-24'>
          <h2 className='text-3xl my-4 lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800'>
            Products
          </h2>
          <div className='flex flex-wrap items-start justify-end my-3'>
            <button
              onClick={() => router.push("/admin/product/create")}
              className='inline-flex px-5 py-3 text-white bg-orange-700 hover:bg-orange-800 focus:bg-orange-800 rounded-md ml-6 mb-3'>
              <svg
                aria-hidden='true'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              {loadingCreate ? "loading" : "Create new Product"}
            </button>
          </div>
          <div className='flex flex-col'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className='alert-error'>{error}</div>
                ) : (
                  <div className='overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      <thead className='bg-gray-50 dark:bg-gray-800'>
                        <tr>
                          <th
                            scope='col'
                            className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center gap-x-3'>
                              <input
                                type='checkbox'
                                className='text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700'
                              />
                              <button className='flex items-center gap-x-2'>
                                <span>ID</span>

                                <svg
                                  className='h-3'
                                  viewBox='0 0 10 11'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'>
                                  <path
                                    d='M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    stroke-width='0.1'
                                  />
                                  <path
                                    d='M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    stroke-width='0.1'
                                  />
                                  <path
                                    d='M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    stroke-width='0.3'
                                  />
                                </svg>
                              </button>
                            </div>
                          </th>
                          <th
                            scope='col'
                            className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Name
                          </th>

                          <th
                            scope='col'
                            className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Price
                          </th>
                          <th
                            scope='col'
                            className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Category
                          </th>
                          <th
                            scope='col'
                            className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Count
                          </th>

                          <th
                            scope='col'
                            className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            Rating
                          </th>

                          <th scope='col' className='relative py-3.5 px-4'>
                            <span className='sr-only'>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900'>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td className='px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap'>
                              <div className='inline-flex items-center gap-x-3'>
                                <input
                                  type='checkbox'
                                  className='text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700'
                                />

                                <span>#{product._id?.substring(20, 24)}</span>
                              </div>
                            </td>
                            <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                              {product.name}
                            </td>
                            <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                              ${product.price}USD
                            </td>
                            <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                              {product.category}
                            </td>

                            <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                              {product.countInStock}
                            </td>
                            <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                              {product.rating}
                            </td>

                            <td className='px-4 py-4 text-sm whitespace-nowrap'>
                              <div className='flex items-center gap-x-6'>
                                <button className='text-blue-500 hover:underline transition-colors duration-200 hover:text-indigo-500 focus:outline-none'>
                                  <Link
                                    href={`/admin/product/${product._id}`}
                                    passHref>
                                    Edit
                                  </Link>
                                </button>
                                <button
                                  onClick={() => openHandler(product._id)}
                                  className='text-red-500 hover:underline transition-colors duration-200 hover:text-red-600 focus:outline-none'>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
Products.auth = { adminOnly: true }
export default Products
