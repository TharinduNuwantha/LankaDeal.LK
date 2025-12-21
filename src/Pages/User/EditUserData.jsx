import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, userSelecter } from '../../Store/ReduxSlice/userClise'
import { useNavigate } from 'react-router-dom'
// Import the location data
import { locationData } from '../../utils/countryDetails/srilankaProvince'
import { doc, updateDoc } from 'firebase/firestore'
import db from '../../FireBase/firebase'
import { toast } from 'react-toastify'

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
    <div className="relative mb-1" ref={wrapperRef}>
      <label className="block font-semibold mb-1">{label}</label>
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
          className={`w-full border rounded-lg p-2 text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none'}`}
        />
        
        {/* The Custom Dropdown List */}
        {isOpen && !disabled && filteredOptions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => handleSelect(opt)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
// -------------------------------------------------------------

const EditUserData = () => {
  const userData = useSelector(userSelecter)
  const dispatch = useDispatch()

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
      
      // NOTE: In a real app, you would upload 'file' to Firebase Storage here
      // and get the download URL. For now, we are using the ObjectURL or Base64.
    }
  }

  const handleSaveImage = () => {
    if (tempImageUrl) {
        setFormData(prev => ({ ...prev, profilepicture: tempImageUrl }));
        setIsImageModalOpen(false);
        setTempImageUrl(''); // Reset temp
    }
  }

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.uid) {
        toast.error("Error: User ID is missing"); // Red Error Toast
        return;
    }

    // Optional: Show a "Updating..." toast that we can update later
    const toastId = toast.loading("Updating profile...");

    try {
        const washingtonRef = doc(db, "users", formData.uid);
        console.log('image link ====> ',setTempImageUrl)
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

        // Update the loading toast to Success (Green)

        toast.update(toastId, { 
            render: "Profile updated successfully!", 
            type: "success", 
            isLoading: false,
            autoClose: 3000
        });

        dispatch(addUser(updatedUserData))

    } catch (error) {
        console.error("Error updating document: ", error);
        
        // Update the loading toast to Error (Red)
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
    alert('Copied to clipboard!')
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
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-md p-6">

<div className="flex justify-center mb-6 relative">
            <div className="relative group">
                <img
                    src={formData.profilepicture || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                
                {/* --- THIS IS THE MISSING BUTTON --- */}
                <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 shadow-md transition-all hover:scale-110"
                    title="Change Profile Picture"
                >
                    {/* SVG Icon for Edit/Camera */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </button>
                {/* ---------------------------------- */}
                
            </div>
        </div>
{/* --- IMAGE UPLOAD POPUP MODAL --- */}
        {isImageModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeIn">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Update Profile Photo</h3>
                        <button onClick={() => setIsImageModalOpen(false)} className="text-gray-500 hover:text-red-500">
                             ✕
                        </button>
                    </div>

                    {/* Modal Tabs */}
                    <div className="flex border-b">
                        <button 
                            className={`flex-1 py-3 text-sm font-medium ${imageTab === 'device' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            onClick={() => setImageTab('device')}
                        >
                            Upload Device
                        </button>
                        <button 
                            className={`flex-1 py-3 text-sm font-medium ${imageTab === 'url' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            onClick={() => setImageTab('url')}
                        >
                            Image URL
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                        {imageTab === 'device' ? (
                            <div className="text-center">
                                <label className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition">
                                    <div className="text-gray-400 mb-2">📂</div>
                                    <span className="text-sm text-gray-600">Click to select file</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paste Image Link</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://example.com/image.png"
                                    onChange={(e) => setTempImageUrl(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Preview */}
                        {tempImageUrl && (
                            <div className="mt-4 flex justify-center">
                                <img src={tempImageUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border shadow-sm" />
                            </div>
                        )}
                    </div>

                    {/* Modal Actions */}
                    <div className="p-4 border-t flex gap-3">
                        <button onClick={() => setIsImageModalOpen(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                        <button onClick={handleSaveImage} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-md">Set Image</button>
                    </div>
                </div>
            </div>
        )}
        {/* User Edit Form */}
        <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
          
          {/* Basic Info */}
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, Street name"
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* --- Sri Lanka Location Fields (Modern UI) --- */}
          
          {/* Province & District Row */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* City & Zip Row */}
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block font-semibold mb-1">ZIP / Postal Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Country (Fixed) */}
          <div>
            <label className="block font-semibold mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              readOnly
              className="w-full border rounded-lg p-2 text-sm bg-gray-200 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Hidden Role & UID Copy Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg text-sm hover:bg-gray-400 transition"
              onClick={() => copyToClipboard(formData.uid)}
            >
              Copy UID
            </button>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition shadow-lg"
            >
              Save Changes
            </button>
          </div>
          <br /><br />
        </form>
      </div>
    </div>
  )
}

export default EditUserData