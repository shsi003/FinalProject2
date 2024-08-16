
import { Book } from './book.js';

export class BookList {
    constructor(elementId) {
        this.books = [];
        this.element = document.getElementById(elementId);
    }

    addBook(book) {
        this.books.push(book);
        this.render();
    }

    render() {
        this.element.innerHTML = '';
        this.books.forEach(book => {
            const listItem = document.createElement('li');
            listItem.textContent = `${book.title} by ${book.author}`;
            this.element.appendChild(listItem);
        });
    }
}
