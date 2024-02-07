import axios from 'axios';
const token = localStorage.getItem("token");

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_USER_MGMT_URL || 'https://user-mgmt.digitalauto.tech/api/v1',
    headers: {
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