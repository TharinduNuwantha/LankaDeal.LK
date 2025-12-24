import {
  collectionGroup,
  getDocs,
  query,
  where
} from "firebase/firestore";
import db from "../../FireBase/firebase"; // adjust path

export const searchProducts = async (searchText) => {
  if (!searchText.trim()) return [];

  const text = searchText.toLowerCase().trim();

  const q = query(
    collectionGroup(db, "products"),
    where("keywords", "array-contains", text)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};