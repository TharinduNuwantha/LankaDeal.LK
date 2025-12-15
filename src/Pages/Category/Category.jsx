import IconButton from '@mui/material/IconButton'
import React from 'react'
import { Link } from 'react-router-dom';

const categoryArr =[
    {
        imageUrl:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        categoryTitle:'Category title 1',
        categoryId:'category1'
    },
    {
        imageUrl:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        categoryTitle:'Category title 2',
        categoryId:'category2'
    },
    {
        imageUrl:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        categoryTitle:'Category title 3',
        categoryId:'category3'
    },
    {
        imageUrl:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        categoryTitle:'Category title 4',
        categoryId:'category4',

    },
    {
        imageUrl:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        categoryTitle:'Category title 5',
        categoryId:'category5'
    },
];

const Category = () => {
  return (
    <div className='px-5 py-[100px w-full h-screen overflow-y-scroll]'>
        <div style={{
            boxShadow:"rgba(0,0,0,0,24) 0px 3px 8px" 
        }} className='w-full p-2'>
            <h1 className='text-lg font-bold mt-2 ml-2 mb-3'>Main Categories</h1>
            <div className='grid grid-cols-3 grid-rows-[auto] gap-5'>
            {categoryArr.map(({imageUrl,categoryTitle,categoryId},index)=><CategaoryItem imageUrl={imageUrl} categoryTitle={categoryTitle} categoryId={categoryId} index={index}/>)}

            </div>
        </div>
    </div>
  )
}

export default Category

const CategaoryItem = ({imageUrl,categoryTitle,categoryId,index})=>(
<Link to={`/category/${categoryId}`}>
<IconButton key={{index}} sx={{color:'red',padding:'1px',borderRadius:'6px'}}><div className='m-1 w-full rounded-md  flex-col items-center' style={{
    boxShadow:"rgba(0,0,0,0.24) 0px 3px 8px"
}}>
    <img src={imageUrl} alt={`${categoryTitle}_${index}`}
className='rounded-full w-[50px] h-[50px]' />
    <h2 className='text-xs text-black font-bold'>{categoryTitle}</h2>
</div></IconButton></Link>)