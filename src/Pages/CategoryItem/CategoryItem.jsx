import {useSelector} from "react-redux"
import { categorySelector } from "../../Store/ReduxSlice/categorySlice"
import { useParams } from "react-router-dom";

const CategoryItem = () => {
  const category = useSelector(categorySelector)
  console.log(category);
  const {categoryId} = useParams()
  const [categoryTitle] = category.filter((ele)=>ele.id === categoryId)

  return (
    <div className='px-5 py-[100px w-full h-screen overflow-y-scroll]'>
        category items : {categoryTitle.title}
    </div>
  )
}

export default CategoryItem
