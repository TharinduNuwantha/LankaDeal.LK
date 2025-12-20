import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeUser } from '../../Store/ReduxSlice/userClise'
import logout from '../../utils/auth/logout'

const Admin = () => {
    const dispatch = useDispatch()
    const navigater = useNavigate();

  return (
    <div>
        <h1 >Admin</h1>  
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Admin
