import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import db from "../../FireBase/firebase";
import { useDispatch } from "react-redux";
import addData from "../../Store/ReduxSlice/categorySlice"

// Cache object
const dbData = {};

const getDataFromSubCollection = (collectionName, documentId, subCollectionName, setFunction) => {
  const dispatch = useDispatch
  console.log(`Searching all products under category: ${documentId}`);

  // 1. Check cache first
  if (dbData[documentId]) {
    console.log('Returning cached data');
    setFunction(dbData[documentId]);
    dispatch(addData(dbData[documentId]))
    return;
  }

  // 2. Fetch using Collection Group
  // This finds ALL "products" collections, then we filter by the parent path
  const productsQuery = query(collectionGroup(db, "products"));

  getDocs(productsQuery)
    .then((querySnapshot) => {
      const dataArr2 = [];
      
      querySnapshot.forEach((doc) => {
        // We check if the document's path includes your dynamic ID (e.g., "Health_and_Wellness")
        if (doc.ref.path.includes(documentId)) {
          dataArr2.push({
            id: doc.id,
            ...doc.data(),
            fullPath: doc.ref.path // Optional: helps you see where it came from
          });
        }
      });

      console.log(`Found ${dataArr2.length} items for ${documentId}`);
      
      // Update Cache
      dbData[documentId] = dataArr2;
      
      // Update State
      setFunction(dataArr2);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setFunction([]);
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
