import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { userSelecter } from '../Store/ReduxSlice/userClise';

const UserProtected = () => {
  const userData = useSelector(userSelecter)
  console.log('current user from profile => ',userData);
  
  return userData?.name?<Outlet/>:<Navigate to='/login'/>
}

export default UserProtected
