import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'

import User from '../Pages/User/User'
import Home from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import UserProtected from './UserProtected'
import Category from '../Pages/Category/Category'
import CategoryItem from '../Pages/CategoryItem/CategoryItem'
import ItemPage from '../Pages/ItemPage/ItemPage'
import AdminProtected from './AdminProtected'
import Admin from '../Pages/Admin/Admin'
import UrlNotFound from '../Pages/404/UrlNotFound'



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
              path: 'category',
              children: [
                {
                  index: true,
                  element: <Category />
                },
                {
                  path: ':categoryId',
                  children:[
                    {
                      index:true,
                      element: <CategoryItem />
                    },
                    {
                      path:':itemId',
                      element:<ItemPage/>
                    }
                  ]
                },
              ]
            },
      {
        element:<UserProtected/>,
        children:[
          {
            path:'profile',
            element:<User/>
          }
        ]
      }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/404',
    element:<UrlNotFound/>
  },

  {
    element:<AdminProtected/>,
    children:[
      {
        path:'/admin',
        element:<Admin/>
      }
    ]
  }
])

const AppRouters = () => {
  return <RouterProvider router={router}/>
}

export default AppRouters
