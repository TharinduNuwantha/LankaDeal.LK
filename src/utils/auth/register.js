import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FireBase/firebase";
import setDataDocument from "../dataFetch/setDataDocument";

const userRegister = (email, password,name,address,phoneNumber,profilepicture,role)=>{
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
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        
    });
}

export default userRegister;