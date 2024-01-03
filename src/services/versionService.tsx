import axios, {instancePublishVersion} from "../axiosPackage";


const getAllVersion = (limit: number, page: number) => {
    return axios.get(`/version?limit=${limit}&page=${page}`);
}

const getVersionByPackageId = (packageId: string, limit: number, currentPage: number) => {
    return axios.get(`/package/${packageId}/version?limit=${limit}&page=${currentPage}`);
}

const getVersionByName = (limit: number, page: number, versionName: string) => {
    return axios.get(`/version?name=${versionName}&limit=${limit}&page=${page}`)
} 

const addVersion = (version: IAddVersion) => {
    return instancePublishVersion.post('/version', {
        ...version
    })
}

const updateVersion = (version: IUpdateVersion) => {
    return axios.put(`/version/${version._id}`, {
        ...version
    })
}

const deleteVersion = (versionId: string) => {
    return axios.delete(`/version/${versionId}`);
}

const changeStatus = (packageId: string, status: string) => {
    return axios.put(`/version/${packageId}/${status === "approved" ? 'reject' : 'approve'}`);
}

export default {
    getVersionByPackageId,
    addVersion,
    updateVersion,
    deleteVersion,
    getAllVersion,
    getVersionByName,
    changeStatus
}