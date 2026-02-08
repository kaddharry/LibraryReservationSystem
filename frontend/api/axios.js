import axios from 'axios';

const instance = axios.create({
    // If we are in production (Vercel), use the Render URL. 
    // If in dev (Localhost), use localhost.
    // YOU MUST ADD VITE_API_URL to Vercel Environment Variables later.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export default instance;