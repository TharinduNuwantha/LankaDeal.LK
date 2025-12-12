// myapp\src\components\Header\Header.jsx
import menu from '../../img/menu.svg'   
import search from '../../img/search.svg'   
import cart from '../../img/cart-shopping.svg'   
import '../../styles/tailwind.css'

const Header = () => {
  return (
    <header className='w-full p-5 bg-main-background flex items-center justify-between'>
      <div className='flex items-center'>
        <img src={menu} alt='menu' className='w-6 h-6 object-contain cursor-pointer mr-4'/>
        <h1 className='text-xl font-bold'>LankaDeal<span className='text-red-300'>.LK</span></h1>
        <div className='search-container'>
          <input 
            type='text' 
            placeholder='Search products...' 
            className='outline-none p-2 font-medium text-base w-[300px] bg-inherit' 
          />
          <img src={search} alt='search' className='w-5 h-5 object-contain cursor-pointer'/>
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <button className='btn-primary'>
          Login
        </button>
        <div className='relative'>
          <img src={cart} alt='cart' className='w-7 h-7 object-contain cursor-pointer'/>
          <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
            3
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header