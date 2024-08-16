// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3fWYQ48GU7HSqXIjWljyLOzKImd3SErA",
  authDomain: "finalproject-dbe66.firebaseapp.com",
  projectId: "finalproject-dbe66",
  storageBucket: "finalproject-dbe66.appspot.com",
  messagingSenderId: "408503082149",
  appId: "1:408503082149:web:34a3c11cd40413e542c14c",
  measurementId: "G-C8KP3FBS6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;