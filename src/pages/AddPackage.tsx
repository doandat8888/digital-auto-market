import React, { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import { useNavigate } from "react-router";
import packageService from "../services/packageService";
import uploadService from "../services/uploadService";
import UploadFile from "../components/UploadFile";
import TextInput from '../components/TextInput';
import CategorySelect from '../components/CategorySelect';
import _const from '../const';
import versionService from '../services/versionService';
import Editor, { OnChange } from '@monaco-editor/react';
import { ContentEditableEvent } from 'react-contenteditable';
import { ToastContainer, toast } from 'react-toastify';
import TextArea from '../components/TextArea';
import UploadImage from '../components/UploadImage';
import CustomButton from '../components/CustomButton';
import PackageMode from '../components/PackageMode';
import ImageCoverView from '../components/ImageCoverView';
import ImageDetailView from '../components/ImageDetailView';

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
    const [genAIType, setGenAIType] = useState<string>("");
    const [genAIModelId, setGanAIModelId] = useState<string>("");
    //Zip file
    const [zipFile, setZipFile] = useState<string>("");
    const [, setDeploymentUrl] = useState("");
    const [zipFilePublishVersion, setZipFilePublishVersion] = useState<File>();
    // const [zipBase64, setZipBase64] = useState<string>("");
    const [fileZipName, setFileZipName] = useState<string>("");
    //Radio type
    const [mode, setMode] = useState("public");
    //Token
    const token = localStorage.getItem("token");
    //Loading 
    const [isLoading, setIsLoading] = useState(false);
    //Update package
    //Show btn save
    const [showBtnSave, setShowBtnSave] = useState(false);
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
                    authors: user?.fullName,
                    dashboardConfig: dashboardConfigStr,
                    category: category,
                    entryPoint: entryPoint,
                    source: linkSourceCode,
                    status: 'wait-for-approve',
                    modelId: genAIModelId,
                    type: genAIType
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

    const handleEditorChange: OnChange = (value) => {
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
                                    <div className="sm:w-[50%] w-[100%] flex justify-end"><div className='sm:w-[95%] w-full'>
                                        <TextInput title="Short description" value={packageShortDesc}
                                            placeholderStr="Write one sentence about your package" handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageShortDesc(event.target.value)}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="col-span-full sm:flex">
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
                                    <div className="w-[50%]">
                                        <CategorySelect defaultVal='widget' listCategory={_const.categoryFake} handleChangeCategory={(value: string) => setCategory(value)} />
                                    </div>
                                    <PackageMode mode={mode} onChangeMode={onChangeMode} />
                                </div>
                                {category === "genai" &&
                                    <div className="col-span-full sm:flex items-center">
                                        <div className="sm:w-[50%] w-[100%]">
                                            <CategorySelect defaultVal='GenAI_Widget' listCategory={_const.categoryGenAI} handleChangeCategory={(value: string) => setGenAIType(value)} />
                                        </div>
                                        <div className="grow flex justify-end">
                                            <div className="sm:w-[95%] w-full">
                                                <TextInput
                                                    title="Model id"
                                                    value={genAIModelId}
                                                    handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setGanAIModelId(event.target.value)}
                                                    placeholderStr='Enter genAI model id...'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="col-span-full">
                                    <div className="flex mt-4">
                                        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                            Cover photo
                                        </label>
                                        <span className="required text-red-500 ml-1">*</span>
                                    </div>
                                    <UploadImage id='img-cover-upload' name='img-cover-upload' onUploadImgAreaChange={handleInputImgCoverChange} />
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
                                <div className="my-4 images-container sm:grid sm:grid-cols-2 lg:grid-cols-3 col-span-full sm:justify-between">
                                    {imageDetailList && imageDetailList.length > 0 && imageDetailList.map((base64, index) => (
                                        <ImageDetailView index={index} base64={base64} onDeleteDetailImage={onDeleteDetailImage} />
                                    ))}
                                </div>
                                <UploadFile zipFile={zipFile} fileZipName={""} handleFileInputChange={handleFileInputChange} onDeleteZipFile={onDeleteZipFile} />
                                {isLoadingZipFile == true ? <p className="text-black">Loading...</p> : ''}
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
                                    <Editor height="300px" defaultLanguage="javascript" defaultValue={`{\n   \n}`} value={dashboardConfigStr} onChange={handleEditorChange} />
                                </div>
                            </div>
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
            <ToastContainer />
        </div>
    )
}

export default AddPackage;