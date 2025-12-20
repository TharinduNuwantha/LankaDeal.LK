import React from 'react'
import logout from '../../utils/auth/logout'
import { useSelector } from 'react-redux'
import { userSelecter } from '../../Store/ReduxSlice/userClise'

const User = () => {
  const userData = useSelector(userSelecter);
  console.log('logd user data => ',userData);
  
  return (
    <div>
      <h1>{userData.name?userData.name:'no user'}</h1>
      <button onClick={logout}>LogOut</button>
    </div>
  )
}

export default User
