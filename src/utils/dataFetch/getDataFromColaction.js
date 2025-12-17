import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import db from "../../FireBase/firebase";

const getDataFromColaction = (collectionName)=> {
    getDocs(collection(db, collectionName)).then((querySnapshot)=>{
         querySnapshot.forEach((doc) => {
         console.log(doc.id, " => ", doc.data());
    });
    })
}

export default getDataFromColaction;