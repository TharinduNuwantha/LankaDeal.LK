import {useSelector} from "react-redux"
import { categorySelector } from "../../Store/ReduxSlice/categorySlice"
import { useParams } from "react-router-dom";
import { IconButton, Rating } from "@mui/material";

const CategoryItem = () => {
  const category = useSelector(categorySelector)
  console.log(category);
  const {categoryId} = useParams()
  const [categoryTitle] = category.filter((ele)=>ele.id === categoryId)

  const categoryItemsArr = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        title: 'product title 1'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=600&fit=crop&q=80',
        title: 'product title 2'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80',
        title: 'product title 3',
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&q=80',
        title: 'product title  4'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&q=80',
        title: 'product title 5'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&q=80',
        title: 'product title 6'
    }
    
];


  return (
    <div className='px-5 py-[100px w-full h-screen overflow-y-scroll]'>
        <h1 className="text-lg font-bold mt-2 ml-2 mb-3">{categoryTitle.title}</h1>
        <div className="w-full grid grid-cols-3 grid-rows[auto] gap-4">
          {categoryItemsArr.map(({imageUrl,title},index)=><CategoryItemUnit key={index} imageUrl={imageUrl} title={title}/>)}
        </div>
    </div>
  )
}

export default CategoryItem

const CategoryItemUnit = ({imageUrl,title,key})=>
  <IconButton sx={{
    color:'gray',
    padding:'1px',
    borderRadius:'6px'
  }}>
  <div key={key} className="w-full inline-block">
    <img src={imageUrl} alt={title} className="w-full object-contain"/>
    <h3 className="text-sm font-bold text-black text-left">{title}</h3>
    <Rating
      name={imageUrl}
      value={3.5}
      precision={0.1}
      size="smail"
      readOnly
    />
  </div></IconButton>
