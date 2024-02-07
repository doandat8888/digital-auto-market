import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_LOGGING_URL || "https://logging.digitalauto.tech",
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        return response;
    },
)

export default instance;