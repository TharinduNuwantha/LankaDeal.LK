import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'

import User from '../Pages/User/User'
import Home from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import UserProtected from './UserProtected'


const AppRouters = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
              <Route index element={<Home/>}/>
              
              <Route element={<UserProtected/>}>
                <Route path='user' element={<User/>}/>
              </Route>
          </Route>
          <Route path='/login' element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouters
