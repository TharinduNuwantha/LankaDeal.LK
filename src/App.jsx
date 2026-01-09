import { useEffect, useState, createContext, useContext } from 'react';
import './App.css';

import AppRouters from './Routers/AppRouters';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from './FireBase/firebase';
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
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user logged in:", user);

        setUserId(uid);

        // Start listening to user document in real-time
        const docRef = doc(db, 'users', uid);
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            dispatch(addUser(docSnap.data()));
          }
        }, (error) => {
          console.error("Error listening to user doc:", error);
        });

      } else {
        console.log("no user");
        setUserId(null);
        dispatch(removeUser({ name: "no-user" }));

        // Clean up doc listener when user logs out
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
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