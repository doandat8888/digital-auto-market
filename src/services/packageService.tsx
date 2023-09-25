import axios from "../axiosPackage.tsx";

const addNewPackage = (packageAdd: IPackage) => {
    return axios.post('/package', {
        name: packageAdd.name,
        thumbnail: packageAdd.thumbnail,
        images: packageAdd.images,
        video: "none",
        shortDesc: packageAdd.shortDesc,
        fullDesc: packageAdd.fullDesc,
        lisence: "1.0.0",
        visibility: packageAdd.visibility,
        authors: packageAdd.authors,
        downloadUrl: "abc",
    })
}

const getAllPackage = () => {
    return axios.get('/package');
}

const getPackageById = (packageId: string) => {
    return axios.get(`/package/${packageId}`);
}

const updatePackage = (packageUpdate: IUpdatePackage) => {
    return axios.put(`/package/${packageUpdate._id}`, {
        name: packageUpdate.name,
        thumbnail: packageUpdate.thumbnail,
        images: packageUpdate.images,
        video: "none",
        shortDesc: packageUpdate.shortDesc,
        fullDesc: packageUpdate.fullDesc,
        lisence: "1.0.0",
        visibility: packageUpdate.visibility,
        authors: packageUpdate.authors,
        downloadUrl: "abc",
    });
}

export default {
    addNewPackage,
    getAllPackage,
    getPackageById,
    updatePackage
}