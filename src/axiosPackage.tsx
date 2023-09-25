import axios from 'axios';
const token = localStorage.getItem("token");

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BE_STORE_URL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    },
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        return response;
    },
)

export default instance;