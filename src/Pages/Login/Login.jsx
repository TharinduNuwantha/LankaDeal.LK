import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import db, { auth } from '../../FireBase/firebase';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../Store/ReduxSlice/userClise';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const Login = () => {

  const usernameRef = useRef();
  const passwoardRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();




  useEffect(()=>{
    const UserCheackFun = ()=>{
          onAuthStateChanged(auth, (user) => {
              if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                console.log(user);
                
                // ...
              } else {
                console.log('user error');
                
              }
            });
    }
    
    UserCheackFun();

    return()=> UserCheackFun()

  },[])


  const loginSubmit = ()=>{

    const email = usernameRef.current.value;
    const password = passwoardRef.current.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
      
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      
    });

  }

  return (
    <div>
      <input ref={usernameRef} type='text' placeholder='user name'/>
      <input ref={passwoardRef} type="text"  placeholder='passwoard'/>
      <button onClick={loginSubmit}>Login</button>
      <button onClick={()=>{
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          alert('user signout')
        }).catch((error) => {
          alert('user signout error')
        });
      }}>Signout</button>
    </div>
  )
}

export default Login
