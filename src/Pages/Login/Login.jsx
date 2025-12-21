import  { useState } from 'react'
import getDataFromSubCollection from '../../utils/dataFetch/getDataFromSubCollection'
import userRegister from '../../utils/auth/register'
import { signOut } from 'firebase/auth'
import { auth } from '../../FireBase/firebase'
import userLogin from '../../utils/auth/login'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const[select,setSelect] = useState('login')
  const navigate = useNavigate()
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
     {select === 'login' ?<LoginComponent/>:<RegisterComponent/>} 
      {select === 'login' ?<p>Don't have an account?{" "}<span onClick={()=>setSelect("register")}>Sign Up</span></p>:<p>Already havean account(" ")<span onClick={()=>setSelect("login")}>Sign In</span></p>} 
      <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-main-background text-white rounded-md">Go to Home</button>
       
    </div>
  )
}

export default Login


 const LoginComponent = ()=>{
 const navigate = useNavigate()
 const[firebaseLoginErr,setFierBaseLoginError] = useState({
  emailErr:'',
  passwoardErr:''
 });


const loginHandle = (e)=> {
  e.preventDefault()
  const email = e.target["email"].value
  const passwoard = e.target["password"].value
  setFierBaseLoginError({emailErr:'',passwoardErr:''})
  userLogin(email,passwoard,navigate,setFierBaseLoginError)
}
  
  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign in to your account</h1>
        <form onSubmit={loginHandle}>
          <LoginInput
            inputtype="email"
            lable="Email Address"
            placeholder="Enter your email"
            name="email"
            validator={(v) => /\S+@\S+\.\S+/.test(v)}
            errMsg="Enter a valid email address"
            fierbaseErr={firebaseLoginErr.emailErr}
            setFierBaseLoginError={setFierBaseLoginError}
            isLogInHandle={true}
          />
          <LoginInput
            inputtype="password"
            lable="Password"
            placeholder="Enter your password"
            name="password"
            validator={(v) => v && v.length >= 6}
            errMsg="Password must be at least 6 characters"
            fierbaseErr={firebaseLoginErr.passwoardErr}
            setFierBaseLoginError={setFierBaseLoginError}
            isLogInHandle={true}
          />
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
   const[firebaseREGErr,setFierBaseregError] = useState('');
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
        userRegister(email,passwoard,name,address,phoneNumber,profileImage,role,setFierBaseregError);
      }
  }
  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create your account</h1>
        <form onSubmit={registerHandle}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <LoginInput inputtype="text" lable="First Name" placeholder="Your first name" name="firstName" validator={(v)=>v && v.trim().length>0} errMsg="Enter first name" isLogInHandle={false}/>
            <LoginInput inputtype="text" lable="Last Name" placeholder="Your last name" name="lastName" validator={(v)=>v && v.trim().length>0} errMsg="Enter last name" isLogInHandle={false}/>
          </div>
          <LoginInput inputtype="email" lable="Email Address" placeholder="Your email address" name="email" validator={(v) => /\S+@\S+\.\S+/.test(v)} errMsg="Enter a valid email" isLogInHandle={false}/>
          <LoginInput inputtype="text" lable="Address" placeholder="Your address" name="address" validator={(v)=>v && v.trim().length>0} errMsg="Enter address" isLogInHandle={false}/>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <LoginInput inputtype="password" lable="Password" placeholder="Password" name="password" validator={(v)=>v && v.length>=6} errMsg="Password must be at least 6 characters" isLogInHandle={false}/>
            <LoginInput inputtype="password" lable="Confirm Password" placeholder="Confirm password" name="confirmPassword" validator={(v)=>v && v.length>=6} errMsg="Confirm password must be at least 6 characters" isLogInHandle={false}/>
          </div>
          <LoginInput inputtype="text" lable="Phone Number" placeholder="Your phone number" name="phoneNumber" validator={(v)=>v && v.trim().length>0} errMsg="Enter phone number" isLogInHandle={false}/>
          <LoginInput inputtype="text" lable="Profile Image" placeholder="Your profile image URL" name="profileImage" validator={(v)=>v && v.trim().length>0} errMsg="Enter profile image URL" isLogInHandle={false}/>
          <button className="w-full bg-main-background text-white py-2 rounded-md hover:bg-red mt-4" type='submit'>Register</button>
        </form>
        { <p className="text-sm text-red-600 mt-1">{firebaseREGErr}</p> }
        <p className="text-sm text-center text-gray-600 mt-4">Already have an account? <span className="text-main-background cursor-pointer" onClick={()=>{}}>Sign In</span></p>
      </div>
    </div>
  )
}


const LoginInput =({inputtype, lable, placeholder, name, validator, errMsg,fierbaseErr,setFierBaseLoginError,isLogInHandle}) =>{
  const[error,setError] = useState(false)
  const[inputValue,setInputValue] = useState("")
  const[localErrMsg,setLocalErrMsg] = useState("") 

  const handleBlur = () =>{
    if (typeof validator === 'function'){
      const ok = validator(inputValue)
      setError(!ok)
      setLocalErrMsg(!ok ? errMsg || 'Invalid value' : '')
    }
  }

  const handleChange = (e) =>{
    setInputValue(e.target.value)
    if (error){
      // re-validate while typing
      if (typeof validator === 'function'){
        const ok = validator(e.target.value)
        setError(!ok)
        setLocalErrMsg(!ok ? errMsg || 'Invalid value' : '')
      } else {
        setError(false)
        setLocalErrMsg("")
      }
    }
    if(isLogInHandle){
      setFierBaseLoginError({ emailErr:'',  passwoardErr:''})
    }
    
  }

  return(
    <div className='w-full mb-4'>
      <label className={`block text-sm font-medium ${error?"text-red-700":"text-gray-700"} mb-2`}>{lable}</label>
      <input 
        type={inputtype} 
        name={name}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder} 
        className={`w-full px-4 py-2 border ${error?"border-red-600":"border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
        required
      />
      {error && localErrMsg ? <p className="text-sm text-red-600 mt-1">{localErrMsg}</p> : null}
      {fierbaseErr ? <p className="text-sm text-red-600 mt-1">{fierbaseErr}</p> : null}
    </div>
  )
}