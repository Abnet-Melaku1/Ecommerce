import { getToken } from "next-auth/jwt"

const handler = async (req, res) => {
  const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!user) {
    return res.status(401).send("signin required")
  }
  res.send(process.env.PAYPAL_CLIENT_ID || "sb")
}
export default handler
