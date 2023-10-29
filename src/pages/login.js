import Layout from "@/components/Layout"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { signIn, useSession } from "next-auth/react"
import { getError } from "@/utils/error"
import { useEffect } from "react"
import { useRouter } from "next/router"
const Login = () => {
  const { data: session } = useSession()

  const router = useRouter()
  const { redirect } = router.query
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/")
    }
  }, [router, session, redirect])
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Login'>
      <main className='w-full h-screen flex flex-col items-center justify-center px-4'>
        <div className='max-w-sm w-full text-gray-600'>
          <div className='text-center '>
            <div className='mt-5 space-y-2'>
              <h3 className='text-gray-800 text-2xl font-bold sm:text-3xl'>
                Sign in
              </h3>
              <p className=''>
                Don&apos;t have an account?{" "}
                <a className='font-medium text-orange-700 hover:text-orange-600'>
                  Create Account
                </a>
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='mt-8 space-y-5'>
            <div>
              <label className='font-medium'>Email</label>
              <input
                type='email'
                {...register("email", {
                  required: "Please Enter Your Email.",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                })}
                className='w-full mt-2 px-3 py-2 text-lg border-2 border-neutral-400 rounded-md outline-none focus:border-orange-700 focus:ring-0 bg-white  transition disabled:bg-neutral-700 disabled:opacity-70 disabled:cursor-not-allowed'
              />
              {errors.email && (
                <small className='text-red-500'>{errors.email.message}</small>
              )}
            </div>
            <div>
              <label className='font-medium'>Password</label>
              <input
                type='password'
                {...register("password", {
                  required: "Please enter password",
                  minLength: {
                    value: 6,
                    message: "password is less than 6 characters",
                  },
                })}
                className='w-full mt-2 px-3 py-2 text-lg border-2 border-neutral-400 rounded-md outline-none focus:border-orange-700 focus:ring-0 bg-white  transition disabled:bg-neutral-700 disabled:opacity-70 disabled:cursor-not-allowed'
              />
              {errors.password && (
                <small className='text-red-500'>
                  {errors.password.message}
                </small>
              )}
            </div>
            <button
              type='submit'
              className='w-full px-4 py-2 text-white font-medium bg-orange-700 hover:bg-orange-600 active:bg-orange-700 rounded-lg duration-150'>
              Sign in
            </button>
          </form>
        </div>
      </main>
    </Layout>
  )
}
export default Login
