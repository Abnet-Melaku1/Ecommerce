import React, { useEffect, useReducer } from "react"
import ChartComponent from "./ChartComponent"
import axios from "axios"
import { getError } from "@/utils/error"
import { ClipLoader } from "react-spinners"
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}
const Dashboard = () => {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/admin/summary`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }

    fetchData()
  }, [])
  return (
    <>
      <main className='p-6 sm:p-10 space-y-6 mt-20'>
        <div className='flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between'>
          <div className='mr-6'>
            <h1 className='text-4xl font-semibold mb-2'>Admin Dashboard</h1>
          </div>
        </div>
        {loading ? (
          <div className='flex justify-center items-center h-full min-h-screen'>
            {" "}
            <ClipLoader color='lightblue' size={80} />
          </div>
        ) : error ? (
          <div className='alert-error'>{error}</div>
        ) : (
          <section className='grid md:grid-cols-2 xl:grid-cols-4 gap-6'>
            <div className='flex items-center p-8 bg-white shadow rounded-lg'>
              <div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6'></div>
              <div>
                <span className='block text-2xl font-bold'>
                  ${summary.ordersPrice}
                </span>
                <span className='block text-gray-500'>Sales</span>
              </div>
            </div>
            <div className='flex items-center p-8 bg-white shadow rounded-lg'>
              <div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6'></div>
              <div>
                <span className='block text-2xl font-bold'>Orders</span>
                <span className='block text-gray-500'>
                  {summary.ordersCount}
                </span>
              </div>
            </div>
            <div className='flex items-center p-8 bg-white shadow rounded-lg'>
              <div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6'></div>
              <div>
                <span className='block text-2xl font-bold'>Products</span>
                <span className='block text-gray-500'>
                  {summary.productsCount}
                </span>
              </div>
            </div>
            <div className='flex items-center p-8 bg-white shadow rounded-lg'>
              <div className='inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6'></div>
              <div>
                <span className='block text-2xl font-bold'>Users</span>
                <span className='block text-gray-500'>
                  {" "}
                  {summary.usersCount}
                </span>
              </div>
            </div>
          </section>
        )}
        <section className='grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6'>
          <div className='flex flex-col md:col-span-3 md:row-span-3 bg-white shadow rounded-lg'>
            <div className='p-4 flex-grow'>
              <div
                style={{ background: "rgb(51,65,85)" }}
                className='flex items-center justify-center w-full h-full text-gray-400 text-3xl font-semibold  border-2  rounded-md'>
                <ChartComponent />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Dashboard
