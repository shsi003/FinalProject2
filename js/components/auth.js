import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { auth, db } from "../firebaseConfig.js";
import { collection, doc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Register User
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
    } catch (error) {
        console.error("Error registering user:", error);
    }
};

// Login User
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

// Logout User
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

// Save Book to User List
export const saveBookToUserList = async (book) => {
    const user = auth.currentUser; // Get the currently authenticated user
    if (user) {
        try {
            const bookRef = doc(db, "users", user.uid, "bookList", book.id);
            await setDoc(bookRef, book);
            console.log("Book saved:", book);
        } catch (error) {
            console.error("Error saving book:", error);
        }
    } else {
        console.log("No user is currently signed in.");
    }
};

// Retrieve User's Book List
export const getUserBookList = async () => {
    const user = auth.currentUser; // Get the currently authenticated user

    if (user) {
        try {
            const userBooksRef = collection(db, "users", user.uid, "bookList");
            const userBooksSnap = await getDocs(userBooksRef);

            const books = [];
            userBooksSnap.forEach(doc => {
                books.push(doc.data());
            });

            if (books.length > 0) {
                return books;
            } else {
                console.log("No books found.");
                return [];
            }
        } catch (error) {
            console.error("Error retrieving books:", error);
            return [];
        }
    } else {
        console.log("No user is currently signed in.");
        return [];
    }
};

export const setupAuthStateListener = (callback) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.email);
            
            getUserBookList().then((userBookList) => {
                
                if (callback && typeof callback === 'function') {
                    callback(userBookList);
                }
            });
        } else {
            console.log("No user is signed in.");
            if (callback && typeof callback === 'function') {
                callback([]);
            }
        }
    });
};


export const onAuthStateChange = (callback) => {
    onAuthStateChanged(auth, callback);
};
