// myapp\src\utils\AddToCart\addToCart.js
import { doc, setDoc, arrayUnion } from "firebase/firestore"; 
import db from "../../FireBase/firebase";
import { addToCart as addToCartAction } from "../../Store/ReduxSlice/userClise";


export const addToCart = async (userId, product, currentCartData, dispatch) => {
    if (!userId) {
        console.error("User not logged in");
        return;
    }

    try {
        const userRef = doc(db, "users", userId);

        const itemToAdd = {
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            imageUrl: product.imageUrl,
            categoryPath: product.categoryPath,
            fastDelivery: product.fastDelivery,
            stockCount: product.stockCount,
            inStock: product.inStock,
            quantity: 1, 
            addedAt: new Date().toISOString()
        };

        // 1. Check if item is already in the local array to prevent duplicates
        const isAlreadyInCart = currentCartData?.some(item => item.id === product.id);
        if (isAlreadyInCart) {
            console.log("Item already in cart list");
            return;
        }

        // 2. Update Firestore
        // This will now work once you delete the old 'cart' object from the DB
        await setDoc(userRef, {
            cart: arrayUnion(itemToAdd)
        }, { merge: true });

        console.log("Firestore updated successfully");

        // 3. Update Redux 
        // FIX: Do NOT call dispatch(addToCart(...)). 
        // Use the string name of your action from your Slice.
        // If your slice name is "user", the action is likely "user/addToCart"
  dispatch(addToCartAction(itemToAdd));

    } catch (error) {
        console.error("Error updating cart:", error);
    }
};