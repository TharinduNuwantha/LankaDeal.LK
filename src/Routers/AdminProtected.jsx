import {Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelecter } from "../Store/ReduxSlice/userClise";
import { useEffect, useState } from "react";
import UrlNotFound from "../Pages/404/UrlNotFound";

const AdminProtected = () => {


  const [canView,setCanview] = useState(false);
  const userData = useSelector(userSelecter);
const navigate = useNavigate()

useEffect(()=>{
  if(userData.name){  
      if(!(userData.name === 'default')){
        if((userData.role === 'admin')){
            setCanview(true) 
        }
      }
  }else{
        navigate('/404') 
      }
},[userData])
  

        return canView?<Outlet/>:<UrlNotFound/>


  
}

export default AdminProtected
