import { IconButton } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { categorySelector } from '../../Store/ReduxSlice/categorySlice'
import { useParams } from 'react-router-dom'

const ItemPage = () => {
  // FIX: Use 'categoryId' instead of 'id' to match your router config
  const { categoryId, itemId } = useParams(); 

  const itemimageArr = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80'
  ]

  const mainImageRef = useRef()
  const subImagesRef = useRef([])

  const categoriesTT = useSelector(categorySelector);

  useEffect(() => {
      console.log("All categories:", categoriesTT);
      console.log("URL categoryId:", categoryId); // This will now show 'Health_and_Wellness'
      
      if (categoriesTT && categoryId) {
          // Filter to find object where the category id matches the URL
          const filteredCategory = categoriesTT.find(cat => cat.id === categoryId);
          console.log("Filtered category Object:", filteredCategory);
      }
      
  }, [categoriesTT, categoryId]);

  return (
    <div>
        {/* Keeping your temporary UI data exactly as it is */}
        <h1>Item Title</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
            {itemimageArr.map((ele, index) => (
                <img 
                    key={index}
                    ref={(el) => (subImagesRef.current[index] = el)} 
                    src={ele} 
                    alt="temp" 
                    style={{ width: '100px', cursor: 'pointer' }}
                />
            ))}
        </div>
        <img ref={mainImageRef} style={{ width: '300px', marginTop: '20px' }} alt="main" />
    </div>
  )
}

export default ItemPage