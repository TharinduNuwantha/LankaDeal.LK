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
import EditUserData from '../Pages/User/EditUserData'
import AddProduct from '../Pages/Admin/Products/Create Products/CreateAddProduct'
import SearchPage from '../Pages/SearchPage/SearchPage'
import CheackOut from '../Pages/CheackOut/CheackOut'
import OrdersPage from '../Pages/OrdersPage/OrdersPage'
import WishlistPage from '../Pages/Wishlist/WishlistPage'



const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
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
            children: [
              {
                index: true,
                element: <CategoryItem />
              },
              {
                path: ':id',
                element: <ItemPage />
              }
            ]
          },
        ]
      },
      {
        element: <UserProtected />,
        children: [
          {
            path: 'profile',
            children: [
              {
                index: true,
                element: <User />,
              }, {
                path: 'edit',
                element: <EditUserData />
              },
              {
                path: 'wishlist',
                element: <WishlistPage />
              }
            ]
          }
        ]
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'checkouts',
        element: <CheackOut />
      },
      {
        path: 'Orders',
        element: <OrdersPage />
      }
    ]
  },
  {
    path: '*',
    element: <UrlNotFound />
  },
  {
    path: '/login',
    element: <Login />
  },


  {
    path: "/admin",
    element: <AdminProtected />,
    children: [
      { index: true, element: <Admin /> },
      { path: "createproduct", element: <AddProduct /> }
    ]
  }
])

const AppRouters = () => {
  return <RouterProvider router={router} />
}

export default AppRouters
