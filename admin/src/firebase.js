import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkuCyYD8KwR1n-9qJKSkq3qJz8bzt5dVo",
  authDomain: "datn-bc01d.firebaseapp.com",
  projectId: "datn-bc01d",
  storageBucket: "datn-bc01d.appspot.com",
  messagingSenderId: "1001975945671",
  appId: "1:1001975945671:web:6e33e19bd07d1be9d161e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

