// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//   apiKey: import.meta.env.FIREBASE_API_KEY,
  apiKey: "AIzaSyC1_pdXgKnB9MCnBDaC-ieKuphCdR8drsg",  
  authDomain: "auth-app-3a860.firebaseapp.com",
  projectId: "auth-app-3a860",
  storageBucket: "auth-app-3a860.appspot.com",
  messagingSenderId: "1082477625789",
  appId: "1:1082477625789:web:63329e5d78ef08893112d4",
  measurementId: "G-CY053HC3JB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);