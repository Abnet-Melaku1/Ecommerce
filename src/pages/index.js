import Layout from "@/components/Layout"
import Product from "@/models/Product"
import ProductList from "@/components/ProductList"
import db from "@/utils/db"

export default function Home({ products }) {
  return (
    <>
      <Layout title='Home'>
        <ProductList products={products} />
      </Layout>
    </>
  )
}
export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find().lean()
  const featuredProducts = await Product.find({ isFeatured: true }).lean()
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  }
}
