import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FireBase/firebase";


const userLogin = (email, password,navigate,setFierBaseLoginError)=>{
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('login sucsessfully');

        navigate("/")
        // ...tharindunuwantha100@gmail.com  Tharindu123
    })
.catch((error) => {
        const errorCode = error.code;
        
        // --- CHANGE ONLY THIS PART ---
        switch (errorCode) {
            case 'auth/invalid-email':
                setFierBaseLoginError((pre)=>({...pre,emailErr:'The email address is not valid'}))
                console.log("The email address is not valid.");
                break;
            case 'auth/user-not-found':
                 setFierBaseLoginError((pre)=>({...pre,emailErr:'No user found with this email.'}))
                console.log("No user found with this email.");
                break;
            case 'auth/wrong-password':
                 setFierBaseLoginError((pre)=>({...pre,passwoardErr:'Incorrect password. Please try again.'}))
                console.log("Incorrect password. Please try again.");
                break;
                
            case 'auth/invalid-credential':
                 setFierBaseLoginError((pre)=>({...pre,passwoardErr:'Email or password incorrect.'}))
                console.log("Email or password incorrect.");
                break;
            case 'auth/too-many-requests':
                setFierBaseLoginError((pre)=>({...pre,emailErr:'Too many failed attempts. Try again later.'}))
                console.log("Too many failed attempts. Try again later.");
                break;
            default:
                setFierBaseLoginError((pre)=>({...pre,emailErr:'An unknown error occurred:'}))
                console.log("An unknown error occurred: " + error.message);
        }
        // -----------------------------
    });
}

export default userLogin;