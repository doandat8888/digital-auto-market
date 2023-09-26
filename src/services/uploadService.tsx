import axios from "../axiosUpload"

const uploadFile = (data: FormData) => {
    return axios.post('/upload/store-be', data);
}

const deleteFile = (imgName: string) => {
    return axios.delete(`/item?path=/store-be/${imgName}`)
}

export default {
    uploadFile,
    deleteFile
}