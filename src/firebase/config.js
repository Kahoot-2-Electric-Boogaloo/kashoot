// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFJShzMOnAVFvF-Pu3QkYQe2Zhv2AsgNA",
  authDomain: "turbo-meme-9f2fa.firebaseapp.com",
  projectId: "turbo-meme-9f2fa",
  storageBucket: "turbo-meme-9f2fa.appspot.com",
  messagingSenderId: "150033800201",
  appId: "1:150033800201:web:459a2e58d0ea48edde2cd8",
  measurementId: "G-J9HCQ2TL2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
