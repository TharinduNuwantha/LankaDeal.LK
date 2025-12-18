import { Navigate, Outlet } from "react-router-dom";
import Login from "../Pages/Login/Login";
import { useSelector } from "react-redux";
import { userSelecter } from "../Store/ReduxSlice/userClise";

const AdminProtected = () => {

  const admin = false;
  const user = useSelector(userSelecter);
  console.log(user);
  

  if(admin){
    return <Outlet/>
  }else{
    return <Navigate to={'/404'}/>
  }
}

export default AdminProtected
