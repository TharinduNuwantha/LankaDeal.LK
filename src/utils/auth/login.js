import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FireBase/firebase";

const userLogin = (email, password)=>{
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('login sucsessfully');
        
        // ...tharindunuwantha100@gmail.com  Tharindu123
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        
    });
}

export default userLogin;