import { useEffect } from 'react';
import './App.css';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AppRouters from './Routers/AppRouters';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './FireBase/firebase';
import getDataDocument from './utils/dataFetch/getDataDocument';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser, userSelecter, isLoadingSelector } from './Store/ReduxSlice/userClise';


function App() {
  const dispatch = useDispatch()
  const userData = useSelector(userSelecter)
  console.log(userData);
  
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log("user kenek indoooo", user);

      getDataDocument('users', uid, (dataset) => {
        dispatch(addUser(dataset));
      });
    } else {
      console.log("no user");
      dispatch(removeUser({ name: "no-user" }));
    }
  });

  return () => unsubscribe();
}, [dispatch]);

  return (
    <div>
      <AppRouters/>
    </div>
  );
}

export default App;
