import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import db from '../../FireBase/firebase';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../Store/ReduxSlice/userClise';

const Login = () => {

  const usernameRef = useRef();
  const passwoardRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginSubmit = ()=>{
    const q = query(collection(db, "users"), where("userName", "==", "tharindu"));

      getDocs(q).then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                          const data = doc.data();
                          console.log(doc.id, " => ", data);
                          dispatch(addUser({ ...data, isAdmin: true }));
                        });
                        navigate("/admin");
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
  }

  return (
    <div>
      <input ref={usernameRef} type='text' placeholder='user name'/>
      <input ref={passwoardRef} type="text"  placeholder='passwoard'/>
      <button onClick={loginSubmit}>Login</button>
    </div>
  )
}

export default Login
