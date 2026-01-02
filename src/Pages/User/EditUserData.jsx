import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, userSelecter } from '../../Store/ReduxSlice/userClise'
import { useNavigate } from 'react-router-dom'
// Import the location data
import { locationData } from '../../utils/countryDetails/srilankaProvince'
import { doc, updateDoc } from 'firebase/firestore'
import db from '../../FireBase/firebase'
import { toast } from 'react-toastify'
import { FiCamera, FiLink, FiX, FiSave, FiCopy, FiUpload, FiMapPin, FiNavigation, FiHome, FiUser, FiMail, FiPhone, FiMap, FiGlobe } from 'react-icons/fi'

// --- INTERNAL REUSABLE COMPONENT: Modern Searchable Dropdown ---
const SearchableDropdown = ({ label, name, value, options, onChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapperRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on user input
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    // Mimic the event object structure so the parent handleChange works
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    onChange(e); // Update parent state
    setIsOpen(true); // Ensure dropdown is open while typing
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off" // Disables browser native history
          className={`w-full border border-gray-300 rounded-xl p-3 text-sm transition-all duration-200 ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] focus:outline-none hover:border-gray-400'}`}
        />
        
        {/* Dropdown Arrow */}
        {!disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        )}
        
        {/* The Custom Dropdown List */}
        {isOpen && !disabled && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-fadeIn">
            <ul className="py-1">
              {filteredOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-[#b91c1c] cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-none flex items-center gap-2"
                >
                  <FiMapPin className="text-gray-400" />
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
// -------------------------------------------------------------

const EditUserData = () => {
  const userData = useSelector(userSelecter)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState('device'); // 'device' or 'url'
  const [tempImageUrl, setTempImageUrl] = useState('');

  // Initialize state
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    address: userData?.address || '',
    
    // Location Fields
    province: userData?.province || userData?.state || '', 
    district: userData?.district || '',
    city: userData?.city || '',
    zip: userData?.zip || '',
    country: 'Sri Lanka', 
    
    profilepicture: userData?.profilepicture || '',
    role: userData?.role || '',
    uid: userData?.uid || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Dependency Logic: Clear children when parent changes
      if (name === 'province') {
        updated.district = '';
        updated.city = '';
      } else if (name === 'district') {
        updated.city = '';
      }

      return updated;
    });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL to preview the file immediately
      const objectUrl = URL.createObjectURL(file);
      setTempImageUrl(objectUrl);
    }
  }

  const handleSaveImage = () => {
    if (tempImageUrl) {
        setFormData(prev => ({ ...prev, profilepicture: tempImageUrl }));
        setIsImageModalOpen(false);
        toast.success("Profile picture updated!");
        setTempImageUrl(''); // Reset temp
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.uid) {
        toast.error("Error: User ID is missing");
        return;
    }

    const toastId = toast.loading("Updating profile...");

    try {
        const washingtonRef = doc(db, "users", formData.uid);
        
        const updatedUserData = {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            province: formData.province,
            district: formData.district,
            city: formData.city,
            zip: formData.zip,
            country: formData.country,
            profilepicture: formData.profilepicture
        }

        await updateDoc(washingtonRef, updatedUserData);

        toast.update(toastId, { 
            render: "Profile updated successfully!", 
            type: "success", 
            isLoading: false,
            autoClose: 3000
        });

        dispatch(addUser(updatedUserData))
        setTimeout(() => navigate('/user'), 1500);

    } catch (error) {
        console.error("Error updating document: ", error);
        
        toast.update(toastId, { 
            render: "Update failed: " + error.message, 
            type: "error", 
            isLoading: false,
            autoClose: 5000 
        });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  // --- Derived Lists for Autocomplete ---
  const provinces = Object.keys(locationData);
  
  const districts = formData.province 
    ? Object.keys(locationData[formData.province] || {}) 
    : [];
    
  const cities = (formData.province && formData.district) 
    ? locationData[formData.province][formData.district] || [] 
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#b91c1c] to-[#dc2626] p-6 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
            <img
              src={formData.profilepicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
            />
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="absolute bottom-2 right-2 bg-white p-3 rounded-full text-[#b91c1c] hover:bg-gray-100 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
              title="Change Profile Picture"
            >
              <FiCamera className="w-5 h-5" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">Edit Profile</h1>
          <p className="text-white/90">Update your personal information</p>
        </div>

        {/* Main Form */}
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Basic Information Card */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiUser className="text-[#dc2626]" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiUser className="text-[#b91c1c]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] focus:outline-none hover:border-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiMail className="text-[#b91c1c]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] focus:outline-none hover:border-gray-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiPhone className="text-[#b91c1c]" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] focus:outline-none hover:border-gray-400"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Card */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiHome className="text-[#dc2626]" />
                Address Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiMapPin className="text-[#b91c1c]" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, Street name"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] focus:outline-none hover:border-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SearchableDropdown 
                    label="Province"
                    name="province"
                    value={formData.province}
                    options={provinces}
                    onChange={handleChange}
                    placeholder="Select Province..."
                  />

                  <SearchableDropdown 
                    label="District"
                    name="district"
                    value={formData.district}
                    options={districts}
                    onChange={handleChange}
                    disabled={!formData.province}
                    placeholder="Select District..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SearchableDropdown 
                    label="City"
                    name="city"
                    value={formData.city}
                    options={cities}
                    onChange={handleChange}
                    disabled={!formData.district}
                    placeholder="Select City..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] focus:outline-none hover:border-gray-400"
                      placeholder="XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiGlobe className="text-[#b91c1c]" />
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    readOnly
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* User ID Section */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                User Information
              </h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => copyToClipboard(formData.uid)}
                >
                  <FiCopy />
                  Copy UID
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border-2 border-gray-200 flex items-center justify-center gap-2 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FiSave className="text-lg" />
                Save Changes
              </button>
            </div><br/><br/>
          </form>
        </div>
      </div>

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiCamera className="text-[#b91c1c]" />
                Update Profile Photo
              </h3>
              <button 
                onClick={() => setIsImageModalOpen(false)} 
                className="text-gray-500 hover:text-[#b91c1c] transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b">
              <button 
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${imageTab === 'device' ? 'text-[#b91c1c] border-b-2 border-[#b91c1c]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setImageTab('device')}
              >
                <FiUpload />
                Upload Device
              </button>
              <button 
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${imageTab === 'url' ? 'text-[#b91c1c] border-b-2 border-[#b91c1c]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setImageTab('url')}
              >
                <FiLink />
                Image URL
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {imageTab === 'device' ? (
                <div className="text-center">
                  <label className="cursor-pointer block border-3 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition-all duration-200 hover:border-[#b91c1c]">
                    <div className="text-gray-400 mb-3">
                      <FiUpload className="w-12 h-12 mx-auto" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Click to select file</span>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paste Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] outline-none"
                      placeholder="https://example.com/image.png"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Preview */}
              {tempImageUrl && (
                <div className="mt-6 flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                  <img 
                    src={tempImageUrl} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => setIsImageModalOpen(false)} 
                className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveImage} 
                disabled={!tempImageUrl}
                className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${!tempImageUrl ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-[#b91c1c] to-[#dc2626] text-white hover:shadow-lg hover:shadow-red-200'}`}
              >
                <FiSave />
                Set Profile Picture
              </button>
            </div>
          </div>
        </div>
      )} 
    </div>
  )
}

export default EditUserData