import { signOut } from "firebase/auth"
import { auth } from "../../FireBase/firebase"

const logout = ()=>{
    signOut(auth)
    .then(()=>{
        console.log('log out sucsessfully');
        
    }).catch((err)=>{
        console.log("Logout error :( ",err);
        
    })
}

export default logout;