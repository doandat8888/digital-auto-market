import React, { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import { useNavigate, useParams } from "react-router";
import packageService from "../services/packageService";
import uploadService from "../services/uploadService";
import UploadFile from "../components/UploadFile";
import TextInput from '../components/TextInput';
import CategorySelectUpdate from '../components/CategorySelectUpdate';
import _const from '../const';
import { Editor, OnChange } from '@monaco-editor/react';
import { ToastContainer, toast } from 'react-toastify';
import TextArea from '../components/TextArea';
import CustomButton from '../components/CustomButton';
import PackageMode from '../components/PackageMode';
import UploadImage from '../components/UploadImage';
import ImageCoverView from '../components/ImageCoverView';
import ImageDetailView from '../components/ImageDetailView';

const UpdatePackage = () => {

    const navigate = useNavigate();
    //const packages = useSelector((state: RootState) => state.packages.value);
    //Package info
    const [packageName, setPackageName] = useState("");
    const [packageShortDesc, setPackageShortDesc] = useState("");
    const [category, setCategory] = useState<string>("");
    const [packageDescription, setPackageDescription] = useState("");
    const [imageDetailList, setimageDetailList] = useState<string[]>([]);
    const imageDeleteListName: any[] = [];
    const [imageCover, setimageCover] = useState<string>("");
    const [isDeleteImgCover, setIsDeleteImgCover] = useState(false);
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
    //Loading
    const [isLoadingCoverImg, setIsLoadingCoverImg] = useState(false);
    const [isLoadingDetailImgs, setIsLoadingDetailImgs] = useState(false);
    const [isLoadingZipFile, setIsLoadingZipFile] = useState(false);
    const [linkSourceCode, setLinkSourceCode] = useState('');

    const handleInputImgDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingDetailImgs(true);
        const files = event.target.files;
        if (files) {
            const imagePromises = Array.from(files).map((file) => {
                // eslint-disable-next-line no-async-promise-executor
                return new Promise<string>(async (resolve) => {
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    await uploadService.uploadFile(formData).then(({ status, data }) => {
                        if (status === 201) {
                            const imgUrl = data.url;
                            resolve(imgUrl);
                        }
                    }).catch((error: any) => console.log(error.response.data.msg));
                });
            });
            Promise.all(imagePromises).then((imgUrls) => {
                setimageDetailList((prevImages) => [...prevImages, ...imgUrls]);
                setIsLoadingDetailImgs(false);
            });
        }
    };

    const [user, setUser] = useState<IUser>();


    const getPackageById = useCallback(async () => {
        if (packageId) {
            await packageService.getPackageById(packageId).then(({ data }) => {
                if (data) {
                    setPackageUpdate(data);
                }
            })
        }
    }, [packageId])

    const getUserInfo = useCallback(async () => {
        if (token !== "") {
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

    useEffect(() => {
        getPackageById();
    }, [getPackageById, packageId]);



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
            setMode(packageUpdate.visibility);
            setLinkSourceCode(packageUpdate.source);
            setIsLoading(false);
        }
    }, [packageUpdate])

    const validateInfoPackageUpdate = (): boolean => {
        const packageInfoArr = [packageName, user?.fullName, packageDescription, imageCover, imageDetailList, mode, user?._id];
        for (let i = 0; i < packageInfoArr.length; i++) {
            if (packageInfoArr[i] === "") return false;
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



    const handleInputImgCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingCoverImg(true);
        setIsDeleteImgCover(false);
        const file = event.target?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        await uploadService.uploadFile(formData).then(({ status, data }) => {
            if (status === 201) {
                setimageCover(data.url);
                setIsLoadingCoverImg(false);
            }
        });
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingZipFile(true);
        const file = event.target?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        await uploadService.uploadFile(formData).then(({ status, data }) => {
            if (status === 201) {
                setIsLoadingZipFile(false);
                setZipFile(data.url);
                setDeploymentUrl(data.deploymentUrl);
            }
        });
    };

    const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target?.value);
    }

    const navigateToDetail = (packageId: string) => {
        navigate(`/package/${packageId}?version=latest`);
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
                        dashboardConfig,
                        source: linkSourceCode
                    };
                    try {
                        await packageService.updatePackage(packageObj, packageUpdate._id).then(async ({ status }) => {
                            if (status === 200) {
                                toast.success("Update info successfully!");
                                //Delete img cover and image details
                                const imageCoverName = imageCover.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.asia/"}data`, "");
                                for (let i = 0; i < imageDeleteListName.length; i++) {
                                    await uploadService.deleteFile(imageDeleteListName[i]);
                                }
                                if (isDeleteImgCover) {
                                    await uploadService.deleteFile(imageCoverName);
                                }
                                navigateToDetail(packageUpdate._id);
                            }
                        })
                    } catch (error: any) {
                        toast.error(error.response.data.msg);
                    }
                    setIsLoading(false);
                } catch (error) {
                    toast.error("Error when add package");
                    setIsLoading(false);
                }
            }
        }
    }

    const onDeleteCoverImage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setimageCover("");
        setIsDeleteImgCover(true);
    }

    const onDeleteZipFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const fileDeleteName = fileZipName.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.asia/"}data`, "");
        await uploadService.deleteFile(fileDeleteName).then(({ status }) => {
            if (status === 200) {
                setZipFile("");
                setFileZipName("");
                setDeploymentUrl("");
            }
        })
    }

    const onDeleteDetailImage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        event.preventDefault();
        const detailsImg = [...imageDetailList];
        const imgDelete = detailsImg[index];
        const imgDeleteName = imgDelete.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.asia/"}data`, "");
        imageDeleteListName.push(imgDeleteName);
        detailsImg.splice(index, 1);
        setimageDetailList(detailsImg);
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleEditorChange: OnChange = (value) => {
        setDashboardConfig(value || '');
    };

    const handleContentEditable = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPackageDescription(event.target.value);
    };

    return (
        <div>
            {isLoading === true ? <LoadingModal open={isLoading} closeModal={onCloseModal} /> :
                <div className="flex justify-center pt-[46px]">
                    <form className="sm:w-[60%] w-[95%] p-5 bg-white">
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-4">
                                    <div className="col-span-full sm:flex">
                                        <div className="sm:w-[50%] w-[100%]"><div className='sm:w-[95%] w-full'>
                                            <TextInput title="Package name" value={packageName}
                                            placeholderStr="Enter your package name"
                                            handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageName(event.target.value)} />
                                        </div>
                                        </div>
                                        <div className="sm:w-[50%] w-[100%] flex justify-end"><div className='sm:w-[95%] w-full'>
                                            <TextInput title="Short description" value={packageShortDesc}
                                                placeholderStr="Write one sentence about your package"
                                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageShortDesc(event.target.value)} />
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full sm:flex">
                                        <div className="sm:w-[50%] w-[100%]">
                                            <div className="sm:w-[95%] w-full">
                                                <TextArea title='Description' value={packageDescription}
                                                    placeHolderStr='Write some sentences about your package' editable={true} handleTextAreaChange={handleContentEditable} />
                                            </div>
                                        </div>
                                        <div className="sm:w-[50%] w-[100%] flex justify-end"><div className='sm:w-[95%] w-full'><TextInput title="Entry point"
                                            value={entryPoint} placeholderStr="Enter file name you want to demo"
                                            handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setEntryPoint(event.target.value)} />
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full flex">
                                        <div className="w-[50%]"><CategorySelectUpdate listCategory={_const.categoryFake}
                                            handleChangeCategory={(value: string) => setCategory(value)} categoryName={category} /></div>
                                        <PackageMode mode={mode} onChangeMode={onChangeMode} />
                                    </div>
                                    <div className="col-span-full">
                                        <div className="flex mt-4">
                                            <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                                Cover photo
                                            </label>
                                            <span className="required text-red-500 ml-1">*</span>
                                        </div>
                                        <UploadImage onUploadImgAreaChange={handleInputImgCoverChange} />
                                        {isLoadingCoverImg == true ? <p className="text-black">Loading...</p> : ''}
                                        {imageCover && (
                                            <ImageCoverView imageCover={imageCover} onDeleteCoverImage={onDeleteCoverImage} />
                                        )}
                                    </div>
                                    <div className="col-span-full ">
                                        <div className="flex">
                                            <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                                Detail images
                                            </label>
                                            <span className="required text-red-500 ml-1">*</span>
                                        </div>
                                        <UploadImage
                                            multiple={true}
                                            onUploadImgAreaChange={handleInputImgDetailChange}
                                        />
                                    </div>
                                    {isLoadingDetailImgs == true ? <p className="text-black">Loading...</p> : ''}
                                    <div className="images-container sm:grid sm:grid-cols-2 lg:grid-cols-3 col-span-full sm:justify-between">
                                        {imageDetailList && imageDetailList.length > 0 && imageDetailList.map((base64, index) => (
                                            <ImageDetailView index={index} base64={base64} onDeleteDetailImage={onDeleteDetailImage} />
                                        ))}
                                    </div>
                                    {!packageUpdate && <UploadFile zipFile={zipFile} fileZipName={""}
                                        handleFileInputChange={handleFileInputChange} onDeleteZipFile={onDeleteZipFile} />}
                                    {isLoadingZipFile == true ? <p className="text-black">Loading...</p> : ''}
                                </div>
                            </div>
                            <div className="col-span-full">
                                <TextInput
                                    required={false}
                                    title='Link source code'
                                    placeholderStr='Enter your source code link'
                                    value={linkSourceCode}
                                    handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setLinkSourceCode(event.target.value)}
                                />
                            </div>
                            <div className="col-span-full">
                                <div className="flex mb-2">
                                    <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                                        Dashboard config
                                    </label>
                                </div>
                                <Editor height="300px" defaultLanguage="javascript" defaultValue={`{\n   \n}`} value={dashboardConfig} onChange={handleEditorChange} />;
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <div className="flex justify-between space-x-3">
                                <CustomButton
                                    title='Cancel'
                                    onClickBtn={() => navigate('/')}
                                    bgColor='bg-gray-400'
                                />
                                <CustomButton
                                    disabled={showBtnSave === true ? false : true}
                                    type='submit'
                                    onClickBtn={onSaveInfoPackage}
                                    title='Save'
                                />
                            </div>
                        </div>
                    </form>
                </div>
            }
            <ToastContainer />
        </div>
    )
}

export default UpdatePackage;