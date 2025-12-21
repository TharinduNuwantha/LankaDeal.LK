import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FireBase/firebase";
import setDataDocument from "../dataFetch/setDataDocument";
import { useNavigate } from "react-router-dom";

const userRegister = (email, password,name,address,phoneNumber,profilepicture,role,setFierBaseregError,navigater)=>{
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        
        const userDataSet = {
            name,
            address,
            email,
            phoneNumber,
            profilepicture,
            uid: user.uid,
            role
        }
        setDataDocument("users",user.uid,userDataSet);
        navigater("/")
    })
    .catch((error) => {
            const errorCode = error.code;
            let friendlyMessage = "Something went wrong. Please try again.";

            switch (errorCode) {
                case 'auth/email-already-in-use':
                    friendlyMessage = "This email is already registered. Please login instead.";
                    break;
                case 'auth/invalid-email':
                    friendlyMessage = "The email address you entered is invalid.";
                    break;
                case 'auth/weak-password':
                    friendlyMessage = "Your password is too weak. Please use at least 6 characters.";
                    break;
                case 'auth/operation-not-allowed':
                    friendlyMessage = "Email/password accounts are not enabled. Contact support.";
                    break;
                case 'auth/network-request-failed':
                    friendlyMessage = "Network error. Please check your internet connection.";
                    break;
                case 'auth/too-many-requests':
                    friendlyMessage = "Too many attempts. Please wait a moment and try again.";
                    break;
                default:
                    friendlyMessage = "Registration failed. Please try again later.";
                    console.error("Raw Error:", error.message);
            }
            setFierBaseregError(friendlyMessage);
    });
}

export default userRegister;