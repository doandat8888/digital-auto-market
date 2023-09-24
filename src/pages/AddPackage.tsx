import { BsFileZip } from "react-icons/bs";
import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { BiDownload } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addPackage } from "../redux/package/packageSlice";
import HandleStr from "../utils/hanldeStr";
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import { useNavigate } from "react-router";

const AddPackage = () => {

    const navigate = useNavigate();
    const packages = useSelector((state: RootState) => state.packages.value);
    //Package info
    const [packageName, setPackageName] = useState("");
    const [packageDescription, setPackageDescription] = useState("");
    const [imageDetailList, setimageDetailList] = useState<string[]>([]);
    const [imageCover, setimageCover] = useState<string>("");
    //Zip file
    const [zipFile, setZipFile] = useState<Blob | null>(null);
    const [zipBase64, setZipBase64] = useState<string>("");
    const [fileZipName, setFileZipName] = useState<string>("");
    //Radio type
    const [mode, setMode] = useState("public");
    //Dispatch
    const dispatch = useDispatch();
    //Token
    const token = localStorage.getItem("token");
    //Loading 
    const [isLoading, setIsLoading] = useState(false);

    const handleInputImgDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imagePromises = Array.from(files).map((file) => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const base64String = e.target?.result as string;
                        resolve(base64String);
                    };
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(imagePromises).then((base64Strings) => {
                setimageDetailList((prevImages) => [...prevImages, ...base64Strings]);
            });
        }
    };

    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        getUserInfo();
    }, [token]);

    const getUserInfo = async () => {
        if (token !== "") {
            console.log("Token header: ", token);
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

    const handleInputImgCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target?.result as string;
                setimageCover(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            const fileName: string = file.name;
            setFileZipName(fileName);
            setZipFile(file);
            const reader = new FileReader();

            reader.onload = (e) => {
                const base64String = e.target?.result as string;
                setZipBase64(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
 
    const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target?.value);
    }

    const validateInfoPackage = (): boolean => {
        let count = 0;
        const packageInfoArr = [packageName, user?.fullName, packageDescription, imageCover, imageDetailList, zipBase64, mode, user?._id];
        for(let i = 0; i < packageInfoArr.length; i++) {
            if(packageInfoArr[i] === "") {
                count++;
            }
        }
        if(count > 0) {
            return false;
        }
        return true;
    }
    
    const onAddNewPackage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            if(validateInfoPackage() === false) {
                alert("Missing info package. Please try again");
                setIsLoading(false);
            }else {
                const packageObj: IPackage = {
                    no: packages.length + 1,
                    id: HandleStr.generateRandomString(),
                    name: packageName,
                    author: user?.fullName,
                    description: packageDescription,
                    likeNumber: 0,
                    download: 0,
                    imgCover: imageCover,
                    imgDetails: imageDetailList,
                    source: zipBase64,
                    mode: mode,
                    version: "1.0.0",
                    uid: user?._id
                };
                dispatch(addPackage(packageObj));
                alert("Add package successfully!");
                setIsLoading(false);
                navigate('/');
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

    const onDeleteCoverImage = () => {
        setimageCover("");
    }

    const onDeleteZipFile = () => {
        setZipFile(null);
        setZipBase64("");
    }

    const onDeleteDetailImage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        event.preventDefault();
        const detailsImg = [...imageDetailList];
        detailsImg.splice(index, 1);
        setimageDetailList(detailsImg);
    }

    const onCloseModal = () => {
        setIsLoading(false);
    }

    return (
        <div>
            <LoadingModal open={isLoading} closeModal={onCloseModal}/>
            <div className="flex justify-center">
                <form className="w-[90%] p-5 bg-white">
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
                                <div className="sm:col-span-4">
                                    <label htmlFor="packagename" className="block text-sm font-bold leading-6 text-gray-900">
                                        Package's name
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <input
                                                required
                                                type="text"
                                                className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Enter your package's name"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPackageName(event.target?.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="about" className="block text-sm font-bold leading-6 text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            required
                                            id="about"
                                            name="about"
                                            rows={3}
                                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Write a few sentences about your package."
                                            defaultValue={''}
                                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setPackageDescription(event.target?.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-full">

                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                        Cover photo
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600" onDrop={handleImgCoverDrop} onDragOver={handleDrag}>
                                                <label
                                                    htmlFor="cover-img-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload image</span>
                                                    <input required onChange={handleInputImgCoverChange} id="cover-img-upload" name="cover-img-upload" type="file" className="sr-only"/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                    {imageCover && (
                                        <div className="image-container sm:w-1/2 sm:mx-auto w-full relative">
                                            <img
                                                src={imageCover}
                                                alt="Uploaded"
                                                className="w-full object-cover"
                                            />
                                            <button className="absolute top-2 right-2 rounded-full bg-slate-400 text-white px-4 py-2 z-40" onClick={onDeleteCoverImage}>x</button>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-full ">
                                    <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                        Detail images
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="detail-imgs-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload images</span>
                                                    <input required onChange={handleInputImgDetailChange} multiple id="detail-imgs-upload" name="detail-imgs-upload" type="file" className="sr-only" onDrag={handleDrag}/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
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
                                <div className="col-span-full">
                                    <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                                        Source code
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <BsFileZip className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span>Upload zip file</span>
                                                    <input accept=".zip" required id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileInputChange}/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">File up to 10MB</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="file-container py-[20px] col-span-full">
                                    {zipFile && (
                                        <div className=" relative w-1/2 sm:w-1/3 lg:w-1/5 px-2 py-2 border border-gray-400 rounded-lg">
                                            <BsFileZip className="mx-auto h-14 w-14 text-gray-300" aria-hidden="true" />
                                            <div className="grow"></div>
                                            <div className="flex items-center mt-4 justify-between">
                                                <p className="text-sm opacity-80">{fileZipName}</p>
                                                <a
                                                    href={URL.createObjectURL(zipFile)}
                                                    download={fileZipName}
                                                >
                                                    <BiDownload />
                                                </a>
                                                
                                            </div>
                                            <button className=" hover:opacity-80 absolute top-1 right-2 rounded-[50%] text-[10px] bg-slate-400 text-white px-[8px] py-[4px] z-40" onClick={onDeleteZipFile}>x</button>
                                        </div>
                                    )}
                                   
                                </div>
                            </div>
                        </div>
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 space-y-10">
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">Mode</legend>
                                    <div className="mt-6 space-y-6">
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
                                            <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Peoples who have link of my package
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                checked={mode === "onlyme"}
                                                id="onlyme"
                                                name="onlyme"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                onChange={onChangeMode}
                                                value={"onlyme"}
                                            />
                                            <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                                                Only me
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={onAddNewPackage}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPackage;