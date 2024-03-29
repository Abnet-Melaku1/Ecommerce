import Product from "@/models/Product"
import db from "@/utils/db"
import { getToken } from "next-auth/jwt"

const handler = async (req, res) => {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!user || !user.isAdmin) {
    return res.status(401).send("admin signin required")
  }
  if (req.method === "GET") {
    return getHandler(req, res)
  } else if (req.method === "POST") {
    return postHandler(req, res)
  } else {
    return res.status(400).send({ message: "Method not allowed" })
  }
}
const postHandler = async (req, res) => {
  await db.connect()
  const newProduct = new Product({
    name: req.body.name,
    slug: req.body.name + Math.random(),
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: 0,
  })

  const product = await newProduct.save()
  await db.disconnect()
  res.send({ message: "Product created successfully", product })
}
const getHandler = async (req, res) => {
  await db.connect()
  const products = await Product.find({})
  await db.disconnect()
  res.send(products)
}
export default handler
