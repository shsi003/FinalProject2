import { db } from '../firebaseConfig.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';


export async function addBookToFirestore(userId, title, author) {
    const userBooksRef = collection(db, `users/${userId}/books`);
    await addDoc(userBooksRef, { title, author });
}


export async function loadBooksFromFirestore(userId, callback) {
    const userBooksRef = collection(db, `users/${userId}/books`);
    const querySnapshot = await getDocs(userBooksRef);
    const books = [];
    querySnapshot.forEach(doc => {
        books.push({ id: doc.id, ...doc.data() });
    });
    callback(books);
}


export async function removeBookFromFirestore(userId, bookId) {
    const bookRef = doc(db, `users/${userId}/books`, bookId);
    await deleteDoc(bookRef);
}