import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import { useNavigate, useParams } from "react-router";
import packageService from "../services/packageService";
import uploadService from "../services/uploadService";
import UploadFile from "../components/UploadFile";
import TextInput from '../components/TextInput';
import TextArea from '../components/TextArea';
import CategorySelectUpdate from '../components/CategorySelectUpdate';
import _const from '../const';
import { FaRegImages } from 'react-icons/fa';
import { Editor, OnChange } from '@monaco-editor/react';

const UpdatePackage = () => {

    const navigate = useNavigate();
    //const packages = useSelector((state: RootState) => state.packages.value);
    //Package info
    const [packageName, setPackageName] = useState("");
    const [packageShortDesc, setPackageShortDesc] = useState("");
    const [category, setCategory] = useState<string>("");
    const [packageDescription, setPackageDescription] = useState("");
    const [imageDetailList, setimageDetailList] = useState<string[]>([]);
    const [imageCover, setimageCover] = useState<string>("");
    const [entryPoint, setEntryPoint] = useState<string>("");
    const [dashboardConfig, setDashboardConfig] = useState<string>("");
    //Zip file
    const [zipFile, setZipFile] = useState<string>("");
    const [deploymentUrl, setDeploymentUrl] = useState("");
    // const [zipBase64, setZipBase64] = useState<string>("");
    const [fileZipName, setFileZipName] = useState<string>("");
    //Radio type
    const [mode, setMode] = useState("public");
    //Token
    const token = localStorage.getItem("token");
    //Loading 
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    //Update package
    const { packageId } = params;
    const [packageUpdate, setPackageUpdate] = useState<IGetPackage | undefined>();
    //Show btn save
    const [showBtnSave, setShowBtnSave] = useState(true);

    const handleInputImgDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imagePromises = Array.from(files).map((file) => {
                return new Promise<string>(async (resolve) => {
                    if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        const response = await uploadService.uploadFile(formData);
                        if (response && response.status === 201) {
                            const imgUrl = response.data.url;
                            resolve(imgUrl);
                        }
                    }
                });
            });
            Promise.all(imagePromises).then((imgUrls) => {
                setimageDetailList((prevImages) => [...prevImages, ...imgUrls]);
            });
        }
    };

    const [user, setUser] = useState<IUser>();


    const getPackageById = async () => {
        if (packageId) {
            const response = await packageService.getPackageById(packageId);
            if (response && response.data) {
                setPackageUpdate(response.data);
            }
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [token]);

    useEffect(() => {
        getPackageById();
    }, [packageId]);


    useEffect(() => {
        if (packageUpdate) {
            setPackageName(packageUpdate.name);
            setPackageShortDesc(packageUpdate.shortDesc);
            setPackageDescription(packageUpdate.fullDesc);
            setimageCover(packageUpdate.thumbnail);
            setimageDetailList(packageUpdate.images);
            setCategory(packageUpdate.category);
            setEntryPoint(packageUpdate.entryPoint);
            setDashboardConfig(packageUpdate.dashboardConfig);
            // setZipFile(packageUpdate.version.downloadUrl);
            // setDeploymentUrl(packageUpdate.version.deploymentUrl);
            setMode(packageUpdate.visibility);
            setIsLoading(false);
        }
    }, [packageUpdate])

    const validateInfoPackageUpdate = (): boolean => {
        let count = 0;
        const packageInfoArr = [packageName, user?.fullName, packageDescription, imageCover, imageDetailList, mode, user?._id];
        for (let i = 0; i < packageInfoArr.length; i++) {
            if (packageInfoArr[i] === "") {
                count++;
            }
        }
        if (count > 0) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (packageName && imageCover && mode && entryPoint) {
            setShowBtnSave(true);
        } else {
            setShowBtnSave(false);
        }
    }, [packageName, imageCover, mode, category, entryPoint]);


    const getUserInfo = async () => {
        if (token !== "") {
            // console.log("Token header: ", token);
            try {
                const response = await userService.getUser();
                if (response && response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleInputImgCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            const response = await uploadService.uploadFile(formData);
            if (response && response.status === 201) {
                console.log(response.data.url);
                setimageCover(response.data.url);
            }
        }
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const response = await uploadService.uploadFile(formData);
            if (response && response.status === 201) {
                const zipFileUrl = response.data.url;
                setZipFile(response.data.url);
                setDeploymentUrl(response.data.deploymentUrl);
                const zipFileName = zipFileUrl.replace("http://localhost:9006/data/store-be/data/store-be/", "");
                setFileZipName(zipFileName);
            }
        }
    };

    const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target?.value);
    }

    const navigateToDetail = (packageId: string) => {
        navigate(`/package/${packageId}`);
    }

    const onSaveInfoPackage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (packageUpdate) {
            if (validateInfoPackageUpdate() === false) {
                alert("Missing info package. Please try again");
                setIsLoading(false);
            } else {
                try {
                    setIsLoading(true);
                    const authorArr: string[] = [];
                    if (user) {
                        authorArr.push(user.fullName);
                    }
                    const packageObj = {
                        _id: packageUpdate._id,
                        name: packageName,
                        thumbnail: imageCover,
                        images: imageDetailList,
                        video: "none",
                        shortDesc: packageShortDesc,
                        fullDesc: packageDescription,
                        license: "abc",
                        visibility: mode,
                        authors: authorArr,
                        downloadUrl: zipFile,
                        deploymentUrl: deploymentUrl,
                        category: category,
                        entryPoint: entryPoint,
                        dashboardConfig
                    };
                    try {
                        const response = await packageService.updatePackage(packageObj, packageUpdate._id);
                        if (response && response.status === 200) {
                            alert("Update info successfully!");
                            navigateToDetail(packageUpdate._id);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    setIsLoading(false);
                } catch (error) {
                    alert("Error when add package");
                    console.log(error);
                    setIsLoading(false);
                }
            }
        }
    }

    const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleImgCoverDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target?.result as string;
                setimageCover(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDeleteCoverImage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imgLink: string) => {
        event.preventDefault();
        const imgName = imgLink.replace(`${import.meta.env.VITE_APP_UPLOAD_URL}data`, "");
        const response = await uploadService.deleteFile(imgName);
        if (response && response.status === 200) {
            alert("Delete cover img successfully")
            setimageCover("");
        }
    }

    const onDeleteZipFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const fileDeleteName = fileZipName.replace(`${import.meta.env.VITE_APP_UPLOAD_URL}data`, "");
        const response = await uploadService.deleteFile(fileDeleteName);
        if (response && response.status === 200) {
            setZipFile("");
            setFileZipName("");
            setDeploymentUrl("");
        }
    }

    const onDeleteDetailImage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        event.preventDefault();
        const detailsImg = [...imageDetailList];
        const imgDelete = detailsImg[index];
        const imgDeleteName = imgDelete.replace(`${import.meta.env.VITE_APP_UPLOAD_URL}data`, "");
        const response = await uploadService.deleteFile(imgDeleteName);
        if (response && response.status === 200) {
            detailsImg.splice(index, 1);
            setimageDetailList(detailsImg);
        }
    }

    const onCloseModal = () => {
        setIsLoading(false);
    }

    const handleEditorChange: OnChange = (value, event) => {
        setDashboardConfig(value || '');
    };

    return (
        <div>
            {isLoading === true ? <LoadingModal open={isLoading} closeModal={onCloseModal} /> :
                <div className="flex justify-center">
                    <form className="sm:w-[60%] w-[90%] p-5 bg-white">
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-4">
                                    <div className="col-span-full sm:flex">
                                        <div className="sm:w-[50%] w-[100%]"><div className='sm:w-[90%] w-full'><TextInput title="Package name" value={packageName} placeholderStr="Enter your package name" handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageName(event.target.value)} /></div></div>
                                        <div className="sm:w-[50%] w-[100%] flex justify-end"><div className='sm:w-[90%] w-full'><TextInput title="Short description" value={packageShortDesc} placeholderStr="Write one sentence about your package" handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageShortDesc(event.target.value)} /></div></div>
                                    </div>
                                    <div className="col-span-full sm:flex">
                                        <div className="sm:w-[50%] w-[100%]"><div className="sm:w-[90%] w-full"><TextArea title="Description" value={packageDescription} handleTextAreaChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setPackageDescription(event.target.value)} placeHolderStr="Write some sentences about your package" /></div></div>
                                        <div className="sm:w-[50%] w-[100%] flex justify-end"><div className='sm:w-[90%] w-full'><TextInput title="Entry point" value={entryPoint} placeholderStr="Enter file name you want to demo" handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setEntryPoint(event.target.value)} /></div></div>
                                    </div>
                                    <div className="col-span-full flex">
                                        <div className="w-[50%]"><CategorySelectUpdate listCategory={_const.categoryFake} handleChangeCategory={(value: string) => setCategory(value)} categoryName={category} /></div>
                                        <fieldset className='w-[50%] flex justify-end'>
                                            <div className="w-[90%]">
                                                <div className="flex">
                                                    <legend className="text-sm font-semibold leading-6 text-gray-900">Mode</legend>
                                                    <p className="required text-red-500 ml-1">*</p>
                                                </div>
                                                <div className="mt-3 space-y-3">
                                                    <div className="flex items-center gap-x-3">
                                                        <input
                                                            checked={mode === "public"}
                                                            id="public"
                                                            name="public"
                                                            type="radio"
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                            onChange={onChangeMode}
                                                            value={"public"}
                                                        />
                                                        <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Public
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center gap-x-3">
                                                        <input
                                                            checked={mode === "private"}
                                                            id="private"
                                                            name="private"
                                                            type="radio"
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                            onChange={onChangeMode}
                                                            value={"private"}
                                                        />
                                                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Only me
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </fieldset>
                                    </div>
                                    <div className="col-span-full">
                                        <div className="flex">
                                            <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                                Cover photo
                                            </label>
                                            <p className="required text-red-500 ml-1">*</p>
                                        </div>
                                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                            <div className="text-center">
                                                <PhotoIcon className="mx-auto h-24 w-24 text-gray-300" aria-hidden="true" />
                                                <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600" onDrop={handleImgCoverDrop} onDragOver={handleDrag}>
                                                    <label
                                                        htmlFor="cover-img-upload"
                                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                    >
                                                        <span>Upload image</span>
                                                        <input required onChange={handleInputImgCoverChange} id="cover-img-upload" name="cover-img-upload" type="file" className="sr-only" />
                                                    </label>
                                                    {/* <p className="pl-1">or drag and drop</p> */}
                                                </div>
                                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 100MB</p>
                                            </div>
                                        </div>
                                        {imageCover && (
                                            <div className="image-container sm:w-1/2 sm:mx-auto w-full relative">
                                                <img
                                                    src={imageCover}
                                                    alt="Uploaded"
                                                    className="w-full object-cover"
                                                />
                                                <button className="absolute top-2 right-2 rounded-full bg-slate-400 text-white px-4 py-2 z-40" onClick={(event) => onDeleteCoverImage(event, imageCover)}><p className='opacity-80'>x</p></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-full ">
                                        <div className="flex">
                                            <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                                Detail images
                                            </label>
                                            <p className="required text-red-500 ml-1">*</p>
                                        </div>
                                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                            <div className="text-center">
                                                <FaRegImages className="mx-auto h-24 w-24 text-gray-300" aria-hidden="true" />
                                                <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                                                    <label
                                                        htmlFor="detail-imgs-upload"
                                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                    >
                                                        <span>Upload images</span>
                                                        <input required onChange={handleInputImgDetailChange} multiple id="detail-imgs-upload" name="detail-imgs-upload" type="file" className="sr-only" onDrag={handleDrag} />
                                                    </label>
                                                    {/* <p className="pl-1">or drag and drop</p> */}
                                                </div>
                                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 100MB</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="images-container sm:grid sm:grid-cols-2 lg:grid-cols-3 col-span-full sm:justify-between">
                                        {imageDetailList && imageDetailList.length > 0 && imageDetailList.map((base64, index) => (
                                            <div className="relative mx-2">
                                                <img
                                                    className="pt-4 w-full h-[200px] object-cover"
                                                    key={index}
                                                    src={base64}
                                                    alt={`Uploaded ${index}`}
                                                />
                                                <button className="absolute top-6 right-2 rounded-full bg-slate-400 text-white px-4 py-2 z-40" onClick={(event) => onDeleteDetailImage(event, index)}>x</button>
                                            </div>
                                        ))}
                                    </div>
                                    {!packageUpdate && <UploadFile zipFile={zipFile} fileZipName={""} handleFileInputChange={handleFileInputChange} onDeleteZipFile={onDeleteZipFile} />}
                                </div>
                            </div>
                            <div className="col-span-full">
                                    <div className="flex mb-2">
                                        <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                                            Dashboard config
                                        </label>
                                    </div>
                                    <Editor height="300px" defaultLanguage="javascript" defaultValue="// some comment" value={dashboardConfig} onChange={handleEditorChange}/>;
                                </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="submit"
                                disabled={showBtnSave === true ? false : true}
                                className={`rounded-md bg-blue-600 disabled:opacity-50 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                onClick={onSaveInfoPackage}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default UpdatePackage;