import axios from "../axiosPackage";

const getVersionByPackageId = (packageId: string) => {
    return axios.get(`/package/${packageId}/version`);
}

const addVersion = (version: IAddVersion) => {
    return axios.post('/version', {
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