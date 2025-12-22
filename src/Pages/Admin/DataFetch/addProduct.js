// productService.js
// 1. Change imports to use FIRESTORE
import { collection, addDoc } from "firebase/firestore";
// 2. Import the Firestore 'db' instance you exported as default
import db from "../../../FireBase/firebase"; 

/**
 * Uploads a new product to a subcollection in Firestore.
 * * Logic: 
 * If categoryPath is "category/Electronics/Audio/Headphones",
 * we will save the product into: "category/Electronics/Audio/Headphones/products"
 * * @param {string} categoryPath - The path to the specific category document
 * @param {object} productData - The product details
 * @returns {Promise<string>} - Returns the new Product ID
 */
export const addProductToFirebase = async (categoryPath, productData) => {
  console.log('Target Firestore Path:', categoryPath);

  try {
    // 3. Create a reference to a "products" subcollection inside the category path
    // This creates: category -> [Main] -> [Sub] -> [Child] -> products -> [New_ID]
    const productsCollectionRef = collection(db, categoryPath, "products");

    // 4. Add the document (Firestore automatically generates a unique ID)
    const docRef = await addDoc(productsCollectionRef, productData);

    console.log("Product added to Firestore with ID:", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Error adding product to Firestore:", error);
    throw error;
  }
};