// myapp\src\components\Header\Header.jsx
import '../../styles/tailwind.css'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import IconButton, { iconButtonClasses } from '@mui/material/IconButton';


const Header = () => {
  return (
    <header className='w-full p-4 bg-primaryRed flex items-center justify-between shadow-lg'>
      <div className='flex items-center'>
        <IconButton>
        <MenuIcon sx={{
            color:"white",
            fontSize: 28,
            cursor: "pointer",
            '&:hover': { opacity: 0.8 }
        }}/></IconButton>
        <h1 className='text-xl font-bold ml-3'>LankaDeal<span className='text-red-300'>.LK</span></h1>
        <div className='search-container ml-6'>
          <input 
            type='text' 
            placeholder='Search for products, brands and more...' 
            className='hidden sm:inline-block  outline-none p-2 font-medium text-sm w-[400px] bg-inherit' 
          />
          <SearchIcon sx={{
            color: '#ff4747',
            fontSize: 22,
            cursor: "pointer"
          }}/>
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-2 cursor-pointer'>
          <PersonIcon sx={{
            color: 'white',
            fontSize: 22
          }}/>
          <span className='text-white font-medium hover:text-accent-yellow transition duration-300'>
            Login / Sign Up
          </span>
        </div>
        <div className='relative cursor-pointer'>
          <IconButton>
          <ShoppingCartIcon sx={{
            color:'white',
            fontSize: 26,
            '&:hover': { transform: 'scale(1.1)' }
          }}/></IconButton>
          <span className='cart-badge absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
            3
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header