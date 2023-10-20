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
        category: packageAdd.category,
        entryPoint: packageAdd.entryPoint
    })
}

const getAllPackage = () => {
    return axios.get(`/package?limit=100`);
}

const getAllPackageByPage = (limit: number, page: number) => {
    return axios.get(`/package?limit=${limit}&page=${page}`);
}

const getPackageTypeByPage = (category: string, limit: number, page: number) => {
    return axios.get(`/package?category=${category}&limit=${limit}&page=${page}`);
}

const getPackageByCategory = (category: string) => {
    return axios.get(`/package?category=${category}`);
}


const getMyPackageByPage = (limit: number, page: number) => {
    return axios.get(`/package/current?limit=${limit}&page=${page}`);
}

const getPackageById = (packageId: string) => {
    return axios.get(`/package/${packageId}`);
}

const updatePackage = (packageUpdate: any, packageId: string) => {
    return axios.put(`/package/${packageId}`, {
       ...packageUpdate,
        video: "none",
        license: "1.0.0",
    });
}

const updateDownLoad = (packageId: string) => {
    return axios.post(`/package/${packageId}/download`);
}

const toggleLikePackage = (packageId: string, type: string) => {
    if(type === "like") {
        return axios.post(`/package/${packageId}/like?value=1`);
    }else if(type === "unlike") {
        return axios.post(`/package/${packageId}/like?value=0`);
    }
}

const removePackage = (packageId: string) => {
    return axios.delete(`/package/${packageId}`);
}

const getPackageOfCurrentUser = (limit: number, currentPage: number) => {
    return axios.get(`/package/current?limit=${limit}&page=${currentPage}`);
}

const getPackageByName = (limit: number, currentPage: number, packageName: string) => {
    return axios.get(`/package?name=${packageName}&limit=${limit}&page=${currentPage}`)
}

const getMyPackageByName = (packageName: string) => {
    return axios.get(`/package/current?name=${packageName}`)
}

export default {
    addNewPackage,
    getAllPackage,
    getPackageById,
    updatePackage,
    removePackage,
    getAllPackageByPage,
    updateDownLoad,
    toggleLikePackage,
    getPackageOfCurrentUser,
    getMyPackageByPage,
    getPackageTypeByPage,
    getPackageByCategory,
    getPackageByName,
    getMyPackageByName
}