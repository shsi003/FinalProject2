const API_URL = 'https://openlibrary.org/search.json';

export async function fetchBooks(query) {
    try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.docs || [];
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}

  