import React, { useRef, useState } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import Loarding from '../Pages/Loarding/Loarding'
import ModalPayment from '../modals/ModalPayment'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
    const paymentModelRef = useRef()
  const[loading,setLoarding] = useState(false);
  if(loading){
    return <Loarding/>
  }
  return (
    <div className='w-full min-h-screen flex flex-col bg-gray-50'>
      <ModalPayment ref={paymentModelRef}/>
      <Header paymentModelRef={paymentModelRef}/>
      <main className='flex-1 pt-5 md:pt-5'>
        <Outlet/>
      </main>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
      />
      <Footer/>
    </div>
  )
}

export default MainLayout