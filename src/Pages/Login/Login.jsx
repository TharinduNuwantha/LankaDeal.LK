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

// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {

//     const uid = user.uid;
//     console.log(user);
    
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });






    // const authCheack = ()=> {
    //   onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/auth.user
    //     const uid = user.uid;
    //     console.log(uid);
        
    //     // ...
    //   } else {
    //     // User is signed out
    //     // ...
    //   }
    // });
    // }
    // authCheack()
    // return()=>{
    //   authCheack()
    // }
  },[])


  useEffect(()=>{
    const fun = ()=>{
    const user = auth.currentUser;
      if (user) {

        console.log("current user -> ",user)
      } else {
       console.log("no user");
       
      }
    }
    fun();
    setTimeout(()=>{
      fun()
    },[1000])
  },[])


  const loginSubmit = ()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        
        // ...
      } else {
        // User is signed out
        // ...
      }
    });



  //   const email = usernameRef.current.value;
  //   const password = passwoardRef.current.value;
  // signInWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     // Signed in 
  //     const user = userCredential.user;
  //     console.log(user);
      
  //     // ...
  //   })
  //   .catch((error) => {
  //     // const errorCode = error.code;
  //     const errorMessage = error.message;
  //     console.log(errorMessage);
      
  //   });


    // const q = query(collection(db, "users"), where("userName", "==", "admin"));

    //   getDocs(q).then((querySnapshot) => {
    //           querySnapshot.forEach((doc) => {
    //                       const data = doc.data();
    //                       console.log(doc.id, " => ", data);
    //                       dispatch(addUser({ ...data, isAdmin: true }));
    //                     });
    //                     navigate("/admin");
    //     })
    //     .catch((error) => {
    //         console.log("Error getting documents: ", error);
    //     });
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
