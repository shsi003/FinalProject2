// auth.js
import { auth } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
    } catch (error) {
        console.error("Error registering user:", error);
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

onAuthStateChanged(auth, (user) => {
    const userStatusDiv = document.getElementById("userStatus");
    if (user) {
        userStatusDiv.innerHTML = `Logged in as ${user.email}`;
    } else {
        userStatusDiv.innerHTML = "Not logged in";
    }
});
