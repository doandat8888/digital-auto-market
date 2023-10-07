import axios from "../axiosPackage";

const addReview = (review: IReview) => {
    return axios.post('/review', {
        ...review
    })
}

const getAllReview = () => {
    return axios.get('/review?limit=30');
}

const getReviewByPackageId = (packageId: string) => {
    return axios.get(`/review?packageId=${packageId}`)
}

const updateReview = (reviewId: string, review: IReview) => {
    return axios.put(`/review/${reviewId}`, {
        ...review
    });
}

const deleteReview = (reviewId: string) => {
    return axios.delete(`/review/${reviewId}`);
}

export default {
    addReview,
    getAllReview,
    getReviewByPackageId,
    updateReview,
    deleteReview
}