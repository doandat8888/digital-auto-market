import axios from 'axios';
const token = localStorage.getItem("token");

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BE_STORE_URL || 'https://store-be.digitalauto.asia',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`,
    },
});

export const instancePublishVersion = axios.create({
    baseURL: import.meta.env.VITE_APP_BE_STORE_URL || 'https://store-be.digitalauto.asia',
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
    },
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        return response;
    },
)

export default instance;
