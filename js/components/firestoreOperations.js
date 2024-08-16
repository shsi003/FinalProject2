import { db } from '../firebaseConfig.js';
import {  addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

import { collection} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { auth } from "../firebaseConfig.js";

// Function to load books from Firestore and execute a callback with the books
export const loadBooksFromFirestore = async (callback) => {
    const user = auth.currentUser;

    if (user) {
        try {
            // Use user email as a part of the document path
            const userBooksRef = collection(db, "users", user.email.replace('.', ','), "bookList");
            const userBooksSnap = await getDocs(userBooksRef);

            const books = [];
            userBooksSnap.forEach(doc => {
                books.push(doc.data());
            });

            if (typeof callback === 'function') {
                callback(books);
            } else {
                console.error("Provided callback is not a function");
            }
        } catch (error) {
            console.error("Error retrieving books:", error);
        }
    } else {
        console.log("No user is currently signed in.");
    }
};

export async function addBookToFirestore(userId, title, author) {
    const userBooksRef = collection(db, `users/${userId}/books`);
    await addDoc(userBooksRef, { title, author });
}


/*export async function loadBooksFromFirestore(userId, callback) {
    const userBooksRef = collection(db, `users/${userId}/books`);
    const querySnapshot = await getDocs(userBooksRef);
    const books = [];
    querySnapshot.forEach(doc => {
        books.push({ id: doc.id, ...doc.data() });
    });
    callback(books);
}*/


export async function removeBookFromFirestore(userId, bookId) {
    const bookRef = doc(db, `users/${userId}/books`, bookId);
    await deleteDoc(bookRef);
}