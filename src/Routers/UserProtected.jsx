import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { userSelecter, isLoadingSelector } from '../Store/ReduxSlice/userClise';

const UserProtected = () => {
  const userData = useSelector(userSelecter)
  const isLoading = useSelector(isLoadingSelector)
  console.log('current user from profile => ',userData);
  
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }
  
  const isAuthenticated = userData?.name && userData.name !== '' && userData.name !== 'default' && userData.name !== 'no-user';
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
}

export default UserProtected
