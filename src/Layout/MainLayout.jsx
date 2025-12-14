import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='w-full min-h-screen flex flex-col bg-gray-50'>
      <Header/>
      <main className='flex-1 pt-5 md:pt-5'>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default MainLayout