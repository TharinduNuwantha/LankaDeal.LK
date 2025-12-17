import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import db from "../../FireBase/firebase";

const getDataFromColaction = (collectionName,setFunction)=> {
    getDocs(collection(db, collectionName)).then((querySnapshot)=>{
         const dataArr =[];
         querySnapshot.forEach((doc) => {
        //  console.log(doc.id, " => ", doc.data());
        dataArr.push({...doc.data(),categoryId:doc.id})
       
    });
        console.log('i am array : ',dataArr);
         setFunction(dataArr)        
    })
}

export default getDataFromColaction;