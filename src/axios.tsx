import axios from 'axios';
import _ from 'lodash';

const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA4MzIxNTRlY2FlY2NlNjQ5NjgxNzgiLCJlbWFpbCI6InR1YW4tdGVzdEBnbWFpbC5jb20iLCJvcmciOiJFVEEiLCJmdWxsTmFtZSI6IlR1YW4tdGVzdCIsImlhdCI6MTY5NTIxOTYxMCwiZXhwIjoxNjk1MjIzMjEwfQ.BO1DWreRTefKLX3Otpz5Ws_MhLH7JtOUP4W9mDz2jUk"

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    headers: {
        'Authorization': `Bearer ${userToken}`, // Gửi token trong header Authorization
        'Content-Type': 'application/json',
    },
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        return response;
    },
)

export default instance;