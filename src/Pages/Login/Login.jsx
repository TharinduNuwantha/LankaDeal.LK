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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign in to your account</h1>
        <form onSubmit={loginHandle}>
          <LoginInput inputtype="email" lable="Email Address" placeholder="Enter your email" name="email" />
          <LoginInput inputtype="password" lable="Password" placeholder="Enter your password" name="password" />
          <button className="w-full bg-main-background text-white py-2 rounded-md hover:bg-red  transition mt-4" type="submit">Login</button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">Don't have an account? <span className="text-main-background cursor-pointer" onClick={()=>{}}>{" "}Sign Up</span></p>
      </div>
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
    const  name = `${e.target["firstName"].value} ${e.target["lastName"].value}`
    const email = e.target["email"].value;
    const address = e.target["address"].value;
    const passwoard = e.target["password"].value;
    const cpasswoard = e.target["confirmPassword"].value;
    const phoneNumber = e.target["phoneNumber"].value;
    const profileImage = e.target["profileImage"].value;
    const role = "user"

      if(passwoard === cpasswoard){
        userRegister(email,passwoard,name,address,phoneNumber,profileImage,role);
      }
  }
  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create your account</h1>
        <form onSubmit={registerHandle}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <LoginInput inputtype="text" lable="First Name" placeholder="Your first name" name="firstName" />
            <LoginInput inputtype="text" lable="Last Name" placeholder="Your last name" name="lastName" />
          </div>
          <LoginInput inputtype="email" lable="Email Address" placeholder="Your email address" name="email" />
          <LoginInput inputtype="text" lable="Address" placeholder="Your address" name="address" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <LoginInput inputtype="password" lable="Password" placeholder="Password" name="password" />
            <LoginInput inputtype="password" lable="Confirm Password" placeholder="Confirm password" name="confirmPassword" />
          </div>
          <LoginInput inputtype="text" lable="Phone Number" placeholder="Your phone number" name="phoneNumber" />
          <LoginInput inputtype="text" lable="Profile Image" placeholder="Your profile image URL" name="profileImage" />
          <button className="w-full bg-main-background text-white py-2 rounded-md hover:bg-red mt-4" type='submit'>Register</button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">Already have an account? <span className="text-main-background cursor-pointer" onClick={()=>{}}>Sign In</span></p>
      </div>
    </div>
  )
}


const LoginInput =({inputtype, lable, placeholder, name}) =>{
  return(
    <div className='w-full mb-4'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>{lable}</label>
      <input 
        type={inputtype} 
        name={name}
        placeholder={placeholder} 
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
        required
      />
    </div>
  )
}