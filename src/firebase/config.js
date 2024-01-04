import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import the storage module

const firebaseConfig = {
  apiKey: "AIzaSyAFJShzMOnAVFvF-Pu3QkYQe2Zhv2AsgNA",
  authDomain: "turbo-meme-9f2fa.firebaseapp.com",
  projectId: "turbo-meme-9f2fa",
  storageBucket: "turbo-meme-9f2fa.appspot.com",
  messagingSenderId: "150033800201",
  appId: "1:150033800201:web:459a2e58d0ea48edde2cd8",
  measurementId: "G-J9HCQ2TL2C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Include the storage instance

export { auth, firestore, storage }; // Export the storage instance
