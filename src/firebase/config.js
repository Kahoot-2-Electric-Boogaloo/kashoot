import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

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
export const auth = getAuth(app);
export const firestore = getFirestore(app);
