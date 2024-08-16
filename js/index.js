import { registerUser, loginUser, logoutUser, onAuthStateChange } from "./components/auth.js";
import { fetchBooks } from "./components/fetchbooks.js";
import { BookList } from './components/bookList.js';
import { addBookToFirestore, loadBooksFromFirestore, removeBookFromFirestore } from "./components/firestoreOperations.js";


const bookList = new BookList('userBookList');

document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (email && password) {
        await registerUser(email, password);
    } else {
        console.error("Please fill in both email and password fields.");
    }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        await loginUser(email, password);
    } else {
        console.error("Please fill in both email and password fields.");
    }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logoutUser();
});

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
                <button class="addBookBtn" data-title="${title}" data-author="${author}">Add</button>
            `;

            searchResults.appendChild(listItem);
        });

        document.querySelectorAll('.addBookBtn').forEach(button => {
            button.addEventListener('click', (event) => {
                const title = event.target.getAttribute('data-title');
                const author = event.target.getAttribute('data-author');
                addBookToUserList(title, author);
            });
        });
    }
}

function addBookToUserList(title, author) {
    const userBookList = document.getElementById('userBookList');
    const listItem = document.createElement('li');
    listItem.textContent = `${title} by ${author}`;
    
    // Create a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    
    // Attach event listener to the remove button
    removeButton.addEventListener('click', () => {
        // Remove the book from the list
        userBookList.removeChild(listItem);
        // You may also want to update any in-memory book list or data structure if applicable
    });
    
    // Append the remove button to the list item
    listItem.appendChild(removeButton);
    
    // Append the list item to the user book list
    userBookList.appendChild(listItem);
}


//backup code incase the one above fails
/*function addBookToUserList(title, author) {
    const userBookList = document.getElementById('userBookList');
    const listItem = document.createElement('li');
    listItem.textContent = `${title} by ${author}`;
    userBookList.appendChild(listItem);
}*/



// Set up the authentication state listener
onAuthStateChange(user => {
    const bookSection = document.getElementById("bookSection");
    const userStatusDiv = document.getElementById("userStatus");

    if (user) {
        userStatusDiv.innerHTML = `Logged in as ${user.email}`;
        bookSection.style.display = 'block';
    } else {
        userStatusDiv.innerHTML = "Not logged in";
        bookSection.style.display = 'none';
    }
});
