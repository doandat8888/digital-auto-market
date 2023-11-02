import axios, {instancePublishVersion} from "../axiosPackage";

const getVersionByPackageId = (packageId: string, limit: number, currentPage: number) => {
    return axios.get(`/package/${packageId}/version?limit=${limit}&page=${currentPage}`);
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

export default {
    getVersionByPackageId,
    addVersion,
    updateVersion,
    deleteVersion
}