import axios from "../axiosUpload"

const uploadFile = (data: FormData) => {
    return axios.post('/upload/store-be', data);
}

const deleteFile = (fileName: string) => {
    return axios.delete(`/item?path=${fileName}`)
}

export default {
    uploadFile,
    deleteFile
}