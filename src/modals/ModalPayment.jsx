import { Modal } from '@mui/material'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useImperativeHandle, useState, forwardRef } from 'react'
import db from '../FireBase/firebase';

const ModalPayment = forwardRef((props, ref) => {
    const[open,setOpen] = useState(false);
    // const handleOpen = ()=> setOpen(true);
    const handleClose = ()=> setOpen(false);

    useImperativeHandle(ref,()=>({
        handleOpen:()=> setOpen(true)
    }))


    const addData = ()=>{
      setDoc(doc(db,"category/category4/category4","category4_item1"),{
        title:"Category4 title 1",
        imageUrl:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&q=80",
         price:"2500",
         originalPrice:"5000",
         discount:"56",
         rating:"3.4",
         reviewCount:"10",
         isFeatured:true,
         fastDelivery:true,
         inStock:true
      })
      .then(()=>{
          console.log("document writen with ID: ");
        }).catch((err)=>{
          console.log("Error adding document: ",err);
          
        })
    }

  return (
    <Modal
    open={open}
    onClose={handleClose}
    className='flex flex-col items-center justify-center'
    >
        <div className='w-[90%] bg-white'>Tharindu
          <button onClick={addData}>Get Data</button>
        </div>

    </Modal>
  )
})

ModalPayment.displayName = 'ModalPayment';

export default ModalPayment
