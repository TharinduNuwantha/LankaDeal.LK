import React from 'react'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'

import User from '../Pages/User/User'
import Home from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import UserProtected from './UserProtected'
import Category from '../Pages/Category/Category'


const router = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
            {
        path:'category',
        element:<Category/>
      },
      {
        element:<UserProtected/>,
        children:[
          {
            path:'user',
            element:<User/>
          }
        ]
      }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  }
])

const AppRouters = () => {
  return <RouterProvider router={router}/>
}

export default AppRouters
