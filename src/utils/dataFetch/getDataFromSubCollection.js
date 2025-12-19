import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import db from "../../FireBase/firebase";

const dbData = {};

const getDataFromSubCollection = (collectionName,documentId,subCollectionName,setFunction)=> {
  if (
    dbData[collectionName] &&
    dbData[collectionName][documentId] &&
    dbData[collectionName][documentId][subCollectionName] &&
    dbData[collectionName][documentId][subCollectionName].length > 0
  ){
    setFunction(dbData[collectionName][documentId][subCollectionName])
  } else {
        getDocs(collection(db, `${collectionName}/${documentId}/${subCollectionName}`)).then((querySnapshot)=>{
        console.log('data read from DB');
            
         const dataArr =[];
         querySnapshot.forEach((doc) => {
        //  console.log(doc.id, " => ", doc.data());
        dataArr.push({...doc.data(),categoryId:doc.id})
       
        });
          console.log('i am array : ',dataArr);
          if(dbData[collectionName]){
              if(dbData[collectionName][documentId]){
                dbData[collectionName][documentId] = {
                  ...dbData[collectionName][documentId],
                  [subCollectionName]:dataArr
                };
              }else{
                dbData[collectionName] = {
                  ...dbData[collectionName],
                  [documentId]:{
                    [subCollectionName]:dataArr
                  }
                }
              }
          }else{
            dbData[collectionName] = {
              [documentId]:{
                [subCollectionName]:dataArr
              }
            }
          }

          setFunction(dataArr)        
        }).catch((err)=>console.log(err))
    }}


export default getDataFromSubCollection;