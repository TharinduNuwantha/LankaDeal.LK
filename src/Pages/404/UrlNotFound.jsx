import React from 'react'
import { useLocation } from 'react-router-dom'

const UrlNotFound = () => {
  const {pathname} = useLocation()
  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-center`}>
        <h1 className={`text-6xl font-bold`}>404 page not found</h1><br />
        <p>{`The requested URL ${pathname} was not found on this server.`}</p>
    </div>
  )
}

export default UrlNotFound
