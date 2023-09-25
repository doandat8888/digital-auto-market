import { useNavigate, useParams } from "react-router";
import { BiLike }  from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import 'swiper/css';
import Slideshow from "../components/ImageSlider";
import { useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import handleFile from "../utils/handleFile";
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
//import { AiOutlineEdit } from "react-icons/ai";
import { removePackage } from "../redux/package/packageSlice";
import packageService from "../services/packageService";

const DetailPackage = () => {

    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    const { id } = useParams();
    const [packages, setPackages] = useState<IGetPackage[]>([]);
    //const packages = useSelector((state: RootState) => state.packages.value);
    const zipFile: Blob | null = null;
    const [isLoading, setIsLoading] = useState(true);
    //const [canEdit, setCanEdit] = useState(false);
    //Dispatch
    const dispatch = useDispatch();

    //Navigate
    const navigate = useNavigate();

    // if(packageDetail?.source) {
    //     const sourceZip: string = packageDetail?.source;
    //     zipFile = handleFile.base64ToBlob(sourceZip);
    //     handleFile.base64ToBlob(sourceZip);
    // }

    //User info
    const [tokenUser, setTokenUser] = useState<string>("");
    const [user, setUser] = useState<IUser | null>();

    //Get user info
    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        console.log("Token details: " + localToken);
        setTokenUser(localToken);
    }, [])


    useEffect(() => {
        if(tokenUser !== "") {
            getUserInfo();
        }
    }, [tokenUser]);

    useEffect(() => {
        if(user) {
            checkPackage();
            setIsLoading(false);
        }else {
            setIsLoading(false);
        }
    }, [user]);

    const getPackageInfo = async() => {
        if(id) {
            const response = await packageService.getPackageById(id);
            if(response) {
                setPackageDetail(response.data);
            }
        }
    }

    useEffect(() => {
        getPackageInfo();
    }, [tokenUser, packageDetail])

    useEffect(() => {
        getAllPackage();
    }, []);

    useEffect(() => {
        if(packages.length > 0) {
            setIsLoading(false);
        }
    }, [packages])

    const getUserInfo = async () => {
        try {
            const response = await userService.getUser();
            if (response && response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const downloadZipFile = () => {
        handleFile.downloadZipFile(zipFile);
    }

    const onCloseModal = () => {
        setIsLoading(false);
    }

    const checkPackage = () => {
        // if(user) {
        //     const canEdit = packageDetail && packageDetail.uid === user._id ? true : false;
        //     setCanEdit(canEdit);
        // }
    }

    // const updatePackage = (packageDetail: IUpdatePackage | undefined) => {
    //     navigate(`/updatepackage/${packageDetail?._id}`);
    // }

    const onRemovePackage = (packageId: string | undefined) => {
        dispatch(removePackage(packageId ? packageId : ''));
    }

    const getAllPackage = async() => {
        const response = await packageService.getAllPackage();
        if(response && response.data && response.data.data.length > 0) {
            setPackages(response.data.data);
        }
    }

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <LoadingModal open={isLoading} closeModal={onCloseModal}/>
            <button onClick={() => onRemovePackage(packageDetail?._id)}>Remove package</button>
            <div className="w-full h-full pt-4 pb-2 px-2 md:px-4 flex justify-center">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-[960px] bg-slate-200 mt-2 px-2 md:px-6 py-2 md:py-4 rounded-lg">
                        <div className="w-full lg:flex md:flex bg-white rounded-lg py-4 pl-3 pr-1 flex max-h-[300px]">
                            <div className="w-1/3 grid lg:place-items-center sm:place-items-center md:place-items-center">
                                <img src={packageDetail?.thumbnail} alt="" className="w-[80%] max-h-[180px] rounded-lg max-w-[300px] object-cover"/>
                            </div>
                            <div className="w-2/3 px-6 flex flex-col">
                                <div className="lg:flex items-center sm:flex">
                                    <p className="lg:text-xl sm:text-lg text-[16px] font-bold">{packageDetail?.name}</p>
                                    <div className="grow"></div>
                                    <p className="text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] opacity-80">v {packageDetail?.version.name}</p>
                                </div>
                                <p className="text-[12px] sm-text-[14px] lg:text-[16px] opacity-75">{packageDetail?.authors[0]}</p>
                                <div className="grow"></div>
                                <div className="flex">
                                    <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">{packageDetail?.likes??0}</p></div>
                                   {/*  <div className="flex items-center mx-1"><BsDownload /><p className="text-[14px] ml-[2px]">{packageDetail?.download??0}</p></div> */}
                                </div>
                                <div className="grow"></div>
                                <div className="lg:flex md:flex sm-flex">
                                    <div className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-2 round cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                        px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Like</p> <BiLike />
                                    </div>
                                    {zipFile &&
                                        <div onClick={downloadZipFile} className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-2 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
                                            px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Download</p> <BsDownload />
                                        </div>
                                    }
                                    {/* {canEdit &&
                                        <div onClick={() => updatePackage(packageDetail)} className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-2 round cursor-pointer hover:opacity-60 bg-yellow-500 text-white 
                                            px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Edit</p> <AiOutlineEdit />
                                        </div>
                                    } */}
                                </div>
                            </div>
                        </div>
                        <div className="description my-4">
                            <p className="text-xl font-bold">Description</p>
                            <p>{packageDetail?.fullDesc}</p>
                        </div>
                        <Slideshow slideImages={packageDetail?.images}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPackage;