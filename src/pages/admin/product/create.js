import Layout from "@/components/Layout"
import { getError } from "@/utils/error"
import axios from "axios"
import { useRouter } from "next/router"
import { useReducer } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
function reducer(state, action) {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true }
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false }
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false }
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" }
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      }
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload }

    default:
      state
  }
}
export default function CreateProduct() {
  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const router = useRouter()
  const uploadHandler = async (e, imageField = "image") => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
    try {
      dispatch({ type: "UPLOAD_REQUEST" })
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign")

      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("signature", signature)
      formData.append("timestamp", timestamp)
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
      const { data } = await axios.post(url, formData)
      dispatch({ type: "UPLOAD_SUCCESS" })
      setValue(imageField, data.secure_url)
      toast.success("File uploaded successfully")
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) })
      toast.error(getError(err))
    }
  }
  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: "CREATE_REQUEST" })
      await axios.post(`/api/admin/products`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      })
      dispatch({ type: "CREATE_SUCCESS" })
      toast.success("Product created successfully")
      router.push("/admin/products")
    } catch (err) {
      dispatch({ type: "CREATE_FAIL", payload: getError(err) })
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Create Product'>
      <section className='max-w-4xl  p-10 mx-auto bg-orange-700 bg-opacity-90 rounded-md shadow-md dark:bg-gray-800 mt-28'>
        <h1 className='text-xl font-bold text-white capitalize dark:text-white'>
          Create Product
        </h1>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-white dark:text-gray-200' for='name'>
                Name
              </label>
              <input
                id='name'
                type='text'
                autoFocus
                {...register("name", {
                  required: "Please enter name",
                })}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring'
              />
              {errors.name && (
                <div className='text-red-500 text-base'>
                  {errors.name.message}
                </div>
              )}
            </div>

            <div>
              <label className='text-white dark:text-gray-200' for='slug'>
                Slug
              </label>
              <input
                id='slug'
                type='text'
                {...register("slug", {
                  required: "Please enter slug",
                })}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring'
              />
              {errors.slug && (
                <div className='text-red-500 text-base'>
                  {errors.slug.message}
                </div>
              )}
            </div>

            <div>
              <label className='text-white dark:text-gray-200' for='price'>
                Price
              </label>
              <input
                id='price'
                type='text'
                {...register("price", {
                  required: "Please enter price",
                })}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring'
              />
              {errors.price && (
                <div className='text-red-500 text-base'>
                  {errors.price.message}
                </div>
              )}
            </div>

            <div>
              <label className='text-white dark:text-gray-200' for='category'>
                category
              </label>
              <input
                id='category'
                type='text'
                {...register("category", {
                  required: "Please enter category",
                })}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring'
              />
              {errors.category && (
                <div className='text-red-500 text-base'>
                  {errors.category.message}
                </div>
              )}
            </div>
            <div>
              <label className='text-white dark:text-gray-200' for='Count'>
                Count
              </label>
              <input
                id='countInStock'
                type='text'
                {...register("countInStock", {
                  required: "Please enter countInStock",
                })}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring'
              />
              {errors.countInStock && (
                <div className='text-red-500 text-base'>
                  {errors.countInStock.message}
                </div>
              )}
            </div>
            <div>
              <label className='text-white dark:text-gray-200' for='brand'>
                Brand
              </label>
              <input
                id='brand'
                type='text'
                {...register("brand", {
                  required: "Please enter brand",
                })}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring'
              />
              {errors.brand && (
                <div className='text-red-500'>{errors.brand.message}</div>
              )}
            </div>
            <div>
              <label
                className='text-white dark:text-gray-200'
                for='description'>
                Description
              </label>
              <textarea
                id='description'
                type='textarea'
                {...register("description", {
                  required: "Please enter description",
                })}
                class='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring'></textarea>
              {errors.description && (
                <div className='text-red-500'>{errors.description.message}</div>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-white'>
                Image
              </label>
              <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                <div className='space-y-1 text-center'>
                  <svg
                    className='mx-auto h-12 w-12 text-white'
                    stroke='currentColor'
                    fill='none'
                    viewBox='0 0 48 48'
                    aria-hidden='true'>
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                  <div className='flex text-sm text-gray-600'>
                    <label
                      for='imageFile'
                      className='relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500'>
                      <span className=''>Upload a file</span>
                      <input
                        id='imageFile'
                        name='imageFile'
                        type='file'
                        onChange={uploadHandler}
                        className='sr-only'
                      />
                    </label>
                    <p className='pl-1 text-white'>or drag and drop</p>
                    {loadingUpload && <div>Uploading....</div>}
                  </div>
                  <p className='text-xs text-white'>PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button
              type='submit'
              style={{ background: "rgb(51,65,85)" }}
              className='px-6 py-2 leading-5 text-white transition-colors duration-200 transform  rounded-md focus:outline-none focus:bg-gray-600'>
              Create
            </button>
          </div>
        </form>
      </section>
    </Layout>
  )
}
CreateProduct.auth = { adminOnly: true }
