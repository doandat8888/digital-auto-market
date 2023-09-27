import axios from "../axiosPackage";

const getVersionByPackageId = (packageId: string) => {
    return axios.get(`/package/${packageId}/version`);
}

export default {
    getVersionByPackageId
}