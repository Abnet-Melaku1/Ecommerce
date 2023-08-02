import Layout from "@/components/Layout"
import data from "@/utils/data"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Rating } from "@smastrom/react-rating"
import { BsArrowLeft } from "react-icons/bs"
import "@smastrom/react-rating/style.css"
const productScreen = () => {
  const { query } = useRouter()
  const { slug } = query
  console.log(slug)
  const product = data.find((product) => product.slug === slug)

  if (!product) {
    ;<div>not found</div>
  }

  return (
    <Layout>
      <div className='container mx-auto'>
        <Link href={"/"} className='ml-3'>
          <BsArrowLeft size={35} />
        </Link>
        <div className='flex flex-col md:flex-row justify-around rounded-lg border border-neutral-200 bg-white p-8 px-4 dark:border-neutral-800 dark:bg-black md:p-12 container mx-auto gap-3'>
          <div className='md:w-2/3 flex items-center justify-center'>
            <Image src={product?.image} width={400} height={600} />
          </div>
          <div className='mb-6 flex flex-col border-b pb-6 dark:border-neutral-700 gap-6 md:w-2/6'>
            <p className='mb-2 text-4xl font-medium'>{product?.name}</p>
            <button className='mr-auto w-auto rounded-full bg-orange-700 p-2 text-sm text-white opacity-90'>
              <span>$</span>
              {product?.price} <span>USD</span>
            </button>
            <h2 className='text-gray-600 text-base'>{product?.description}.</h2>

            <span className='text-gray-600 text-base flex items-center gap-1'>
              <span className='text-base font-semibold'>{product?.rating}</span>
              <Rating
                style={{ maxWidth: 180 }}
                readOnly
                value={product?.rating}
              />{" "}
              <span className='text-blue-800 text-base font-semibold'>
                {" "}
                {product?.numReviews} Ratings
              </span>
            </span>
            <button className='relative flex w-full items-center justify-center rounded-full bg-orange-700 p-4 tracking-wide text-white hover:opacity-90'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default productScreen
