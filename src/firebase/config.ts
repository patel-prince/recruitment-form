// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlw0LHHQSPIkcz7GWBWqFvqaUyoQz-Lgc",
  authDomain: "recruitment-form-5be2a.firebaseapp.com",
  projectId: "recruitment-form-5be2a",
  storageBucket: "recruitment-form-5be2a.firebasestorage.app",
  messagingSenderId: "348511608025",
  appId: "1:348511608025:web:4cba78e17992d3cc86f2c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 