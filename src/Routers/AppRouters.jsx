import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'

import User from '../Pages/User/User'
import Home from '../Pages/Home/Home'


const AppRouters = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
              <Route index element={<Home/>}/>
              <Route path='user' element={<User/>}/>
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
