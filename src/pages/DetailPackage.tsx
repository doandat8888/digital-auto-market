import { useNavigate, useParams } from "react-router";
import { BiLike }  from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import 'swiper/css';
import Slideshow from "../components/ImageSlider";
import { useDispatch } from "react-redux";
import React, { useState, useEffect } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import packageService from "../services/packageService";
import { AiOutlineComment, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import NotFound from "../components/404NotFound";
import ModalCommentRating from "../components/ModalCommentRating";

const DetailPackage = () => {

    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    const { id } = useParams();
    //const packages = useSelector((state: RootState) => state.packages.value);
    const [isLoading, setIsLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<IGetVersion>();
    const [openModalCommentRating, setOpenModalCommentRating] = useState<boolean>(false);
    //Dispatch
    const dispatch = useDispatch();

    //Navigate
    const navigate = useNavigate();

    //User info
    const [tokenUser, setTokenUser] = useState<string>("");
    const [user, setUser] = useState<IUser | null>();

    //Get user info
    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        setTokenUser(localToken);
    }, [])

    useEffect(() => {
        if(tokenUser !== "") {
            setIsLoading(true);
            getUserInfo();
        }
    }, [tokenUser]);

    useEffect(() => {
        if(packageDetail) {
            setCurrentVersion(packageDetail.version);
        }
    }, [packageDetail])

    const getPackageInfo = async() => {
        if(id) {
            const response = await packageService.getPackageById(id);
            if(response && response.data) {
                setPackageDetail(response.data);
                checkPackage();
                if(user) {
                    setIsLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        getPackageInfo();
    }, [user])

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

    const onCloseModal = () => {
        setIsLoading(false);
    }

    const checkPackage = () => {
        if(user) {
            const canEdit = packageDetail && packageDetail.createdBy === user._id ? true : false;
            setCanEdit(canEdit);
        }
    }

    const updatePackage = (packageDetail: IGetPackage | undefined) => {
        navigate(`/updatepackage/${packageDetail?._id}`);
    }

    const onRemovePackage = async(packageId: string) => {
        setIsLoading(true);
        let response = await packageService.removePackage(packageId);
        if(response && response.status === 200) {
            alert(response.data.msg);
            setIsLoading(false);
            navigate('/');
        }
    }

    const handleChangeVersion = (versionId: string) => {
        setIsLoading(true);
        findVersionById(versionId);
        setIsLoading(false);
    }

    const findVersionById = (versionId: string) => {
        if(packageDetail && packageDetail.versions) {
            const version: IGetVersion | undefined = packageDetail.versions.find((version) => version._id === versionId);
            setCurrentVersion(version);
        }
    }

    return (
        <div>
            {packageDetail ?  
            <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <LoadingModal open={isLoading} closeModal={onCloseModal}/>
                <button onClick={() => onRemovePackage(packageDetail? packageDetail._id : '')}>Remove package</button>
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
                                        <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleChangeVersion(event.target.value)} className="border px-2 py-1 border-gray-500 rounded">
                                            {packageDetail && packageDetail.versions && packageDetail.versions.map((version) => (
                                                <option value={version._id}>{version.name}</option>
                                            ))}
                                        </select>
                                        <Link to={`/manageversion/${packageDetail?._id}`} className="mx-2 text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] opacity-80">Realse versions</Link>
                                    </div>
                                    <p className="text-[12px] sm-text-[14px] lg:text-[16px] opacity-75">{packageDetail?.authors[0]}</p>
                                    <div className="grow"></div>
                                    <div className="flex">
                                        <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">{packageDetail?.likes??0}</p></div>
                                    </div>
                                    <div className="grow"></div>
                                    <div className="lg:flex md:flex sm-flex">
                                        <div className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-2 round cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                            px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Like</p> <BiLike />
                                        </div>
                                        {packageDetail?.version.downloadUrl &&
                                            <a href={currentVersion?.downloadUrl} className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-2 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
                                                px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Download</p> <BsDownload />
                                            </a>
                                        }
                                        {canEdit &&
                                            <div onClick={() => updatePackage(packageDetail)} className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-2 round cursor-pointer hover:opacity-60 bg-yellow-500 text-white 
                                                px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Update</p> <AiOutlineEdit />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="my-4 flex">
                                <div className="description">
                                    <p className="text-xl font-bold">Description</p>
                                    <p>{packageDetail?.fullDesc}</p>
                                </div>
                            </div>
                            <Slideshow slideImages={packageDetail?.images}/>
                            <div className="comment-rating my-6">
                                <div className="flex justify-between">
                                    <div className="text-xl">Reviews</div>
                                    <button onClick={() => setOpenModalCommentRating(true)} className="border-none text-sm outline-none hover:opacity-80 flex justify-center w-[30%] px-2 py-2 text-white items-center cursor-pointer rounded bg-orange-500"><AiOutlineComment /><p className="sm:block sm:ml-2 hidden ">Comment & rating</p></button>
                                </div>
                            </div>
                            <ModalCommentRating packageId={packageDetail._id} createdBy={packageDetail.createdBy} versionId={currentVersion ? currentVersion._id : ''} open={openModalCommentRating} onCloseModal={() => setOpenModalCommentRating(false)}/>
                        </div>
                    </div>
                </div>
            </div> : <NotFound />}
        </div>
       
    )
}

export default DetailPackage;