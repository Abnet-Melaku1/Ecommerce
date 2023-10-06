import React from "react"
import Layout from "../components/Layout"
import Image from "next/image"

export default function Unauthorized() {
  return (
    <Layout title='Unauthorized Page'>
      <div className='h-screen'>
        <Image alt='403' fill src='/The-Bouncer-at-403-Page.gif' />
      </div>
    </Layout>
  )
}
