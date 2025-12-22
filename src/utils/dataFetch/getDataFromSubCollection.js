import { collection, getDocs } from "firebase/firestore";
import db from "../../FireBase/firebase";


// Cache object
const dbData = {};

const getDataFromSubCollection = (collectionName, documentId, subCollectionName, setFunction) => {
  console.log(`Fetching: ${collectionName}/${documentId}/${subCollectionName}`);
  console.log('ඩොකියිමන් අයිඩී ',documentId)
  // Check cache first
  if (
    dbData[collectionName] &&
    dbData[collectionName][documentId] &&
    dbData[collectionName][documentId][subCollectionName] &&
    dbData[collectionName][documentId][subCollectionName].length > 0
  ) {
    console.log('Returning cached data');
    console.log('පලවෙනි එක: ',dbData);
    setFunction(dbData[collectionName][documentId][subCollectionName]);
    return;
  }

  // Fetch from Firebase
  try {
    const subCollectionRef = collection(db, collectionName, documentId, subCollectionName);
    console.log('කනෙක්ශන් රෙෆ් : ',subCollectionRef);
    
    getDocs(subCollectionRef).then((querySnapshot) => {
      console.log(`Data read from DB: ${querySnapshot.size} documents`);
      
      const dataArr = [];
      querySnapshot.forEach((doc) => {
        // Include the document ID as 'id' field
        dataArr.push({ 
          id: doc.id, 
          ...doc.data() 
        });
      });

      console.log('Processed array:', dataArr);

      // Update cache
      if (!dbData[collectionName]) {
        dbData[collectionName] = {};
      }
      if (!dbData[collectionName][documentId]) {
        dbData[collectionName][documentId] = {};
      }
      
      dbData[collectionName][documentId][subCollectionName] = dataArr;

      // Update state
      setFunction(dataArr);
         console.log('දෙවනි එක: ',dataArr);
      
    }).catch((err) => {
      console.error("Error fetching data from Firebase:", err);
      setFunction([]); // Set empty array on error
    });

  } catch (error) {
    console.error("Error creating reference:", error);
    setFunction([]);
  }
};

export default getDataFromSubCollection;