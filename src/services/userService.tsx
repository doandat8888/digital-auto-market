import axios from '../axios.tsx'

const login = (email: string, password: string) => {
    return axios.post('/user/login', {
        email: email,
        password: password,
    })
}

const register = (email: string, password: string, fullName: string) => {
    return axios.post('/user/register', {
        email: email,
        password: password,
        fullName: fullName,
    })
}

export const refreshTokens = () => {
    return axios.post<{
        token: string
    }>('/user/refresh-tokens')
}

export const logOut = () => {
    localStorage.removeItem('token')
    return axios.post('/user/logout')
}

const getUser = () => {
    return axios.get('/user/current')
}

const getUserById = (idUser: string) => {
    return axios.get(`/user/${idUser}`)
}

const getCurrentUser = () => {
    return axios.get('/user/current')
}

const resetPassword = (email: string) => {
    return axios.post('/user/forget-password', {
        email,
    })
}

const changeProfile = (fullName: string, imageCover: string) => {
    return axios.put(`/user/current`, {
        fullName,
        avt: imageCover,
    })
}

const changePassword = (oldPassword: string, newPassword: string) => {
    return axios.put('/user/change-password', {
        oldPassword,
        newPassword,
    })
}

export default {
    login,
    getUser,
    register,
    getUserById,
    getCurrentUser,
    resetPassword,
    changeProfile,
    changePassword,
}
