import axios from 'axios';
const api = axios.create({
    baseURL: 'https://us-central1-anonibus-cb1ea.cloudfunctions.net',
});
export default api;