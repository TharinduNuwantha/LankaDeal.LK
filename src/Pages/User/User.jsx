import React from 'react'
import logout from '../../utils/auth/logout'

const User = () => {
  return (
    <div>
      <button onClick={logout}>LogOut</button>
    </div>
  )
}

export default User
