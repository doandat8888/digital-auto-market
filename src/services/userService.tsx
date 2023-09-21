import axios from "../axios.tsx"

const login = (email: string, password: string) => {
    return axios.post("/user/login", {
        email: email,
        password: password
    });
}

const getUser = () => {
    return axios.get("/user/current");
}

export default {
    login,
    getUser
}