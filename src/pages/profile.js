import Layout from "@/components/Layout"
import { getError } from "@/utils/error"
import axios from "axios"
import { signIn, useSession } from "next-auth/react"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

const Profile = () => {
  const { data: session } = useSession()

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("name", session?.user?.name)
    setValue("email", session?.user?.email)
  }, [session?.user, setValue])

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      })
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      toast.success("Profile updated successfully")
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Profile'>
      <main className='w-full h-screen mt-10 flex flex-col items-center justify-center px-4'>
        <div className='max-w-sm w-full text-gray-600'>
          <div className='text-center '>
            <div className='mt-5 space-y-2'>
              <h3 className='text-gray-800 text-2xl font-bold sm:text-3xl'>
                Update Profile
              </h3>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='mt-8 space-y-5'>
            <div>
              <label className='font-medium'>Name</label>
              <input
                type='name'
                {...register("name", {
                  required: "Please enter name",
                })}
                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-orange-700 shadow-sm rounded-lg'
              />
              {errors.name && (
                <small className='text-red-500 tex-base'>
                  {errors.name.message}
                </small>
              )}
            </div>
            <div>
              <label className='font-medium'>Email</label>
              <input
                type='email'
                {...register("email", {
                  required: "Please enter email",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                })}
                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-orange-700 shadow-sm rounded-lg'
              />
              {errors.email && (
                <small classemail='text-red-500 tex-base'>
                  {errors.email.message}
                </small>
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
                    message: "password is more than 5 chars",
                  },
                })}
                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-orange-700 shadow-sm rounded-lg'
              />
              {errors.password && (
                <small classemail='text-red-500 tex-base'>
                  {errors.password.message}
                </small>
              )}
            </div>
            <div>
              <label className='font-medium'>Confirm Password</label>
              <input
                type='password'
                id='confirmPassword'
                {...register("confirmPassword", {
                  required: "Please enter confirm password",
                  validate: (value) => value === getValues("password"),
                  minLength: {
                    value: 6,
                    message:
                      "confirm password should be more than 5 characters",
                  },
                })}
                className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-orange-700 shadow-sm rounded-lg'
              />
              {errors.confirmPassword && (
                <small className='text-red-500 text-base '>
                  {errors.confirmPassword.message}
                </small>
              )}
              {errors.confirmPassword &&
                errors.confirmPassword.type === "validate" && (
                  <small className='text-red-500 text-base'>
                    Password do not match
                  </small>
                )}
            </div>

            <button
              type='submit'
              className='w-full px-4 py-2 text-white font-medium bg-orange-700 hover:bg-orange-600 active:bg-orange-700 rounded-lg duration-150'>
              Update Profile
            </button>
          </form>
        </div>
      </main>
    </Layout>
  )
}
export default Profile
