import { doc, setDoc } from "firebase/firestore";
import db from "../../FireBase/firebase";

const setDataDocument = (collectionPath, docId, dataSet) => {
    if (!collectionPath || !docId) {
        console.error("setDataDocument: collectionPath and docId are required", { collectionPath, docId });
        return Promise.reject(new Error("Invalid collectionPath or docId"));
    }

    return setDoc(doc(db, collectionPath, docId), dataSet)
        .then(() => {
            console.log("document successfully written", `${collectionPath}/${docId}`);
        })
        .catch((error) => {
            console.log("Error writing document: ", error);
            throw error;
        });
};

export default setDataDocument;