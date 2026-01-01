import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FireBase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [uid, setUid] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ uid, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook (important)
export const useAuth = () => {
  return useContext(AuthContext);
};
