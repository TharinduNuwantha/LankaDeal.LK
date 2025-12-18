import { Navigate, Outlet } from "react-router-dom";
import Login from "../Pages/Login/Login";

const AdminProtected = () => {

  const admin = false;

  if(admin){
    return <Outlet/>
  }else{
    return <Navigate to={'/404'}/>
  }
}

export default AdminProtected
