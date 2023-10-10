import Layout from "@/components/Layout"
import { getError } from "@/utils/error"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useReducer } from "react"
import { ClipLoader } from "react-spinners"
import { toast } from "react-toastify"
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    case "PAY_REQUEST":
      return { ...state, loadingPay: true }
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true }
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload }
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" }
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true }
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true }
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false }
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      }
    default:
      state
  }
}
const PlacedOrders = () => {
  const { data: session } = useSession()
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const { query } = useRouter()
  const orderId = query.id
  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  })
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/orders/${orderId}`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder()
      if (successPay) {
        dispatch({ type: "PAY_RESET" })
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal")
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        })
        paypalDispatch({ type: "setLoadingStatus", value: "pending" })
      }
      loadPaypalScript()
    }
  }, [order._id, orderId, paypalDispatch, successDeliver, successPay])
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" })
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        )
        dispatch({ type: "PAY_SUCCESS", payload: data })
        toast.success("Order is paid successgully")
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) })
        toast.error(getError(err))
      }
    })
  }
  function onError(err) {
    toast.error(getError(err))
  }
  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" })
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      )
      dispatch({ type: "DELIVER_SUCCESS", payload: data })
      toast.success("Order is delivered")
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) })
      toast.error(getError(err))
    }
  }

  return (
    <>
      <Layout title='Orders'>
        {loading ? (
          <div className='flex justify-center items-center h-full min-h-screen'>
            {" "}
            <ClipLoader color='lightblue' size={80} />
          </div>
        ) : error ? (
          <div className='alert-error'>{error}</div>
        ) : (
          <div className='py-14 px-4 md:px-6 2xl:px-20 container mx-auto mt-20'>
            <div className='flex justify-start item-start space-y-2 flex-col '>
              <h1 className='text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800'>
                Order {orderId}
              </h1>
            </div>
            <div className='mt-4 md:mt-6 p-3 flex  flex-col bg-gray-50 md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full rounded-md '>
              <div className='border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0'>
                <div className='w-full flex flex-col justify-start items-start space-y-8'>
                  <h3 className='text-xl xl:text-2xl font-semibold leading-6 text-gray-800'>
                    Shipping Address
                  </h3>
                  <div>
                    {" "}
                    {shippingAddress.fullName}, {shippingAddress.address},{" "}
                    {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                    {shippingAddress.country}
                  </div>
                  {isDelivered ? (
                    <div
                      class='bg-green-100 border border-green-300 text-green-600 px-4 py-3 rounded w-full relative'
                      role='alert'>
                      <strong class='font-bold'>{deliveredAt}</strong>
                    </div>
                  ) : (
                    <div
                      class='bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded w-full relative'
                      role='alert'>
                      <strong class='font-bold'>Not Delivered yet.</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='mt-4 md:mt-6 p-3 flex  flex-col bg-gray-50 md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full rounded-md '>
              <div className='border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0'>
                <div className='w-full flex flex-col justify-start items-start space-y-8'>
                  <h3 className='text-xl xl:text-2xl font-semibold leading-6 text-gray-800'>
                    Payment Method
                  </h3>
                  <div>{paymentMethod}</div>
                  {isPaid ? (
                    <div
                      class='bg-green-100 border border-green-300 text-green-600 px-4 py-3 rounded w-full relative'
                      role='alert'>
                      <strong class='font-bold'>{paidAt}</strong>
                    </div>
                  ) : (
                    <div
                      class='bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded w-full relative'
                      role='alert'>
                      <strong class='font-bold'>Not Payed yet.</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='mt-10 flex flex-col  jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0'>
              <div className='flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8'>
                <div className='flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full'>
                  <p className='text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800'>
                    Customer’s Cart
                  </p>
                  {orderItems.map((item) => (
                    <div
                      key={item._id}
                      className='mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full '>
                      <div className='pb-4 md:pb-8 w-full md:w-40'>
                        <img
                          className='w-full hidden md:block'
                          src={item.image}
                          alt={item.name}
                        />
                        <img
                          className='w-full md:hidden'
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className='border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0'>
                        <div className='w-full flex flex-col justify-start items-start space-y-8'>
                          <h3 className='text-xl xl:text-2xl font-semibold leading-6 text-gray-800'>
                            {item.name}
                          </h3>
                          <div className='flex justify-start items-start flex-col space-y-2'>
                            <p className='text-sm leading-none text-gray-800'>
                              <span className='text-gray-600'>category: </span>{" "}
                              {item.category}
                            </p>
                            <p className='text-sm leading-none text-gray-800'>
                              <span className='text-gray-600'>Quantity: </span>{" "}
                              {item.quantity}
                            </p>
                            <p className='text-sm leading-none text-gray-800'>
                              <span className='text-gray-600'>Brand: </span>{" "}
                              {item.brand}
                            </p>
                          </div>
                        </div>
                        <div className='flex justify-between space-x-8 items-start w-full'>
                          <p className='text-base xl:text-lg leading-6'>
                            ${item.price}
                          </p>
                          <p className='text-base xl:text-lg leading-6 text-gray-800'>
                            01
                          </p>
                          <p className='text-base xl:text-lg font-semibold leading-6 text-gray-800'>
                            {item.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8'>
                  <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   '>
                    <h3 className='text-xl font-semibold leading-5 text-gray-800'>
                      Summary
                    </h3>
                    <div className='flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4'>
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
                  </div>
                  <div className='flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   '>
                    <div className='w-full flex justify-center items-center'>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div className='w-full flex justify-center items-center'>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}></PayPalButtons>
                        </div>
                      )}
                      {session.user.isAdmin &&
                        order.isPaid &&
                        !order.isDelivered && (
                          <li>
                            {loadingDeliver && <div>Loading...</div>}
                            <button
                              onClick={deliverOrderHandler}
                              className='hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 py-5 w-96 md:w-full bg-orange-800 text-base font-medium leading-4 text-white'>
                              Deliver Order
                            </button>
                          </li>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
PlacedOrders.auth = true
export default PlacedOrders
