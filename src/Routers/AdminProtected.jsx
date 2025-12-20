import {Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelecter } from "../Store/ReduxSlice/userClise";
import { useEffect } from "react";

const AdminProtected = () => {


  const userData = useSelector(userSelecter);
const navigate = useNavigate()

useEffect(()=>{
  if(userData.name){  
      if(!(userData.name === 'default')){
        if(!(userData.role === 'admin')){
          navigate('/404') 
        }
      }
  }else{
        navigate('/404') 
      }
},[userData])
  

        return <Outlet/>


  
}

export default AdminProtected
