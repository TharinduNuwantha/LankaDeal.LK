import React, { useState, useEffect } from 'react';

const AddProduct = () => {
  // --- 1. State for Category Selection ---
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  
  // --- 2. State for Product Details ---
  const [formData, setFormData] = useState({
    title: '',
    description: '', // Added description as it's standard
    price: '',
    originalPrice: '',
    discount: '',
    stockCount: '',
    imageUrl: '',
    fastDelivery: false,
    inStock: true,
    isFeatured: false,
  });

  const categoryData = {
  "Electronics": {
    "Audio & Video": [
      "Headphones & Earphones",
      "Speakers & Sound Systems",
      "Televisions & Projectors",
      "Home Theater Systems",
      "Streaming Devices"
    ],
    "Mobile & Accessories": [
      "Smartphones",
      "Tablets",
      "Mobile Cases & Covers",
      "Power Banks",
      "Screen Protectors",
      "Chargers & Cables",
      "Selfie Sticks & Tripods"
    ],
    "Computers & Laptops": [
      "Laptops",
      "Desktop Computers",
      "Monitors",
      "Keyboards & Mice",
      "Printers & Scanners",
      "Computer Components (RAM, SSD, GPU)",
      "Networking Devices"
    ],
    "Wearable Technology": [
      "Smart Watches",
      "Fitness Trackers",
      "VR Headsets",
      "Smart Glasses"
    ],
    "Gaming": [
      "Gaming Consoles",
      "Gaming Laptops & PCs",
      "Gaming Accessories",
      "Video Games",
      "Gaming Chairs"
    ],
    "Camera & Photography": [
      "DSLR & Mirrorless Cameras",
      "Action Cameras",
      "Camera Lenses",
      "Camera Accessories",
      "Drones"
    ],
    "Home Appliances": [
      "Refrigerators",
      "Washing Machines",
      "Air Conditioners",
      "Microwave Ovens",
      "Vacuum Cleaners"
    ]
  },
  "Fashion & Clothing": {
    "Men's Clothing": [
      "T-Shirts & Polos",
      "Shirts & Formal Wear",
      "Jeans & Trousers",
      "Shorts & Trackpants",
      "Ethnic Wear (Kurtas)",
      "Winter Wear"
    ],
    "Women's Clothing": [
      "Dresses & Gowns",
      "Tops & Tees",
      "Jeans & Trousers",
      "Ethnic Wear (Sarees, Salwar Suits)",
      "Skirts & Shorts",
      "Winter Wear"
    ],
    "Kids & Infants": [
      "Boys Clothing",
      "Girls Clothing",
      "Baby Clothing",
      "School Uniforms"
    ],
    "Footwear": [
      "Casual Shoes",
      "Sports Shoes",
      "Formal Shoes",
      "Sandals & Flip Flops",
      "Ethnic Footwear"
    ],
    "Accessories": [
      "Bags & Backpacks",
      "Watches",
      "Sunglasses",
      "Belts & Wallets",
      "Jewelry",
      "Hats & Caps"
    ]
  },
  "Home & Kitchen": {
    "Furniture": [
      "Sofas & Couches",
      "Beds & Mattresses",
      "Dining Sets",
      "Office Furniture",
      "Storage Solutions"
    ],
    "Kitchen & Dining": [
      "Cookware & Bakeware",
      "Cutlery & Kitchen Tools",
      "Dinnerware Sets",
      "Kitchen Appliances",
      "Storage Containers"
    ],
    "Home Decor": [
      "Wall Art & Paintings",
      "Clocks",
      "Mirrors",
      "Showpieces",
      "Rugs & Carpets",
      "Curtains & Blinds"
    ],
    "Bed & Bath": [
      "Bed Linens",
      "Pillows & Cushions",
      "Towels",
      "Bathroom Accessories"
    ],
    "Lighting": [
      "LED Lights",
      "Table Lamps",
      "Decorative Lighting",
      "Smart Lighting"
    ]
  },
  "Beauty & Personal Care": {
    "Skincare": [
      "Face Wash & Cleansers",
      "Moisturizers & Creams",
      "Serums & Toners",
      "Face Masks",
      "Sunscreens"
    ],
    "Makeup": [
      "Foundations & Concealers",
      "Lipsticks & Lip Care",
      "Eye Makeup",
      "Makeup Brushes & Tools"
    ],
    "Hair Care": [
      "Shampoos & Conditioners",
      "Hair Oils & Serums",
      "Styling Products",
      "Hair Color"
    ],
    "Fragrances": [
      "Perfumes",
      "Deodorants",
      "Body Sprays"
    ],
    "Personal Care": [
      "Body Wash & Soaps",
      "Oral Care",
      "Men's Grooming",
      "Feminine Hygiene"
    ]
  },
  "Sports & Fitness": {
    "Fitness Equipment": [
      "Treadmills & Ellipticals",
      "Weights & Dumbbells",
      "Yoga Mats & Accessories",
      "Fitness Trackers",
      "Home Gyms"
    ],
    "Sports Gear": [
      "Cricket Equipment",
      "Football/Soccer",
      "Badminton",
      "Tennis",
      "Basketball",
      "Cycling"
    ],
    "Outdoor & Adventure": [
      "Camping Equipment",
      "Trekking Gear",
      "Water Sports"
    ],
    "Gym Wear": [
      "Sports Shoes"
    ]
  },
  "Books & Media": {
    "Books": [
      "Fiction & Literature",
      "Academic & Textbooks",
      "Children's Books",
      "Self-Help & Business",
      "Comics & Manga"
    ],
    "Music & Movies": [
      "CDs & DVDs",
      "Blu-rays",
      "Vinyl Records",
      "Musical Instruments"
    ],
    "Stationery": [
      "Pens & Writing",
      "Notebooks & Diaries",
      "Art Supplies",
      "Office Supplies"
    ]
  },
  "Health & Wellness": {
    "Nutrition & Supplements": [
      "Protein Supplements",
      "Vitamins & Minerals",
      "Weight Management",
      "Health Foods"
    ],
    "Medical Supplies": [
      "First Aid Kits",
      "Thermometers",
      "BP Monitors",
      "Mobility Aids"
    ],
    "Wellness": [
      "Essential Oils",
      "Aromatherapy",
      "Massage Equipment",
      "Meditation Accessories"
    ]
  },
  "Groceries & Daily Needs": {
    "Food & Beverages": [
      "Snacks & Biscuits",
      "Beverages",
      "Cooking Essentials",
      "Ready-to-Eat"
    ],
    "Household Supplies": [
      "Cleaning Products",
      "Laundry Needs",
      "Pest Control",
      "Disposables"
    ]
  }
};

  // --- 3. Handle Category Changes ---
  const handleMainChange = (e) => {
    setSelectedMain(e.target.value);
    setSelectedSub('');   // Reset sub when main changes
    setSelectedChild(''); // Reset child when main changes
  };

  const handleSubChange = (e) => {
    setSelectedSub(e.target.value);
    setSelectedChild(''); // Reset child when sub changes
  };

  // --- 4. Handle Input Changes ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- 5. Auto-Calculate Discount (Optional Helper) ---
  useEffect(() => {
    if (formData.price && formData.originalPrice) {
      const p = parseFloat(formData.price);
      const op = parseFloat(formData.originalPrice);
      if (op > 0) {
        const disc = Math.round(((op - p) / op) * 100);
        setFormData(prev => ({ ...prev, discount: disc.toString() + "%" }));
      }
    }
  }, [formData.price, formData.originalPrice]);

  // --- 6. Submit Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Generate the Category Path
    // Note: We replace spaces with underscores to match your format if needed
    // e.g., "Audio & Video" -> "Audio_and_Video"
    const cleanPath = (str) => str.replace(/\s&\s/g, '_and_').replace(/\s/g, '_');
    
    const categoryPath = `/category/${cleanPath(selectedMain)}/${cleanPath(selectedSub)}/${cleanPath(selectedChild)}`;

    // 2. Construct the Final Object
    const finalProductData = {
      categoryPath: categoryPath,
      title: formData.title,
      description: formData.description,
      price: formData.price, // string as requested
      originalPrice: formData.originalPrice, // string as requested
      discount: formData.discount, // string
      stockCount: formData.stockCount,
      imageUrl: formData.imageUrl,
      fastDelivery: formData.fastDelivery,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,
      rating: "0", // Default for new product
      reviewCount: "0", // Default for new product
      createdAt: new Date().toISOString()
    };

    console.log("Saving to Firebase:", finalProductData);
    alert("Check Console for Output");
    // Here you would call: await set(ref(db, 'products/' + productId), finalProductData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- Category Section --- */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg">1. Select Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Main Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Main Category</label>
              <select 
                className="w-full p-2 border rounded" 
                value={selectedMain} 
                onChange={handleMainChange} 
                required
              >
                <option value="">Select Main...</option>
                {Object.keys(categoryData).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Sub Category</label>
              <select 
                className="w-full p-2 border rounded" 
                value={selectedSub} 
                onChange={handleSubChange} 
                disabled={!selectedMain}
                required
              >
                <option value="">Select Sub...</option>
                {selectedMain && Object.keys(categoryData[selectedMain]).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Child Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Item Type</label>
              <select 
                className="w-full p-2 border rounded" 
                value={selectedChild} 
                onChange={(e) => setSelectedChild(e.target.value)} 
                disabled={!selectedSub}
                required
              >
                <option value="">Select Type...</option>
                {selectedSub && categoryData[selectedMain][selectedSub].map(child => (
                  <option key={child} value={child}>{child}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Preview Path */}
          {selectedChild && (
            <div className="mt-2 text-sm text-green-600">
              <strong>Path:</strong> {`/category/${selectedMain}/${selectedSub}/${selectedChild}`.replace(/\s&\s/g, '_and_').replace(/\s/g, '_')}
            </div>
          )}
        </div>

        {/* --- Product Details Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Title</label>
              <input 
                type="text" name="title" required
                className="w-full p-2 border rounded" 
                value={formData.title} onChange={handleInputChange}
                placeholder="e.g. 4K Ultra HD Smart TV"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input 
                type="text" name="imageUrl" required
                className="w-full p-2 border rounded" 
                value={formData.imageUrl} onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea 
                name="description" rows="3"
                className="w-full p-2 border rounded" 
                value={formData.description} onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* Right Column (Pricing) */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Original Price</label>
                <input 
                  type="number" name="originalPrice" required
                  className="w-full p-2 border rounded" 
                  value={formData.originalPrice} onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Selling Price</label>
                <input 
                  type="number" name="price" required
                  className="w-full p-2 border rounded" 
                  value={formData.price} onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Discount (%)</label>
                <input 
                  type="text" name="discount" readOnly
                  className="w-full p-2 border rounded bg-gray-100" 
                  value={formData.discount}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Stock Count</label>
                <input 
                  type="number" name="stockCount" required
                  className="w-full p-2 border rounded" 
                  value={formData.stockCount} onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Toggles Section --- */}
        <div className="flex gap-6 p-4 border rounded bg-gray-50">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" name="fastDelivery" 
              checked={formData.fastDelivery} onChange={handleInputChange}
              className="w-5 h-5"
            />
            <span>Fast Delivery</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" name="inStock" 
              checked={formData.inStock} onChange={handleInputChange}
              className="w-5 h-5"
            />
            <span>In Stock</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" name="isFeatured" 
              checked={formData.isFeatured} onChange={handleInputChange}
              className="w-5 h-5 text-yellow-600"
            />
            <span>Featured Product</span>
          </label>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Product to Firebase
        </button>

      </form>
    </div>
  );
};

export default AddProduct;