import React, { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import { useNavigate, useParams } from "react-router";
import packageService from "../services/packageService";
import versionService from '../services/versionService';
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
    const [genAIType, setGenAIType] = useState<string>("");
    const [genAIModelId, setGanAIModelId] = useState<string>("");
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

    const [genAIToken, setGenAIToken] = useState<string>("");
    const [linkGenAIUrl, setLinkGenAIUrl] = useState<string>("");
    const [genAISampleCode, setGenAISampleCode] = useState<string>("");

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
        console.log(`packageUpdate`, packageUpdate)
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
            setLinkSourceCode(packageUpdate.source!);
            setGenAIType(packageUpdate.type!);
            setGanAIModelId(packageUpdate.modelId!)
            setIsLoading(false);

            if(packageUpdate.version) {
                setGenAISampleCode(packageUpdate.version.samples || "");
                setGenAIToken(packageUpdate.version.apiKey || "");
                setLinkGenAIUrl(packageUpdate.version.endpointUrl || "");
            }
        }
    }, [packageUpdate])

    const validateInfoPackageUpdate = (): boolean => {
        let packageInfoArr = [packageName, user?.fullName, packageDescription, imageCover, imageDetailList, mode, user?._id];
        if(category === "genai") {
            packageInfoArr = [packageName, user?.fullName, packageDescription, imageCover, imageDetailList, mode, user?._id, linkGenAIUrl];
        }
        for (let i = 0; i < packageInfoArr.length; i++) {
            if (packageInfoArr[i] === "") return false;
        }
        return true;
    }

    useEffect(() => {
        if(category === "genai") {
            if (packageName && imageCover && mode && linkGenAIUrl) {
                setShowBtnSave(true);
            } else {
                setShowBtnSave(false);
            }
        } else {
            if (packageName && imageCover && mode && entryPoint) {
                setShowBtnSave(true);
            } else {
                setShowBtnSave(false);
            }
        }
        
    }, [packageName, imageCover, mode, category, entryPoint, linkGenAIUrl]);



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
                        source: linkSourceCode,
                        modelId: category === "genai" ? genAIModelId : "",
                        type: category === "genai" ? genAIType : ""
                    };
                    try {
                        await packageService.updatePackage(packageObj, packageUpdate._id).then(async ({ status }) => {
                            if (status === 200) {
                                toast.success("Update info successfully!");
                                //Delete img cover and image details
                                const imageCoverName = imageCover.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.tech/"}data`, "");
                                for (let i = 0; i < imageDeleteListName.length; i++) {
                                    await uploadService.deleteFile(imageDeleteListName[i]);
                                }
                                if (isDeleteImgCover) {
                                    await uploadService.deleteFile(imageCoverName);
                                }
                                await versionService.updateVersion({
                                    _id: packageUpdate.version._id,
                                    name: packageUpdate.version.name,
                                    desc: packageUpdate.version.desc,
                                    endpointUrl: linkGenAIUrl,
                                    apiKey: genAIToken,
                                    samples: genAISampleCode
                                })
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
        const fileDeleteName = fileZipName.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.tech/"}data`, "");
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
        const imgDeleteName = imgDelete.replace(`${import.meta.env.VITE_APP_UPLOAD_URL || "https://upload.digitalauto.tech/"}data`, "");
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
                                    <div className="col-span-full">
                                        <div className="sm:w-[95%] w-full">
                                            <TextArea title='Description' value={packageDescription}
                                                placeHolderStr='Write some sentences about your package' editable={true} handleTextAreaChange={handleContentEditable} />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <div className='sm:w-[95%] w-full'><TextInput title="Entry point"
                                            value={entryPoint} placeholderStr="Enter file name you want to demo"
                                            handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setEntryPoint(event.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-span-full flex">
                                        <div className="w-[50%]"><CategorySelectUpdate listCategory={_const.categoryFake}
                                            handleChangeCategory={(value: string) => setCategory(value)} categoryName={category} /></div>
                                        <PackageMode mode={mode} onChangeMode={onChangeMode} />
                                    </div>
                                    {category === "genai" &&
                                        <div className="col-span-full sm:flex items-center">
                                            <div className="sm:w-[50%] w-[100%]">
                                                <CategorySelectUpdate label='Sub-Categories' categoryName={genAIType} listCategory={_const.categoryGenAI} handleChangeCategory={(value: string) => setGenAIType(value)} />
                                            </div>
                                            {/* <div className="grow flex justify-end">
                                                <div className="sm:w-[95%] w-full">
                                                    <TextInput
                                                        title="Model id"
                                                        value={genAIModelId}
                                                        handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setGanAIModelId(event.target.value)}
                                                        placeholderStr='Enter genAI model id...'
                                                    />
                                                </div>
                                            </div> */}
                                        </div>
                                    }
                                    <div className="col-span-full">
                                        <div className="flex mt-4">
                                            <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                                Cover photo
                                            </label>
                                            <span className="required text-red-500 ml-1">*</span>
                                        </div>
                                        <UploadImage
                                            id='img-cover-upload'
                                            name='img-cover-upload'
                                            onUploadImgAreaChange={handleInputImgCoverChange} 
                                        />
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
                                            id='img-details-upload'
                                            name='img-details-upload'
                                        />
                                    </div>
                                    {isLoadingDetailImgs == true ? <p className="text-black">Loading...</p> : ''}
                                    <div className="images-container sm:grid sm:grid-cols-2 lg:grid-cols-3 col-span-full sm:justify-between">
                                        {imageDetailList && imageDetailList.length > 0 && imageDetailList.map((base64, index) => (
                                            <ImageDetailView index={index} base64={base64} onDeleteDetailImage={onDeleteDetailImage} />
                                        ))}
                                    </div>

                                    {
                                        category !== "genai" && <>
                                            {!packageUpdate && <UploadFile zipFile={zipFile} fileZipName={""}
                                                handleFileInputChange={handleFileInputChange} onDeleteZipFile={onDeleteZipFile} />}
                                            {isLoadingZipFile == true ? <p className="text-black">Loading...</p> : ''}
                                        </>
                                    }
                                    
                                </div>
                            </div>

                            {   category !== "genai" && <>
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
                                            Options:
                                        </label>
                                    </div>
                                    <Editor height="180px" defaultLanguage="javascript" defaultValue={`{\n   \n}`} value={dashboardConfig} onChange={handleEditorChange} />;
                                </div>
                                </>
                            }

                            {   category === "genai"  && <>
                                        <div className="col-span-full">
                                            <TextInput
                                                required={false}
                                                title='genAI POST Request URL *'
                                                placeholderStr='Enter your genAI POST Request URL'
                                                value={linkGenAIUrl}
                                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setLinkGenAIUrl(event.target.value)}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <TextInput
                                                required={false}
                                                title='genAI Token'
                                                placeholderStr='Token for genAI'
                                                value={genAIToken}
                                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setGenAIToken(event.target.value)}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <div className="flex mb-2">
                                                <label htmlFor="versioname" className="block text-sm font-bold leading-6 text-gray-900">
                                                    Sample code for genAI
                                                </label>
                                            </div>
                                            <Editor height="300px" defaultLanguage="" defaultValue={``} value={genAISampleCode} onChange={(value) =>  setGenAISampleCode(value?.trim() || "")} />
                                        </div>
                                    </>
                                }

                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <CustomButton
                                title='Cancel'
                                onClickBtn={() => navigate('/')}
                                bgColor='bg-gray-400'
                            />
                            <div className="grow w-[100px]"></div>
                            <CustomButton
                                disabled={!showBtnSave}
                                type='submit'
                                onClickBtn={onSaveInfoPackage}
                                title='Save'
                            />
                        </div>
                    </form>
                </div>
            }
            <ToastContainer />
        </div>
    )
}

export default UpdatePackage;