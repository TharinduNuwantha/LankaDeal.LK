import { IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { categorySelector } from '../../Store/ReduxSlice/categorySlice'
import { useParams } from 'react-router-dom'
import { 
  getFirestore, 
  collectionGroup, 
  query, 
  where, 
  getDocs,
  documentId, 
  doc,
  getDoc
} from 'firebase/firestore';

import db from '../../FireBase/firebase'


const ItemPage = () => {

    const itemimageArr = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80'
  ]
  // 1. Refs at the top level
  const mainImageRef = useRef();
  const subImagesRef = useRef([]);

  // 2. Get variables from URL (Make sure your Route is: /category/:categoryName/:productId)
  const { categoryId, id } = useParams();
console.log('categoryId ======================> ',categoryId)
console.log('id ======================> ',id)
  // 3. State management
  const [itemData, setItemData] = useState([]); // Initialized as an empty array per your requirement
  const [loading, setLoading] = useState(true);

  // 4. useEffect to fetch data when the component mounts or URL changes
  useEffect(() => {
    if (categoryId && id) {
      setLoading(true);
      
      const docRef = doc(db, "category2", categoryId, "products", id);

      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
         
            const myArr = [];
            const productObject = { id: docSnap.id, ...docSnap.data() };
            myArr.push(productObject);

            // Update the state with the array
            setItemData(myArr);
            console.log("Pakayooo ===============>  ",myArr)
          } else {
            console.log("No document found!");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [categoryId, id]); // Only re-run if these variables change

  // 5. Render logic
  if (loading) return <div>Loading...</div>;
  return (
    <div className='px-5 py-[10px] w-full h-screen overflow-y-scroll'>
      {   console.log('wedada yakoooooooooooooooooooooooooooooooooooo',itemData)}
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
