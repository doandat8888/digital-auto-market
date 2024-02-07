import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.tech/" || "https://upload.digitalauto.tech/",
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        return response;
    },
)

export default instance;