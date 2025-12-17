// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxMzHeOMI1I07TpqogkHsArEfCMupumIc",
  authDomain: "lankadeal-77b4e.firebaseapp.com",
  projectId: "lankadeal-77b4e",
  storageBucket: "lankadeal-77b4e.firebasestorage.app",
  messagingSenderId: "1015749746276",
  appId: "1:1015749746276:web:4620a8e376e9299646c971"
};

// Initialize Firebase
const app = getApp.length?getApp():initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
// firebase deploy