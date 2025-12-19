import  { useState } from 'react'

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
  return(
    <div>
      <h1>Register</h1>
    </div>
  )
}