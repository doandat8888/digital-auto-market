import axios from "../axiosPackage.tsx";

const addNewPackage = (packageAdd: IAddPackage) => {
    return axios.post('/package', {
        name: packageAdd.name,
        thumbnail: packageAdd.thumbnail,
        images: packageAdd.images,
        video: "none",
        shortDesc: packageAdd.shortDesc,
        fullDesc: packageAdd.fullDesc,
        license: "1.0.0",
        visibility: packageAdd.visibility,
        authors: packageAdd.authors,
        downloadUrl: packageAdd.downloadUrl,
        deploymentUrl: packageAdd.deploymentUrl,
    })
}

const getAllPackage = () => {
    return axios.get('/package');
}

const getPackageById = (packageId: string) => {
    return axios.get(`/package/${packageId}`);
}

const updatePackage = (packageUpdate: any) => {
    return axios.put(`/package/${packageUpdate._id}`, {
       ...packageUpdate,
        video: "none",
        license: "1.0.0",
    });
}

const removePackage = (packageId: string) => {
    return axios.delete(`/package/${packageId}`);
}

export default {
    addNewPackage,
    getAllPackage,
    getPackageById,
    updatePackage,
    removePackage
}