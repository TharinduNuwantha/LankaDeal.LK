import { useEffect, useState, createContext, useContext } from 'react';
import './App.css';

import AppRouters from './Routers/AppRouters';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './FireBase/firebase';
import getDataDocument from './utils/dataFetch/getDataDocument';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser, userSelecter, isLoadingSelector } from './Store/ReduxSlice/userClise';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create and export the custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

function App() {
  const dispatch = useDispatch();
  const userData = useSelector(userSelecter);
  
  // 3. State to hold the userId locally for the Context
  const [userId, setUserId] = useState(null);

  console.log(userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user kenek indoooo", user);
        
        // 4. Save uid to Context state
        setUserId(uid);

        // Existing Redux logic
        getDataDocument('users', uid, (dataset) => {
          dispatch(addUser(dataset));
        });
      } else {
        console.log("no user");
        
        // 5. Clear uid from Context state
        setUserId(null);

        // Existing Redux logic
        dispatch(removeUser({ name: "no-user" }));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    // 6. Wrap the application in the Provider and pass the userId
    <AuthContext.Provider value={{ userId }}>
      <div>
        <AppRouters />
      </div>
   
    </AuthContext.Provider>
    
  );
}

export default App;