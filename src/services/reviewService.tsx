import axios from "../axiosPackage";

const addReview = (review: IReview) => {
    return axios.post('/review', {
        ...review
    })
}


const getAllReview = () => {
    return axios.get('/review');
}

export default {
    addReview,
    getAllReview
}