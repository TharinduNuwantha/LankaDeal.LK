// productService.js
import { getDatabase, ref, push, set } from "firebase/database";
import { app } from "../../../FireBase/firebase"; 

// Initialize DB
const db = getDatabase(app);

/**
 * Uploads a new product to the specific Category Path in Firebase.
 * * @param {string} categoryPath - The generated path (e.g., "/category/Electronics/...")
 * @param {object} productData - The object containing title, price, image, etc.
 * @returns {Promise<string>} - Returns the new Product ID on success
 */
export const addProductToFirebase = async (categoryPath, productData) => {
  try {
    // 1. Create a reference to the specific category path
    const categoryRef = ref(db, categoryPath);

    // 2. Generate a unique key (ID) for the new product
    const newProductRef = push(categoryRef);

    // 3. Save the data to that unique key
    await set(newProductRef, productData);

    console.log("Product added successfully with ID:", newProductRef.key);
    return newProductRef.key;

  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Re-throw to handle it in the UI if needed
  }
};