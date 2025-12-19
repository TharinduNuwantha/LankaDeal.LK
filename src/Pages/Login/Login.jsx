import  { useState } from 'react'
import getDataFromSubCollection from '../../utils/dataFetch/getDataFromSubCollection'

const Login = () => {
  const[select,setSelect] = useState('login')
  return (
    <div>
     {select === 'login' ?<LoginComponent/>:<RegisterComponent/>} 
      {select === 'login' ?<p>Don't have an account?{" "}<span onClick={()=>setSelect("register")}>Sign Up</span></p>:<p>Already havean account(" ")<span onClick={()=>setSelect("login")}>Sign In</span></p>} 
      
    </div>
  )
}

export default Login


const LoginComponent = ()=>{


  
  return(
    <div>
      <h1>Login</h1>
 
    </div>
  )
}

/*
*
*
*
*
*
*
*
*
*
*/


const RegisterComponent = ()=>{
  const registerHandle = (e) =>{
    e.preventDefault()
    console.log(e.target);
    
  }
  return(
    <div>
      <h1>Register</h1>
      <form onSubmit={registerHandle}>
      <div>
        <input type="text" placeholder='Your first name' />
        <input type="text" placeholder='Your last name' />
      </div>
      <input type="text" placeholder='your email address'/>
      <input type="password" placeholder='password'/>
      <input type="password" placeholder='confi password'/>
      <input type="text" placeholder='Your phone number' />
        <button type='submit'>Register</button>
      </form>
    </div>
  )
}