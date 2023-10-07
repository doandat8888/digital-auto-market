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
import reviewService from "../services/reviewService";
import ReviewList from "../components/ReviewList";
import { removeToken } from "../redux/token/tokenSlice";
import ModalConfirmDelete from "../components/ModalConfirmDelete";

const DetailPackage = () => {

    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    const { id } = useParams();
    //const packages = useSelector((state: RootState) => state.packages.value);
    const [isLoading, setIsLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<IGetVersion>();
    const [openModalCommentRating, setOpenModalCommentRating] = useState<boolean>(false);
    const [isLike, setIsLike] = useState(false);
    //Dispatch
    const dispatch = useDispatch();

    //Navigate
    const navigate = useNavigate();

    //User info
    const [tokenUser, setTokenUser] = useState<string>("");
    const [user, setUser] = useState<IUser | null>();

    //Review
    const [reviews, setReviews] = useState<IUpdateReview[]>();
    const [reviewUpdate, setReviewUpdate] = useState<IUpdateReview>();
    const [reviewDeleteId, setReviewDeleteId] = useState<string>("");

    //Modal confirm delete
    const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);

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
    }, [user, id])

    const getUserInfo = async () => {
        try {
            const response = await userService.getUser();
            if (response && response.status === 200) {
                setUser(response.data);
            }
        } catch (error: any) {
            if(error.response.status === 403) {
                dispatch(removeToken());
                navigate(`/package/${packageDetail?._id}`)
            }
        }
    }

    const onCloseModal = () => {
        setOpenModalCommentRating(false);
        setIsLoading(false);
        setReviewUpdate(undefined);
        console.log("Review update close modal: ", reviewUpdate);
    }

    const checkPackage = () => {
        if(user && packageDetail) {
            console.log("User id: ", user._id);
            console.log("Created by id: ", packageDetail?.createdBy._id);
            const canEdit = packageDetail && packageDetail.createdBy._id === user._id ? true : false;
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

    useEffect(() => {
        getReviewByPackageId();
    }, [packageDetail])

    const getReviewByPackageId = async() => {
        if(packageDetail) {
            const response = await reviewService.getReviewByPackageId(packageDetail._id);
            if(response && response.data && response.data.data.length > 0) {
                setReviews(response.data.data);
            }
        }
    }

    const onUpdateReview = (review: IUpdateReview) => {
        setOpenModalCommentRating(true);
        setReviewUpdate(review);
        console.log("Review update: ", reviewUpdate);
    }

    const onDeleteReview = (reviewId: string) => {
        setOpenModalConfirmDelete(true);
        setReviewDeleteId(reviewId);
    }

    const deleteReview = async () => {
        if(reviewDeleteId) {
            try {
                const response = await reviewService.deleteReview(reviewDeleteId);
                if(response && response.status === 200) {
                    alert("Delete successfully!");
                    onRefreshData();
                    setReviewDeleteId("");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onClickBtnCommentRating = () => {
        if(!tokenUser) {
            navigate('/login');
        }else {
            setOpenModalCommentRating(true);
        }
    }

    const onRefreshData = () => {
        getReviewByPackageId();
        window.location.href = `/package/${packageDetail?._id}`;
    }

    const onLikePackage = async() => {
        setIsLike(!isLike);
    }

    return (
        <div>
            <button onClick={() => onRemovePackage(packageDetail?._id ? packageDetail._id : "")}>Remove this package</button>
            {packageDetail ?  
            <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <LoadingModal open={isLoading} closeModal={onCloseModal}/>
                <div className="w-full h-full pt-4 pb-2 px-2 md:px-4 flex justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-full max-w-[960px] bg-slate-200 mt-2 px-2 md:px-6 py-2 md:py-4 rounded-lg">
                            <div className="w-full sm:flex bg-white rounded-lg p-6 flex max-h-[400px]">
                                <div className="w-1/5">
                                    <img src={packageDetail?.thumbnail} alt="" className="sm:w-[180px] sm:h-[180px] w-[90px] h-[90px] rounded-lg object-cover"/>
                                </div>
                                <div className="w-4/5 pl-3 flex flex-col ml-4">
                                    <div className="items-center flex">
                                        <p className="lg:text-xl sm:text-lg text-[16px] font-bold">{packageDetail?.name}</p>
                                        <div className="grow"></div>
                                        <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleChangeVersion(event.target.value)} className="sm:text-sm my-2 text-[10px] border px-2 py-1 border-gray-500 rounded">
                                            {packageDetail && packageDetail.versions && packageDetail.versions.map((version) => (
                                                <option value={version._id}>{version.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-between sm-text-[14px] lg:text-[16px]">
                                        <p className="text-[12px] opacity-75">{packageDetail?.authors[0]}</p>
                                        <Link to={`/manageversion/${packageDetail?._id}`} className="sm:mx-2 text-[12px] sm:text-[12px] opacity-80">Version histories</Link>
                                    </div>
                                   
                                    <div className="grow"></div>
                                    <div className="flex mt-2">
                                        <div onClick={() => onLikePackage()} className="py-1.5 px-2 round flex items-center cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                            rounded-lg"><BiLike /><p className="text-[8px] hidden sm:block sm:text-[12px] ml-1">{isLike === false ? "Like" : "Unlike"}</p> 
                                        </div>
                                    </div>
                                    <div className="grow"></div>
                                    <div style={{display: "block"}} className="w-full">
                                        
                                        {packageDetail?.version.downloadUrl &&
                                            <a href={currentVersion?.downloadUrl} className="w-full lg:w-1/3 sm:w-1/3 my-4 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
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
                                    <button onClick={onClickBtnCommentRating} className="text-sm outline-none hover:opacity-80 flex justify-center w-[30%] px-2 py-2 items-center cursor-pointer rounded border-2 border-black text-black"><AiOutlineComment /><p className="sm:block sm:ml-2 hidden ">Comment & rating</p></button>
                                </div>
                                <div className="w-full rounded-lg py-4">
                                    {reviews && user ? <ReviewList onDeleteReview={onDeleteReview} onUpdateReview={onUpdateReview} user={user} reviewsFilter={reviews}/> : 
                                        <div className="no-comment text-center">
                                            <img className="mx-auto w-[30%]" src="https://th.bing.com/th/id/OIP.xkk9jZVAs8AXAWYyylvX6wHaF_?pid=ImgDet&rs=1" alt="no-comment" />
                                            <p className="text-[16px]">There is no comment here. Be the first one to comment on this package</p>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                            <ModalCommentRating openModalLoading={() => setIsLoading(true)} onCloseModalLoading={() => setIsLoading(false)} isLoading={isLoading} reviewUpdate={reviewUpdate} refreshData={onRefreshData} packageId={packageDetail._id} createdBy={packageDetail.createdBy} versionId={currentVersion ? currentVersion._id : ''} open={openModalCommentRating} onCloseModal={onCloseModal}/>
                            <ModalConfirmDelete remove={deleteReview} handleClose={() => setOpenModalConfirmDelete(false)} open={openModalConfirmDelete}/>
                        </div>
                    </div>
                </div>
            </div> : <NotFound />}
        </div>
       
    )
}

export default DetailPackage;