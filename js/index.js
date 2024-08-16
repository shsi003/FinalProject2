import { registerUser, loginUser, logoutUser, onAuthStateChange, getUserBookList } from "./components/auth.js";
import { fetchBooks } from "./components/fetchbooks.js";
import { BookList } from './components/bookList.js';
import { addBookToFirestore, loadBooksFromFirestore, removeBookFromFirestore } from "./components/firestoreOperations.js";

const bookList = new BookList('userBookList');
let currentUserId = null;

// Function to update user book list on UI
const updateBookListUI = async () => {
    if (currentUserId) {
        const userBookList = await getUserBookList();
        const userBookListElement = document.getElementById('userBookList');
        userBookListElement.innerHTML = ''; // Clear existing list

        if (userBookList.length > 0) {
            userBookList.forEach(book => addBookToUserList(book.title, book.author, book.id));
            userBookListElement.style.display = 'block'; // Ensure it is visible
        } else {
            userBookListElement.innerHTML = '';
            userBookListElement.style.display = 'block'; // Ensure it is visible
        }
    } else {
        console.log("No user is currently signed in.");
    }
};

// Register Button Click Handler
document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (email && password) {
        await registerUser(email, password);
    } else {
        console.error("Please fill in both email and password fields.");
    }
});

// Login Button Click Handler
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        await loginUser(email, password);
		document.getElementById('bookSection').style.display='block';
    } else {
        console.error("Please fill in both email and password fields.");
    }
});

// Logout Button Click Handler
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logoutUser();
    currentUserId = null;
    document.getElementById('userBookList').innerHTML = '';
    document.getElementById('userBookList').style.display = 'none'; // Hide the list on logout
});

// Search Button Click Handler
document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = document.getElementById("searchField").value;
    const searchResults = document.getElementById("searchResults");

    if (query) {
        const books = await fetchBooks(query);
        displayBooks(books);
    } else {
        searchResults.innerHTML = 'Please enter a search term.';
    }
});

// Display Books
function displayBooks(books) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (books.length === 0) {
        searchResults.innerHTML = 'No books found.';
    } else {
        books.forEach(book => {
            const listItem = document.createElement('li');
            const title = book.title_suggest || 'No title';
            const author = book.author_name ? book.author_name.join(', ') : 'No author';

            listItem.innerHTML = `
                ${title} by ${author}
                <button class="addBookBtn" data-title="${title}" data-author="${author}" data-id="${book.key}">Add</button>
            `;

            searchResults.appendChild(listItem);
        });

        document.querySelectorAll('.addBookBtn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const title = event.target.getAttribute('data-title');
                const author = event.target.getAttribute('data-author');
                const id = event.target.getAttribute('data-id');

                if (currentUserId) {
                    addBookToUserList(title, author, id);
                    await addBookToFirestore(currentUserId, title, author, id);
                } else {
                    console.error("User must be logged in to add books.");
                }
            });
        });
    }
}

// Add Book to User List UI
function addBookToUserList(title, author, id) {
    const userBookList = document.getElementById('userBookList');
    const listItem = document.createElement('li');
    listItem.textContent = `${title} by ${author}`;

    // Create and add remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', async () => {
        userBookList.removeChild(listItem);
        await removeBookFromFirestore(currentUserId, id);
    });

    listItem.appendChild(removeButton);
    userBookList.appendChild(listItem);
}

// Set up the authentication state listener
onAuthStateChange((user) => {
    if (user) {
        currentUserId = user.uid;
        console.log("User is signed in:", user.email);
        updateBookListUI(); // Fetch and display the user's book list
    } else {
        console.log("No user is signed in.");
        currentUserId = null;
        document.getElementById('userBookList').innerHTML = ''; // Clear book list
        document.getElementById('userBookList').style.display = 'none'; // Hide the list
    }
});