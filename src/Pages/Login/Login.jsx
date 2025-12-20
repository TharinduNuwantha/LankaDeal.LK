import  { useState } from 'react'
import getDataFromSubCollection from '../../utils/dataFetch/getDataFromSubCollection'
import userRegister from '../../utils/auth/register'
import { signOut } from 'firebase/auth'
import { auth } from '../../FireBase/firebase'
import userLogin from '../../utils/auth/login'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const[select,setSelect] = useState('login')
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
     {select === 'login' ?<LoginComponent/>:<RegisterComponent/>} 
      {select === 'login' ?<p>Don't have an account?{" "}<span onClick={()=>setSelect("register")}>Sign Up</span></p>:<p>Already havean account(" ")<span onClick={()=>setSelect("login")}>Sign In</span></p>} 
      
    </div>
  )
}

export default Login


 const LoginComponent = ()=>{
 const navigate = useNavigate()

const loginHandle = (e)=> {
  e.preventDefault()
  const email = e.target["email"].value
  const passwoard = e.target["password"].value
  userLogin(email,passwoard,navigate)
}
  
  return(
    <div>
      <h1>Login</h1>
      <form onSubmit={loginHandle}>
        <LoginInput inputtype='text' placeholder='Enter Your Email'/>
        <input type="password" name="password" placeholder='enter your password' />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

/*
*
*

*/


const RegisterComponent = ()=>{
  const registerHandle = (e) =>{
    e.preventDefault()
    const  name = `${e.target[0].value} ${e.target[1].value}`
    const email = e.target[2].value;
    const address = e.target[3].value;
    const passwoard = e.target[4].value;
    const cpasswoard = e.target[5].value;
    const phoneNumber = e.target[6].value;
    const profileImage = e.target[7].value;
    const role = "user"

      // console.log({name,email,address,passwoard,cpasswoard,phoneNumber})
      if(passwoard === cpasswoard){
        userRegister(email,passwoard,name,address,phoneNumber,profileImage,role);
      }
        
      
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
      <input type="text" placeholder='your  address'/>
      <input type="password" placeholder='password'/>
      <input type="password" placeholder='conform password'/>
      <input type="text" placeholder='Your phone number' />
      <input type="text" placeholder='Your Profile image' />
        <button type='submit'>Register</button>
      </form>
    </div>
  )
}


const LoginInput =({inputtype,placeholder}) =>{
  return<div>
    <label></label>
    <input type={inputtype} placeholder={placeholder} />
  </div>
}