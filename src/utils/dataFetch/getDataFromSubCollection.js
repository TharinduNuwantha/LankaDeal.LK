import { collectionGroup, query, where, getDocs, collection } from "firebase/firestore";
import db from "../../FireBase/firebase";
import { addData } from "../../Store/ReduxSlice/categorySlice";



// Cache object
const dbData = {};

const getDataFromSubCollection = (collectionName, documentId, subCollectionName, setFunction,dispatch,addData) => {

const myArr = [];
  const colRef = collection(db, collectionName, documentId, "products");

  getDocs(colRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
       
        myArr.push({ id: doc.id, ...doc.data() });
      });

   
      setFunction(myArr);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });

};

export default getDataFromSubCollection;




































    // const subCollectionRef = collection(db, collectionName, documentId, subCollectionName);
    // console.log('කනෙක්ශන් රෙෆ් : ',subCollectionRef);
    
    // getDocs(subCollectionRef).then((querySnapshot) => {
    //   console.log(`Data read from DB: ${querySnapshot.size} documents`);
      
    //   const dataArr = [];
    //   querySnapshot.forEach((doc) => {
    //     // Include the document ID as 'id' field
    //     dataArr.push({ 
    //       id: doc.id, 
    //       ...doc.data() 
    //     });
    //   });

    //   console.log('Processed array:', dataArr);

    //   // Update cache
    //   if (!dbData[collectionName]) {
    //     dbData[collectionName] = {};
    //   }
    //   if (!dbData[collectionName][documentId]) {
    //     dbData[collectionName][documentId] = {};
    //   }
      
    //   dbData[collectionName][documentId][subCollectionName] = dataArr;

    //   // Update state
    //   setFunction(dataArr);
    //      console.log('දෙවනි එක: ',dataArr);
      
    // }).catch((err) => {
    //   console.error("Error fetching data from Firebase:", err);
    //   setFunction([]); // Set empty array on error
    // });
