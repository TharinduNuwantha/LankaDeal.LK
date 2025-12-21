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

        const updatedUserData = {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            province: formData.province,
            district: formData.district,
            city: formData.city,
            zip: formData.zip,
            country: formData.country
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

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <img
            src={formData.profilepicture || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

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