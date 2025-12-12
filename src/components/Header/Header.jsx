import menu from '../../img/menu.svg'   
import search from '../../img/search.svg'   
import cart from '../../img/cart-shopping.svg'   

const Header = () => {
  return (
    <header>
    <div>
        <img src={menu} alt='menu' />
        <h1>LankaDeal<span>.LK</span></h1>
        <div>
            <input type='text' placeholder='Search' />
            <img src={search} alt='search'/>
        </div>
    </div>
        <img src={cart} alt='cart'/>
    </header>
  )
}

export default Header
