import axiosLogging from "../axiosLogging";

const getAllLoggingService = () => {
    return axiosLogging.get('');
}

export default {
    getAllLoggingService
}