import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
// Adjust path as needed
import './CreateProduct.css'
import {
  CloudUpload as CloudUploadIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LocalShipping as ShippingIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FeaturedVideo as FeaturedIcon,
  BatteryFull as StockIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { CircularProgress, LinearProgress, Alert, Snackbar } from '@mui/material';
import db from '../../../../FireBase/firebase';
import App from '../../../../App';

const AddProduct = () => {
  const navigate = useNavigate();
  const storage = getStorage(App);
  
  // Product form state
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    stockCount: '',
    rating: '',
    reviewCount: '',
    categoryPath: '',
    imageUrl: '',
    additionalImages: [],
    inStock: true,
    isFeatured: false,
    fastDelivery: false,
    specifications: {
      brand: '',
      color: '',
      size: '',
      weight: '',
      material: '',
      warranty: '1 Year',
      dimensions: ''
    },
    features: []
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showFeaturesInput, setShowFeaturesInput] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  // Category structure based on your example
  const categories = {
    'ELECTRONICS': {
      'Audio & Video': ['Headphones & Earphones', 'Speakers & Sound Systems', 'Televisions & Projectors', 'Home Theater Systems', 'Streaming Devices'],
      'Mobile & Accessories': ['Smartphones', 'Tablets', 'Mobile Cases & Covers', 'Power Banks', 'Screen Protectors', 'Chargers & Cables', 'Selfie Sticks & Tripods'],
      'Computers & Laptops': ['Laptops', 'Desktop Computers', 'Monitors', 'Keyboards & Mice', 'Printers & Scanners', 'Computer Components', 'Networking Devices'],
      'Wearable Technology': ['Smart Watches', 'Fitness Trackers', 'VR Headsets', 'Smart Glasses'],
      'Gaming': ['Gaming Consoles', 'Gaming Laptops & PCs', 'Gaming Accessories', 'Video Games', 'Gaming Chairs'],
      'Camera & Photography': ['DSLR & Mirrorless Cameras', 'Action Cameras', 'Camera Lenses', 'Camera Accessories', 'Drones'],
      'Home Appliances': ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwave Ovens', 'Vacuum Cleaners']
    },
    'FASHION & CLOTHING': {
      "Men's Clothing": ['T-Shirts & Polos', 'Shirts & Formal Wear', 'Jeans & Trousers', 'Shorts & Trackpants', 'Ethnic Wear', 'Winter Wear'],
      "Women's Clothing": ['Dresses & Gowns', 'Tops & Tees', 'Jeans & Trousers', 'Ethnic Wear', 'Skirts & Shorts', 'Winter Wear'],
      "Kids & Infants": ['Boys Clothing', 'Girls Clothing', 'Baby Clothing', 'School Uniforms'],
      'Footwear': ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sandals & Flip Flops', 'Ethnic Footwear'],
      'Accessories': ['Bags & Backpacks', 'Watches', 'Sunglasses', 'Belts & Wallets', 'Jewelry', 'Hats & Caps']
    },
    'HOME & KITCHEN': {
      'Furniture': ['Sofas & Couches', 'Beds & Mattresses', 'Dining Sets', 'Office Furniture', 'Storage Solutions'],
      'Kitchen & Dining': ['Cookware & Bakeware', 'Cutlery & Kitchen Tools', 'Dinnerware Sets', 'Kitchen Appliances', 'Storage Containers'],
      'Home Decor': ['Wall Art & Paintings', 'Clocks', 'Mirrors', 'Showpieces', 'Rugs & Carpets', 'Curtains & Blinds'],
      'Bed & Bath': ['Bed Linens', 'Pillows & Cushions', 'Towels', 'Bathroom Accessories'],
      'Lighting': ['LED Lights', 'Table Lamps', 'Decorative Lighting', 'Smart Lighting']
    },
    'BEAUTY & PERSONAL CARE': {
      'Skincare': ['Face Wash & Cleansers', 'Moisturizers & Creams', 'Serums & Toners', 'Face Masks', 'Sunscreens'],
      'Makeup': ['Foundations & Concealers', 'Lipsticks & Lip Care', 'Eye Makeup', 'Makeup Brushes & Tools'],
      'Hair Care': ['Shampoos & Conditioners', 'Hair Oils & Serums', 'Styling Products', 'Hair Color'],
      'Fragrances': ['Perfumes', 'Deodorants', 'Body Sprays'],
      'Personal Care': ['Body Wash & Soaps', 'Oral Care', "Men's Grooming", 'Feminine Hygiene']
    },
    'SPORTS & FITNESS': {
      'Fitness Equipment': ['Treadmills & Ellipticals', 'Weights & Dumbbells', 'Yoga Mats & Accessories', 'Fitness Trackers', 'Home Gyms'],
      'Sports Gear': ['Cricket Equipment', 'Football/Soccer', 'Badminton', 'Tennis', 'Basketball'],
      'Outdoor & Adventure': ['Camping Equipment', 'Trekking Gear', 'Water Sports'],
      'Gym Wear': ['Sports Shoes']
    },
    'BOOKS & MEDIA': {
      'Books': ['Fiction & Literature', 'Academic & Textbooks', 'Children\'s Books', 'Self-Help & Business', 'Comics & Manga'],
      'Music & Movies': ['CDs & DVDs', 'Blu-rays', 'Vinyl Records', 'Musical Instruments'],
      'Stationery': ['Pens & Writing', 'Notebooks & Diaries', 'Art Supplies', 'Office Supplies']
    },
    'HEALTH & WELLNESS': {
      'Nutrition & Supplements': ['Protein Supplements', 'Vitamins & Minerals', 'Weight Management', 'Health Foods'],
      'Medical Supplies': ['First Aid Kits', 'Thermometers', 'BP Monitors', 'Mobility Aids'],
      'Wellness': ['Essential Oils', 'Aromatherapy', 'Massage Equipment', 'Meditation Accessories']
    },
    'GROCERIES & DAILY NEEDS': {
      'Food & Beverages': ['Snacks & Biscuits', 'Beverages', 'Cooking Essentials', 'Ready-to-Eat'],
      'Household Supplies': ['Cleaning Products', 'Laundry Needs', 'Pest Control', 'Disposables']
    }
  };

  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedLeafCategory, setSelectedLeafCategory] = useState('');

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setErrors({ ...errors, image: 'Failed to upload image' });
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProductData({ ...productData, imageUrl: downloadURL });
          setUploading(false);
          setUploadProgress(0);
        });
      }
    );
  };

  // Handle additional images upload
  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        if (newImages.length === files.length) {
          setProductData({
            ...productData,
            additionalImages: [...productData.additionalImages, ...newImages]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    const updatedImages = [...productData.additionalImages];
    updatedImages.splice(index, 1);
    setProductData({ ...productData, additionalImages: updatedImages });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle specifications changes
  const handleSpecificationsChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      specifications: {
        ...productData.specifications,
        [name]: value
      }
    });
  };

  // Add new feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setProductData({
        ...productData,
        features: [...productData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    const updatedFeatures = [...productData.features];
    updatedFeatures.splice(index, 1);
    setProductData({ ...productData, features: updatedFeatures });
  };

  // Calculate discount automatically if originalPrice and price are provided
  useEffect(() => {
    if (productData.originalPrice && productData.price) {
      const original = parseFloat(productData.originalPrice);
      const price = parseFloat(productData.price);
      if (original > price) {
        const discount = Math.round(((original - price) / original) * 100);
        setProductData(prev => ({ ...prev, discount: discount.toString() }));
      }
    }
  }, [productData.originalPrice, productData.price]);

  // Calculate price automatically if originalPrice and discount are provided
  useEffect(() => {
    if (productData.originalPrice && productData.discount) {
      const original = parseFloat(productData.originalPrice);
      const discount = parseFloat(productData.discount);
      if (discount > 0 && discount <= 100) {
        const price = original - (original * discount / 100);
        setProductData(prev => ({ ...prev, price: Math.round(price).toString() }));
      }
    }
  }, [productData.originalPrice, productData.discount]);

  // Update category path when categories change
  useEffect(() => {
    if (selectedMainCategory && selectedSubCategory && selectedLeafCategory) {
      const categoryPath = `category/${selectedMainCategory}/${selectedSubCategory}/${selectedLeafCategory}`;
      setProductData({ ...productData, categoryPath });
    }
  }, [selectedMainCategory, selectedSubCategory, selectedLeafCategory]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!productData.title.trim()) newErrors.title = 'Product title is required';
    if (!productData.price) newErrors.price = 'Price is required';
    if (parseFloat(productData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!productData.imageUrl) newErrors.image = 'Main product image is required';
    if (!selectedMainCategory) newErrors.mainCategory = 'Please select a main category';
    if (!selectedSubCategory) newErrors.subCategory = 'Please select a sub category';
    if (!selectedLeafCategory) newErrors.leafCategory = 'Please select a product category';
    if (!productData.stockCount) newErrors.stockCount = 'Stock count is required';
    if (parseInt(productData.stockCount) < 0) newErrors.stockCount = 'Stock count cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);
      
      // Prepare product data for Firebase
      const productToSave = {
        ...productData,
        price: productData.price.toString(),
        originalPrice: productData.originalPrice || productData.price.toString(),
        discount: productData.discount || '0',
        rating: productData.rating || '0',
        reviewCount: productData.reviewCount || '0',
        stockCount: productData.stockCount || '0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'products'), productToSave);
      
      setSuccessMessage('Product added successfully!');
      setUploading(false);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        navigate('/admin?tab=products');
      }, 2000);

    } catch (error) {
      console.error('Error adding product:', error);
      setErrors({ ...errors, submit: 'Failed to save product. Please try again.' });
      setUploading(false);
    }
  };

  // Handle category selection
  const handleMainCategoryChange = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory('');
    setSelectedLeafCategory('');
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedLeafCategory('');
  };

  const handleLeafCategoryChange = (leafCategory) => {
    setSelectedLeafCategory(leafCategory);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowBackIcon />
          <span>Back</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-1">Fill in the details to add a new product to your store</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure? All unsaved changes will be lost.')) {
                  navigate('/admin?tab=products');
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" className="mb-6 animate-fade-in">
          {successMessage}
        </Alert>
      )}

      {/* Main Form */}
      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
                <DescriptionIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Basic Information</h2>
                <p className="text-gray-500 text-sm">Product title, description, and details</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., 4K Ultra HD Smart TV 55"
                  required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="Describe your product in detail..."
                />
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={productData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="originalPrice"
                      value={productData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={productData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>

              {/* Stock & Rating Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stock Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Count *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="stockCount"
                      value={productData.stockCount}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${errors.stockCount ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="0"
                      required
                    />
                    <InventoryIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.stockCount && <p className="mt-1 text-sm text-red-600">{errors.stockCount}</p>}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="rating"
                      value={productData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      placeholder="4.5"
                    />
                    <StarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Review Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Count
                </label>
                <input
                  type="number"
                  name="reviewCount"
                  value={productData.reviewCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  placeholder="178"
                />
              </div>
            </div>
          </div>

          {/* Category Selection Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                <CategoryIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Category Selection</h2>
                <p className="text-gray-500 text-sm">Select product category path</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Main Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Main Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.keys(categories).map((mainCat) => (
                    <button
                      key={mainCat}
                      type="button"
                      onClick={() => handleMainCategoryChange(mainCat)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedMainCategory === mainCat 
                        ? 'border-red-600 bg-red-50 text-red-700' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-medium">{mainCat}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Object.keys(categories[mainCat]).length} sub-categories
                      </div>
                    </button>
                  ))}
                </div>
                {errors.mainCategory && <p className="mt-1 text-sm text-red-600">{errors.mainCategory}</p>}
              </div>

              {/* Sub Category - Show only if main category selected */}
              {selectedMainCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sub Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.keys(categories[selectedMainCategory]).map((subCat) => (
                      <button
                        key={subCat}
                        type="button"
                        onClick={() => handleSubCategoryChange(subCat)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedSubCategory === subCat 
                          ? 'border-red-600 bg-red-50 text-red-700' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm font-medium">{subCat}</div>
                      </button>
                    ))}
                  </div>
                  {errors.subCategory && <p className="mt-1 text-sm text-red-600">{errors.subCategory}</p>}
                </div>
              )}

              {/* Leaf Category - Show only if sub category selected */}
              {selectedSubCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Product Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {categories[selectedMainCategory][selectedSubCategory].map((leafCat) => (
                      <button
                        key={leafCat}
                        type="button"
                        onClick={() => handleLeafCategoryChange(leafCat)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${selectedLeafCategory === leafCat 
                          ? 'border-red-600 bg-red-50 text-red-700' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm font-medium">{leafCat}</div>
                      </button>
                    ))}
                  </div>
                  {errors.leafCategory && <p className="mt-1 text-sm text-red-600">{errors.leafCategory}</p>}
                </div>
              )}

              {/* Selected Path Preview */}
              {selectedLeafCategory && (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">Selected Category Path:</div>
                  <div className="text-lg font-bold text-gray-900">
                    category/{selectedMainCategory}/{selectedSubCategory}/{selectedLeafCategory}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Images Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <ImageIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Product Images</h2>
                <p className="text-gray-500 text-sm">Upload main and additional product images</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Main Product Image *
                </label>
                
                {uploading && productData.imageUrl === '' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <CircularProgress size={40} className="mb-4" />
                    <p className="text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress} 
                      className="mt-4"
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #dc2626, #fbbf24)',
                        }
                      }}
                    />
                  </div>
                ) : productData.imageUrl || previewImage ? (
                  <div className="relative">
                    <img
                      src={productData.imageUrl || previewImage}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <label className="cursor-pointer">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                          <CloudUploadIcon className="text-gray-600" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setProductData({ ...productData, imageUrl: '' });
                          setPreviewImage(null);
                        }}
                        className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                      >
                        <DeleteIcon className="text-sm" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all duration-300">
                      <CloudUploadIcon className="text-gray-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload main product image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                )}
                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Images
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Add more images button */}
                  <label className="cursor-pointer">
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all duration-300">
                      <AddPhotoIcon className="text-gray-400 text-2xl mb-2" />
                      <span className="text-sm text-gray-600">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesUpload}
                        className="hidden"
                      />
                    </div>
                  </label>

                  {/* Additional images preview */}
                  {productData.additionalImages.map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={img}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                      >
                        <CloseIcon className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Specifications & Features */}
        <div className="space-y-6">
          {/* Specifications Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <SettingsIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Specifications</h2>
                <p className="text-gray-500 text-sm">Product specifications and details</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Brand', name: 'brand', placeholder: 'e.g., Samsung, Apple' },
                { label: 'Color', name: 'color', placeholder: 'e.g., Black, White, Red' },
                { label: 'Size', name: 'size', placeholder: 'e.g., 55", XL, 256GB' },
                { label: 'Weight', name: 'weight', placeholder: 'e.g., 1.5kg, 500g' },
                { label: 'Material', name: 'material', placeholder: 'e.g., Plastic, Metal, Leather' },
                { label: 'Warranty', name: 'warranty', placeholder: 'e.g., 1 Year' },
                { label: 'Dimensions', name: 'dimensions', placeholder: 'e.g., 10x5x8 inches' },
              ].map((spec) => (
                <div key={spec.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {spec.label}
                  </label>
                  <input
                    type="text"
                    name={spec.name}
                    value={productData.specifications[spec.name]}
                    onChange={handleSpecificationsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    placeholder={spec.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <CheckCircleIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Features</h2>
                <p className="text-gray-500 text-sm">Add key product features</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Features List */}
              {productData.features.length > 0 && (
                <div className="space-y-2">
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="text-green-500 text-sm" />
                        <span>{feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <DeleteIcon className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Feature */}
              <div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Add a new feature"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Options Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <FeaturedIcon className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Product Options</h2>
                <p className="text-gray-500 text-sm">Additional product settings</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Stock Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${productData.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <StockIcon className="text-sm" />
                  </div>
                  <div>
                    <div className="font-medium">In Stock</div>
                    <div className="text-sm text-gray-500">Product is available for sale</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={productData.inStock}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Featured Product */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${productData.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                    <FeaturedIcon className="text-sm" />
                  </div>
                  <div>
                    <div className="font-medium">Featured Product</div>
                    <div className="text-sm text-gray-500">Show on homepage featured section</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={productData.isFeatured}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </div>

              {/* Fast Delivery */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${productData.fastDelivery ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    <ShippingIcon className="text-sm" />
                  </div>
                  <div>
                    <div className="font-medium">Fast Delivery</div>
                    <div className="text-sm text-gray-500">Available for express shipping</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="fastDelivery"
                    checked={productData.fastDelivery}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">Product Preview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Title:</span>
                <span className="font-medium truncate max-w-[200px]">{productData.title || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-bold text-red-600">₹{productData.price || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stock:</span>
                <span className={`font-medium ${parseInt(productData.stockCount) > 10 ? 'text-green-600' : parseInt(productData.stockCount) > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {productData.stockCount || '0'} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium truncate max-w-[200px]">
                  {selectedLeafCategory || 'Not selected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            * Required fields
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all fields?')) {
                  window.location.reload();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshIcon />
              Reset
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Save & Publish Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;