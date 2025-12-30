import React from 'react'
import logout from '../../utils/auth/logout'
import { useSelector } from 'react-redux'
import { userSelecter } from '../../Store/ReduxSlice/userClise'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiLogOut, FiUser, FiMail, FiPhone, FiMapPin, FiMap, FiNavigation, FiHome } from 'react-icons/fi'
import './User.css'

const User = () => {
  const userData = useSelector(userSelecter)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#b91c1c] to-[#dc2626] p-6 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
            <img
              src={userData?.profilepicture || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">{userData?.name || 'User Name'}</h1>
          <p className="text-white/90">{userData?.email || 'user@example.com'}</p>
        </div>

        {/* User Info Cards */}
        <div className="p-6 space-y-4">
          {/* Contact Info Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="text-[#dc2626]" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <FiMail className="text-[#b91c1c]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{userData?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <FiPhone className="text-[#b91c1c]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{userData?.phoneNumber || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Info Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiHome className="text-[#dc2626]" />
              Address Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-[#b91c1c]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{userData?.address || 
                    <span className="text-red-500 font-medium">Action needed</span>}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <FiMap className="text-[#b91c1c] text-xs" />
                    Province
                  </p>
                  <p className={`font-medium ${userData?.province ? 'text-gray-800' : 'text-red-500'}`}>
                    {userData?.province || 'Required'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <FiNavigation className="text-[#b91c1c] text-xs" />
                    District
                  </p>
                  <p className={`font-medium ${userData?.district ? 'text-gray-800' : 'text-red-500'}`}>
                    {userData?.district || 'Required'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">City</p>
                  <p className={`font-medium ${userData?.city ? 'text-gray-800' : 'text-red-500'}`}>
                    {userData?.city || 'Required'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">ZIP Code</p>
                  <p className={`font-medium ${userData?.zip ? 'text-gray-800' : 'text-red-500'}`}>
                    {userData?.zip || 'Required'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 pt-2">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex-1 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FiEdit2 className="text-lg" />
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border-2 border-gray-200 flex items-center justify-center gap-2 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50 active:scale-[0.98]"
            >
              <FiLogOut className="text-lg" />
              Log Out
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${userData?.email ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">
                {userData?.email ? 'Profile Complete' : 'Profile Incomplete'}
              </span>
            </div>
            <span className="text-[#b91c1c] font-semibold">
              {userData?.email ? 'Verified' : 'Verification Needed'}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default User