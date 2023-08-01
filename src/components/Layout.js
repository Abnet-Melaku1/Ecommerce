import Head from "next/head"
import Nav from "./Nav"

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? title : "Pazion Ecommerce App"}</title>
        <meta name='description' content='Ecommerce Website' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/logo-no-background.svg' />
      </Head>
      <div className='flex justify-between min-h-screen flex-col'>
        <header>
          <Nav />
        </header>
        <main>{children}</main>
        <footer>footer</footer>
      </div>
    </>
  )
}
export default Layout
