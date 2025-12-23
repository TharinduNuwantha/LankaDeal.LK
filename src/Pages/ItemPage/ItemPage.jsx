import { IconButton } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { categorySelector } from '../../Store/ReduxSlice/categorySlice'
import { useParams } from 'react-router-dom'

const ItemPage = () => {
const { id } = useParams(); 
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
        console.log("URL ID:", id);
        
        // Filter to find object with matching ID
        const filteredCategory = categoriesTT.find(cat => cat.id === id);
        
        console.log("Filtered category:", filteredCategory);
        
    }, [categoriesTT, id]);

  return (
    <div className='px-5 py-[10px] w-full h-screen overflow-y-scroll'>
        <h1 className='text-lg font-bold px-3 mb-7'>Item Title</h1>
        <img ref={mainImageRef} src={itemimageArr[0]} alt='Main Image' className='w-full object-contain rounded-md'/>
        <div className='w-full mt-5 grid grid-cols-4 text-center grid-rows-1 gap-3'>
            {itemimageArr.map((ele,index)=>
            <IconButton key={index} sx={{
              padding:'0',
              borderRadius:"2px"
            }} onClick={()=>{
              subImagesRef.current[index].style.border = '1px solid gold'
              mainImageRef.current.src = subImagesRef.current[index].src
              for(let i=0;i<itemimageArr.length;i++){
                if(i !== index){
                  subImagesRef.current[i].style.border = "none"
                }
              }
            }}>
              <img ref={(refEle)=>(subImagesRef.current[index]=refEle)} name={`Item Image ref : ${index}`} src={ele} alt={ele}  className='w-full object-contain rounded-sm'/>
              </IconButton>
            )}
        </div>
    </div>
  )
}

export default ItemPage
