import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FireBase/firebase";

const userRegister = (email, password)=>{
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        
    });
}

export default userRegister;