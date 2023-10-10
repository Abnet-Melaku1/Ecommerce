import React, { Fragment } from "react"

const Layout = ({ children }) => {
  return (
    <Fragment>
      <div className='flex bg-gray-100 min-h-screen relative'>
        <div className='flex-grow text-gray-800'>{children}</div>
      </div>
    </Fragment>
  )
}

export default Layout
