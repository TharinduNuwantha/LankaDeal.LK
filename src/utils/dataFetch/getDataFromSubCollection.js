import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import db from "../../FireBase/firebase";

// const dbData = {};

const getDataFromSubCollection = (collectionName,documentId,subCollectionName,setFunction)=> {

        getDocs(collection(db, `${collectionName}/${documentId}/${subCollectionName}`)).then((querySnapshot)=>{
        console.log('data read from DB');
            
         const dataArr =[];
         querySnapshot.forEach((doc) => {
        //  console.log(doc.id, " => ", doc.data());
        dataArr.push({...doc.data(),categoryId:doc.id})
       
        });
          console.log('i am array : ',dataArr);
        //   dbData[collectionName] = dataArr 
          setFunction(dataArr)        
        })
    }


export default getDataFromSubCollection;