import { doc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import db from "../../FireBase/firebase";
import { addToWishlist, removeFromWishlist } from "../../Store/ReduxSlice/userClise";

export const toggleWishlist = async (userId, product, currentWishlist, dispatch) => {
    if (!userId) {
        throw new Error("LoginRequired");
    }

    try {
        const userRef = doc(db, "users", userId);
        const isAlreadyInWishlist = currentWishlist?.some(item => item.id === product.id);

        if (isAlreadyInWishlist) {
            // Remove from Firestore
            // Note: arrayRemove needs the exact object. If the object has extra dynamic fields, 
            // it's safer to use the specific object from currentWishlist.
            const itemToRemove = currentWishlist.find(item => item.id === product.id);
            await setDoc(userRef, {
                wishlist: arrayRemove(itemToRemove)
            }, { merge: true });

            // Update Redux
            dispatch(removeFromWishlist(product.id));
            return false; // Removed
        } else {
            // Add to Firestore
            const itemToAdd = {
                id: product.id,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
                categoryPath: product.categoryPath || "",
                addedAt: new Date().toISOString()
            };

            await setDoc(userRef, {
                wishlist: arrayUnion(itemToAdd)
            }, { merge: true });

            // Update Redux
            dispatch(addToWishlist(itemToAdd));
            return true; // Added
        }

    } catch (error) {
        console.error("Error updating wishlist:", error);
        throw error;
    }
};
