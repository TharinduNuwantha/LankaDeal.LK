import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import db from "../../FireBase/firebase";

const dbData = {};

const getDataFromColaction = (collectionName,setFunction)=> {
    if(dbData[collectionName] && dbData[collectionName].length>0){
        console.log('category ==> ',dbData[collectionName])
        setFunction(dbData[collectionName])
    }else{
        getDocs(collection(db, collectionName)).then((querySnapshot)=>{
        console.log('data read from DB මම පකෝ');
            
         const dataArr =[];
         querySnapshot.forEach((doc) => {
        //  console.log(doc.id, " => ", doc.data());
        dataArr.push({...doc.data(),categoryId:doc.id})
       
        });
          console.log('i am array : ',dataArr);
          dbData[collectionName] = dataArr 
          setFunction(dataArr)        
        }).catch((err)=>console.log(err))
    }
}

export default getDataFromColaction;