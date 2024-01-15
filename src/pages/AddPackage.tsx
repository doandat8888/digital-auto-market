import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import { useNavigate, useParams } from "react-router";
import packageService from "../services/packageService";
import uploadService from "../services/uploadService";
import UploadFile from "../components/UploadFile";
import TextInput from '../components/TextInput';
import CategorySelect from '../components/CategorySelect';
import _const from '../const';
import { FaRegImages } from 'react-icons/fa';
import versionService from '../services/versionService';
import Editor, { OnChange } from '@monaco-editor/react';
import { ContentEditableEvent } from 'react-contenteditable';
import { ToastContainer, toast } from 'react-toastify';
import TextArea from '../components/TextArea';

const AddPackage = () => {

    const navigate = useNavigate();
    //const packages = useSelector((state: RootState) => state.packages.value);
    //Package info
    const [packageName, setPackageName] = useState("");
    const [category, setCategory] = useState<string>(_const.categoryFake[0].name);
    const [packageShortDesc, setPackageShortDesc] = useState("");
    const [packageDescription, setPackageDescription] = useState("");
    const [imageDetailList, setimageDetailList] = useState<string[]>([]);
    const [imageCover, setimageCover] = useState<string>("");
    const [entryPoint, setEntryPoint] = useState<string>("");
    const [dashboardConfigStr, setDashboardConfigStr] = useState<string>("");
    //Zip file
    const [zipFile, setZipFile] = useState<string>("");
    const [deploymentUrl, setDeploymentUrl] = useState("");
    const [zipFilePublishVersion, setZipFilePublishVersion] = useState<File>();
    // const [zipBase64, setZipBase64] = useState<string>("");
    const [fileZipName, setFileZipName] = useState<string>("");
    //Radio type
    const [mode, setMode] = useState("public");
    //Token
    const token = localStorage.getItem("token");
    //Loading 
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    //Update package
    const { packageId } = params;
    //Show btn save
    const [showBtnSave, setShowBtnSave] = useState(false);
    //Loading
    const [isLoadingCoverImg, setIsLoadingCoverImg] = useState(false);
    const [isLoadingDetailImgs, setIsLoadingDetailImgs] = useState(false);
    const [isLoadingZipFile, setIsLoadingZipFile] = useState(false);

    const handleInputImgDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingDetailImgs(true);
        const files = event.target.files;
        if (files) {
            const imagePromises = Array.from(files).map((file) => {
                // eslint-disable-next-line no-async-promise-executor
                return new Promise<string>(async (resolve) => {
                    if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        await uploadService.uploadFile(formData).then(({ status, data }) => {
                            if (status === 201) {
                                const imgUrl = data.url;
                                resolve(imgUrl);
                            }
                        })
                    }
                });
            });
            Promise.all(imagePromises).then((imgUrls) => {
                setimageDetailList((prevImages) => [...prevImages, ...imgUrls]);
                setIsLoadingDetailImgs(false);
            });
        }
    };

    const [user, setUser] = useState<IUser>();

    const getUserInfo = useCallback(async () => {
        if (token !== "") {
            // console.log("Token header: ", token);
            try {
                await userService.getUser().then(({ status, data }) => {
                    if (status === 200) {
                        setUser(data);
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    }, [token])

    useEffect(() => {
        getUserInfo();
    }, [getUserInfo, token]);


    const validateInfoPackage = (): boolean => {
        const packageInfoArr = [packageName, user?.fullName, packageDescription, imageCover, imageDetailList, zipFile, mode, user?._id];
        for (let i = 0; i < packageInfoArr.length; i++) {
            if (packageInfoArr[i] === "") return false;
        }
        return true;
    }

    useEffect(() => {
        if (packageName && packageDescription && imageCover && 
            imageDetailList.length > 0 && zipFile && mode && category && entryPoint) {
            setShowBtnSave(true);
        } else {
            setShowBtnSave(false);
        }
    }, [packageName, packageDescription, imageCover, imageDetailList, zipFile, category, entryPoint, mode]);

    const handleInputImgCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingCoverImg(true);
        const file = event.target?.files?.[0];
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            try {
                await uploadService.uploadFile(formData).then(({ data, status }) => {
                    if (status === 201) {
                        setimageCover(data.url);
                        setIsLoadingCoverImg(false);
                    }
                })
            } catch (error: any) {
                alert(error.response.data.msg);
            }
        }
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingZipFile(true);
        const file = event.target?.files?.[0];
        setZipFilePublishVersion(file);
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                await uploadService.uploadFile(formData).then(({ status, data }) => {
                    if (status === 201) {
                        const zipFileUrl = data.url;
                        setZipFile(data.url);
                        setDeploymentUrl(data.deploymentUrl);
                        const zipFileName = zipFileUrl.replace("http://localhost:9006/data/store-be/data/store-be/", "");
                        setFileZipName(zipFileName);
                        setIsLoadingZipFile(false);
                    }
                })
            } catch (error: any) {
                alert(error.response.data.msg);
            }

        }
    };

    const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target?.value);
    }

    const onSaveInfoPackage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            if (validateInfoPackage() === false) {
                alert("Missing info package. Please try again");
                setIsLoading(false);
            } else {
                const authorArr: string[] = [];
                if (user) {
                    authorArr.push(user.fullName);
                }
                const packageObj: IAddPackage = {
                    name: packageName,
                    thumbnail: imageCover,
                    images: imageDetailList,
                    video: "none",
                    shortDesc: packageShortDesc,
                    fullDesc: packageDescription,
                    license: "abc",
                    visibility: mode,
                    authors: authorArr,
                    dashboardConfig: dashboardConfigStr,
                    // downloadUrl: zipFile,
                    // deploymentUrl: deploymentUrl,
                    category: category,
                    entryPoint: entryPoint,
                    status: 'wait-for-approve'
                };
                try {
                    //console.log("File: ", zipFilePublishVersion);
                    const responseAdd = await packageService.addNewPackage(packageObj);
                    if (responseAdd && responseAdd.status === 201) {
                        const id = responseAdd.data._id;
                        const versionPublish: IAddVersion = {
                            packageId: id,
                            file: zipFilePublishVersion,
                        }
                        const responsePublishVersion = await versionService.addVersion(versionPublish);
                        if (responsePublishVersion && responsePublishVersion.status === 201) {
                            toast.success("Please wait for approve");
                            navigate('/');
                        }
                    }
                } catch (error: any) {
                    alert(error.response.data.msg);
                }

                setIsLoading(false);
            }
        } catch (error) {
            alert("Error when add package");
            console.log(error);
            setIsLoading(false);
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
        const imgName = imgLink.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.asia/"}data`, "");
        setimageCover("");
        try {
            await uploadService.deleteFile(imgName).then(({ status }) => {
                if (status === 200) {
                    alert("Delete cover img successfully");
                }
            })
        } catch (error: any) {
            alert(error.response.data.msg);
        }
    }

    const onDeleteZipFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const fileDeleteName = fileZipName.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.asia/"}data`, "");
        try {
            await uploadService.deleteFile(fileDeleteName).then(({ status }) => {
                if (status === 200) {
                    setZipFile("");
                    setFileZipName("");
                    setDeploymentUrl("");
                }
            })
        } catch (error: any) {
            alert(error.response.data.msg);
        }
    }

    const onDeleteDetailImage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        event.preventDefault();
        const detailsImg = [...imageDetailList];
        detailsImg.splice(index, 1);
        setimageDetailList(detailsImg);
        const imgDelete = detailsImg[index];
        const imgDeleteName = imgDelete.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.asia/"}data`, "");
        try {
            await uploadService.deleteFile(imgDeleteName).then(({ status }) => {
                if (status === 200) {
                    toast.success("Delete successfully!");
                }
            })
        } catch (error: any) {
            alert(error.response.data.msg);
        }
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleEditorChange: OnChange = (value, event) => {
        setDashboardConfigStr(value || '');
    };

    const handleContentEditable = (event: ContentEditableEvent) => {
        setPackageDescription(event.target.value);
    }

    return (
        <div>
            <LoadingModal open={isLoading} closeModal={onCloseModal} />
            <div className="flex justify-center pt-[46px]">
                <form className="sm:w-[60%] w-[90%] p-5 bg-white">
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-4">
                                <div className="col-span-full sm:flex">
                                    <div className="sm:w-[50%] w-[100%]">
                                        <div className='sm:w-[95%] w-full'>
                                            <TextInput title="Package name" value={packageName} placeholderStr="Enter your package name"
                                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageName(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="sm:w-[50%] w-[100%] flex justify-end"><div className='sm:w-[95%] w-full'><TextInput title="Short description" value={packageShortDesc}
                                        placeholderStr="Write one sentence about your package" handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageShortDesc(event.target.value)} />
                                    </div>
                                    </div>
                                </div>
                                <div className="col-span-full sm:flex">
                                    {/* <div className="sm:w-[50%] w-[100%]"><div className="sm:w-[90%] w-full"><TextArea title="Description" value={packageDescription} handleTextAreaChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setPackageDescription(event.target.value)} placeHolderStr="Write some sentences about your package" /></div></div> */}
                                    <div className="sm:w-[50%] w-[100%]">
                                        <div className="sm:w-[95%] w-full">
                                            <TextArea title='Description' value={packageDescription} placeHolderStr='Write some sentences about your package'
                                                handleTextAreaChange={handleContentEditable} />
                                        </div>
                                    </div>
                                    <div className="sm:w-[50%] w-[100%] flex justify-end">
                                        <div className='sm:w-[95%] w-full'>
                                            <TextInput title="Entry point" value={entryPoint} placeholderStr="Enter file name you want to demo"
                                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setEntryPoint(event.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full flex">
                                    <div className="w-[50%]"><CategorySelect listCategory={_const.categoryFake} handleChangeCategory={(value: string) => setCategory(value)} /></div>
                                    <fieldset className='w-[50%] flex justify-end'>
                                        <div className="w-[95%]">
                                            <div className="flex w-[95%]">
                                                <legend className="text-sm font-semibold leading-6 text-gray-900">Mode</legend>
                                                <span className="required text-red-500 ml-1">*</span>
                                            </div>
                                            <div className="space-y-3 w-[95%] flex items-center">
                                                <div className="flex items-center mr-4">
                                                    <input
                                                        checked={mode === "public"}
                                                        id="public"
                                                        name="public"
                                                        type="radio"
                                                        className="h-4 w-4 mr-1 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        onChange={onChangeMode}
                                                        value={"public"}
                                                    />
                                                    <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Public
                                                    </label>
                                                </div>
                                                <div className="flex items-center mode-private">
                                                    <input
                                                        checked={mode === "private"}
                                                        id="private"
                                                        name="private"
                                                        type="radio"
                                                        className="mr-1 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
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
                                    <div className="flex mt-4">
                                        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                            Cover photo
                                        </label>
                                        <span className="required text-red-500 ml-1">*</span>
                                    </div>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-24 w-24 text-gray-300" aria-hidden="true" />
                                            <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600 text-center" onDrop={handleImgCoverDrop} onDragOver={handleDrag}>
                                                <label
                                                    htmlFor="cover-img-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 
                                                    focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload image</span>
                                                    <input required onChange={handleInputImgCoverChange} id="cover-img-upload" name="cover-img-upload" type="file" className="sr-only" value="" />
                                                </label>
                                                {/* <p className="pl-1">or drag and drop</p> */}
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
                                        </div>
                                    </div>
                                    {isLoadingCoverImg == true ? <p className="text-black">Loading...</p> : ''}
                                    {imageCover && (
                                        <div className="image-container sm:w-1/2 sm:mx-auto w-full relative my-4">
                                            <img
                                                src={imageCover}
                                                alt="Uploaded"
                                                className="w-full object-cover"
                                            />
                                            <button className="absolute top-2 right-2 rounded-full bg-white text-white px-3 py-1 z-40"
                                                onClick={(event) => onDeleteCoverImage(event, imageCover)}>
                                                <p className='text-[16px] font-bold text-red-500'>x</p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-full ">
                                    <div className="flex">
                                        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                            Detail images
                                        </label>
                                        <span className="required text-red-500 ml-1">*</span>
                                    </div>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <FaRegImages className="mx-auto h-24 w-24 text-gray-300" aria-hidden="true" />
                                            <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="detail-imgs-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 
                                                    focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload images</span>
                                                    <input required onChange={handleInputImgDetailChange} multiple id="detail-imgs-upload" name="detail-imgs-upload" type="file" className="sr-only" onDrag={handleDrag} value="" />
                                                </label>
                                                {/* <p className="pl-1">or drag and drop</p> */}
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                                {isLoadingDetailImgs == true ? <p className="text-black">Loading...</p> : ''}
                                <div className="my-4 images-container sm:grid sm:grid-cols-2 lg:grid-cols-3 col-span-full sm:justify-between">
                                    {imageDetailList && imageDetailList.length > 0 && imageDetailList.map((base64, index) => (
                                        <div className="relative mx-2">
                                            <img
                                                className="pt-4 w-full h-[200px] object-cover"
                                                key={index}
                                                src={base64}
                                                alt={`Uploaded ${index}`}
                                            />
                                            <button className="absolute top-6 right-2 rounded-full bg-white text-white px-3 py-1 z-40" onClick={(event) => onDeleteDetailImage(event, index)}>
                                                <p className='text-[16px] font-bold text-red-500'>x</p>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <UploadFile zipFile={zipFile} fileZipName={""} handleFileInputChange={handleFileInputChange} onDeleteZipFile={onDeleteZipFile} />
                                {isLoadingZipFile == true ? <p className="text-black">Loading...</p> : ''}
                                <div className="col-span-full">
                                    <div className="flex mb-2">
                                        <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                                            Dashboard config
                                        </label>
                                    </div>
                                    <Editor height="300px" defaultLanguage="javascript" defaultValue={`{\n   \n}`} value={dashboardConfigStr} onChange={handleEditorChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <div className="flex justify-between">
                            <button
                                className={`disabled:opacity-50 rounded-md bg-gray-400 px-3 mr-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 
                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600`}
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={showBtnSave === true ? false : true}
                                type="submit"
                                className={`disabled:opacity-50 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 
                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                onClick={onSaveInfoPackage}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddPackage;