import axios from 'axios'
import { logOut, refreshTokens } from './services/userService'

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_USER_MGMT_URL || 'https://user-mgmt.digitalauto.tech/api/v1',
    withCredentials: true,
})

instance.interceptors.request.use(
    async (apiConfig) => {
        if (!apiConfig.headers) return apiConfig
        const accessToken = localStorage.getItem('token')
        apiConfig.headers.Authorization = `Bearer ${accessToken}`
        return apiConfig
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        return response
    },
    async function (error) {
        const originalRequest = error?.config

        // If the error is 401 and the request has not been retried yet, try to refresh the access token
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const response = await refreshTokens()
                const access = response.data.token
                if (!access) {
                    localStorage.removeItem('token')
                    return Promise.reject(error)
                }
                localStorage.setItem('token', access)
                return instance(originalRequest)
            } catch (_) {
                await logOut()
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

export default instance
