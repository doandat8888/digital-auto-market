import axios from "../axiosPackage";

const addReview = (review: IReview) => {
    return axios.post('/review', {
        ...review
    })
}

export default {
    addReview
}