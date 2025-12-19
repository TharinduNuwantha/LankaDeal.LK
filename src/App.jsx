import { useEffect } from 'react';
import './App.css';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AppRouters from './Routers/AppRouters';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './FireBase/firebase';
import getDataDocument from './utils/dataFetch/getDataDocument';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser, userSelecter } from './Store/ReduxSlice/userClise';


function App() {
  const dispatch = useDispatch()
  const userData = useSelector(userSelecter)
  console.log(userData);
  
  useEffect(()=>{
    const userCheack = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        getDataDocument('users', uid, (dataset) => {
          dispatch(addUser(dataset))
        })
        // ...
      } else {  
        // User is signed out
        console.log("no user");
        dispatch(removeUser())
      }
    });
    return()=> userCheack
  },[])
  return (
    <div>
      <AppRouters/>
    </div>
  );
}

export default App;
