// Fetching de datos en TypeScript
// Usar el nombre del archivo como módulo .mts para tratarlo como un módulo ECMAScript
// Importante: Asegúrate de que tu entorno soporte fetch y async/await

export type PlaceholderAPIPost = {
    userId: number;
    id:     number;
    title:  string;
    body:   string;
}


const API_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchData() {
	const response = await fetch(API_URL);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // You can handle the response here, e.g.:
	const data = await response.json() as PlaceholderAPIPost[];

    // Example: Log each post's ID and title
	data.forEach(post => {
        console.log(`Post ID: ${post.id}, Title: ${post.title}`);
    });
    return data;
}

fetchData();