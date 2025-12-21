import React from 'react'
import logout from '../../utils/auth/logout'
import { useSelector } from 'react-redux'
import { userSelecter } from '../../Store/ReduxSlice/userClise'
import { useNavigate } from 'react-router-dom'

const User = () => {
  const userData = useSelector(userSelecter)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6">

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <img
            src={userData?.profilepicture || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        {/* User Info */}
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Name:</span> {userData?.name || 'N/A'}</p>
          <p><span className="font-semibold">Email:</span> {userData?.email || 'N/A'}</p>
          <p><span className="font-semibold">Phone:</span> {userData?.phoneNumber || 'N/A'}</p>
          <p><span className="font-semibold">Address:</span> {userData?.address || 'N/A'}</p>
          <p>
            <span className="font-semibold">Province:</span>{' '}
            {userData?.province ? (
              userData.province
            ) : (
              <span className="text-red-500">Action needed</span>
            )}
          </p>

          <p>
            <span className="font-semibold">District:</span>{' '}
            {userData?.district ? (
              userData.district
            ) : (
              <span className="text-red-500">Action needed</span>
            )}
          </p>

          <p>
            <span className="font-semibold">City:</span>{' '}
            {userData?.city ? (
              userData.city
            ) : (
              <span className="text-red-500">Action needed</span>
            )}
          </p>


          <p>
            <span className="font-semibold">ZIP / Postal Code:</span>{' '}
            {userData?.zip ? (
              userData.zip
            ) : (
              <span className="text-red-500">Action needed</span>
            )}
          </p>


        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Data
          </button>

          <button
            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
            onClick={logout}
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  )
}

export default User
