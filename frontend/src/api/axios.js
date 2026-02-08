import axios from 'axios';

const instance = axios.create({
    // Vercel will inject the Render URL here. 
    // If running locally, it falls back to localhost.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export default instance;