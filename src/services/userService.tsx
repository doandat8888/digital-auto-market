import axios from "../axios.tsx";

const login = (email: string, password: string) => {
    return axios.post("/user/login", {
        email: email,
        password: password
    });
}

const register = (email: string, password: string, fullName: string) => {
    return axios.post("/user/register", {
        email: email,
        password: password,
        fullName: fullName
    });
}

const getUser = () => {
    return axios.get("/user/current");
}

const getUserById = (idUser: string) => {
    return axios.get(`/user/${idUser}`);
}

export default {
    login,
    getUser,
    register,
    getUserById
}