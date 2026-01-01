import { useEffect } from "react";
import "./App.css";

import AppRouters from "./Routers/AppRouters";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "./Store/ReduxSlice/userClise";
import getDataDocument from "./utils/dataFetch/getDataDocument";
import { useAuth } from "./context/AuthContext";

function App() {
  const dispatch = useDispatch();
  const { uid, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (uid) {
      // fetch user document using uid
      getDataDocument("users", uid, (dataset) => {
        dispatch(addUser(dataset));
      });
    } else {
      dispatch(removeUser({ name: "no-user" }));
    }
  }, [uid, authLoading, dispatch]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AppRouters />
    </div>
  );
}

export default App;
