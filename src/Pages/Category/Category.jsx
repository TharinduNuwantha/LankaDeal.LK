import IconButton from '@mui/material/IconButton'
import React from 'react'

const Category = () => {
  return (
    <div className='px-5 py-[100px w-full h-screen overflow-y-scroll]'>
        <div style={{
            boxShadow:"rgba(0,0,0,0,24) 0px 3px 8px" 
        }} className='w-full p-2'>
            <h1 className='text-lg font-bold mt-2 ml-2 mb-3'>Main Categories</h1>
            <div className='grid grid-cols-3 grid-rows-[auto] gap-5'>

            <CategaoryItem/>
            <CategaoryItem/>
            <CategaoryItem/>
            <CategaoryItem/>
            <CategaoryItem/>
            <CategaoryItem/>
            <CategaoryItem/>
            <CategaoryItem/>
            </div>
        </div>
    </div>
  )
}

export default Category

const CategaoryItem = ()=>(<IconButton sx={{color:'red',padding:'1px',borderRadius:'6px'}}><div className='w-full rounded-md border-2 border-pink-600 flex-col items-center'>
    <img src='https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&q=80' alt='categary'/>
    <h2>Category Name</h2>
</div></IconButton>)