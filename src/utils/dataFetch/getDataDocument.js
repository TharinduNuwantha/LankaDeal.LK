import { doc, getDoc } from "firebase/firestore";
import db from "../../FireBase/firebase";

const getDataDocument = (collectionPath, documentId, setFunction) => {
    if (!collectionPath || !documentId) {
        console.error("getDataDocument: collectionPath and documentId are required", { collectionPath, documentId });
        return Promise.reject(new Error("Invalid collectionPath or documentId"));
    }

    const docRef = doc(db, collectionPath, documentId);
    return getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                setFunction(docSnap.data());
            } else {
                console.log("getDataDocument: no document found", docRef.path);
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
            throw error;
        });
};

export default getDataDocument;