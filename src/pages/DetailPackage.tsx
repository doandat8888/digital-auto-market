import { useNavigate, useParams } from "react-router";
import { BiDownload, BiLike }  from 'react-icons/bi';
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
import { CiShare1 } from "react-icons/ci";
import { GoCopy } from "react-icons/go";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from "@monaco-editor/react";

const DetailPackage = () => {

    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
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
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [hasReviews, setHasReviews] = useState(0);
    const [reviews, setReviews] = useState<IUpdateReview[]>();
    const [reviewUpdate, setReviewUpdate] = useState<IUpdateReview>();
    const [reviewDeleteId, setReviewDeleteId] = useState<string>("");

    //Modal confirm delete
    const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);

    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    const versionParam = params.get("version");
    const versionIdParam = params.get("versionId");
    //Get user info

    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        setTokenUser(localToken);
    }, [id])

    useEffect(() => {
        if(tokenUser !== "") {
            getUserInfo();
        }
    }, [tokenUser, id]);

    useEffect(() => {
        if(packageDetail && versionParam === "latest") {
            setCurrentVersion(packageDetail.version);
        }else {
            findVersionById(versionIdParam ? versionIdParam : '');
        }
    }, [packageDetail]);

    const getPackageInfo = async() => {
        if(id) {
            try {
                const response = await packageService.getPackageById(id);
                if(response && response.data) {
                    setPackageDetail(response.data);
                    if(response.data.userLike === true) {
                        setIsLike(true);
                    }else {
                        setIsLike(false);
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if(packageDetail) {
            checkPackage();
        }
    }, [packageDetail])

    useEffect(() => {
        getPackageInfo();
        findVersionById(versionIdParam ? versionIdParam : '');
    }, [user, id]);


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
            const canEdit = packageDetail && packageDetail.createdBy._id === user._id ? true : false;
            setCanEdit(canEdit);
        }
    }

    const updatePackage = (packageDetail: IGetPackage | undefined) => {
        navigate(`/updatepackage/${packageDetail?._id}`);
    }
    
    const handleChangeVersion = (versionId: string) => {
        setIsLoading(true);
        changeVersion(versionId);
        setIsLoading(false);
    }

    const changeVersion = (versionId: string) => {
        if(packageDetail && packageDetail.versions) {
            const version: IGetVersion | undefined = packageDetail.versions.find((version) => version._id === versionId);
            let params = new URLSearchParams(url.search);
            if(version) {
                params.set("version", version.name);
                params.set("versionId", version._id);
            } 
            url.search = params.toString();
            window.location.href = url.href
        }
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
            try {
                const response = await reviewService.getReviewByPackageId(packageDetail._id);
                if(response && response.data) {
                    if(response.data.data.length > 0) {
                        setIsLoadingReview(false);
                        setHasReviews(1);
                        setReviews(response.data.data);
                    }else if(response.data.data.length === 0) {
                        setIsLoadingReview(false);
                        setHasReviews(-1);
                    }else {
                        setIsLoadingReview(true);
                        setHasReviews(0);
                    }
                }else {
                    setIsLoadingReview(false);
                }
            } catch (error: any) {
                console.log(error.data.response.msg);
            }
            
        }
    }

    const onUpdateReview = (review: IUpdateReview) => {
        setOpenModalCommentRating(true);
        setReviewUpdate(review);
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

    const handleLike = async(status: string) => {
        if(user) {
            if(status === "unlike") {
                try {
                    const response = await packageService.toggleLikePackage(packageDetail ? packageDetail._id : '', "unlike");
                } catch (error: any) {
                    console.log(error.response.data.msg);
                }
            }else {
                try {
                    const response = await packageService.toggleLikePackage(packageDetail ? packageDetail._id : '', "like");
                } catch (error: any) {
                    console.log(error.response.data.msg);
                }
            }
            setIsLike(!isLike);
        }else {
            navigate('/login');
        }
    }

    const onDownLoadPackage = async() => {
        try {
            const response = await packageService.updateDownLoad(packageDetail ? packageDetail._id : '');
            console.log("Current version: ", currentVersion);
        } catch (error: any) {
            alert(error.response.data.msg);
        }
    }

    const onCopyUrl = (link: string | undefined) => {
        const el = document.createElement("input");
        if(link) {
            el.value = link;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            toast.success("Copied to clipboard");
        }
    }

    const onRemovePackage = async(packageId: string) => {
        try {
            let response = await packageService.removePackage(packageId);
            if(response && response.status === 200) {
                alert("Deleted successfully!");
                navigate('/');
            }
        } catch (error: any) {
            alert(error.response.data.msg);
        }
    }

    return (
        <div>
            {/* <button onClick={() => onRemovePackage(packageDetail?._id ? packageDetail._id : "")}>Remove this package</button> */}
            <LoadingModal open={isLoading} closeModal={onCloseModal}/>
            {packageDetail &&  
            <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <div className="w-full h-full pt-4 pb-2 px-2 md:px-4 flex justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="sm:w-[60%] lg:w-[80%] xl:w-[60%] w-[100%] bg-slate-200 mt-2 px-2 md:px-6 sm:py-6 py-2 rounded-lg">
                            <div className="w-full sm:flex bg-white rounded-lg sm:p-6 p-2 flex max-h-[400px]">
                                <div className="sm:w-[20%] flex aspect-square w-[30%]">
                                    <img src={packageDetail.thumbnail && packageDetail.thumbnail === "abc" ? 'https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png' : packageDetail.thumbnail} alt="" className="min-w-[20px] h-[50%] sm:h-[100%] rounded-lg object-fill aspect-square" />
                                </div>
                                <div className="sm:w-[80%] w-[70%] sm:pl-3 pl-1 flex flex-col sm:ml-4 ml-2">
                                    <div className="items-center sm:flex">
                                        <div className="flex justify-between">
                                            <p className="lg:text-xl truncate w-[200px] sm:text-lg text-[16px] font-bold text-black">{packageDetail?.name}</p>
                                            {canEdit &&
                                                <div onClick={() => updatePackage(packageDetail)} className="ml-2 py-1 px-1 round flex items-center cursor-pointer hover:opacity-60 text-black border border-gray-500
                                                    rounded-lg"><AiOutlineEdit /><p className="text-[8px] hidden sm:block sm:text-[10px] ml-1">Update</p> 
                                                </div>
                                            }
                                        </div>
                                        <div className="grow"></div>
                                        <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleChangeVersion(event.target.value)} className="block sm:ml-2 sm:text-sm text-[10px] border px-2 py-1 border-gray-500 rounded bg-white text-black">
                                            {packageDetail && packageDetail.versions && packageDetail.versions.map((version) => (
                                                <option selected={version.name === versionParam} value={version._id}>{version.name}</option>
                                            ))}
                                        </select>
                                        
                                        
                                    </div>
                                    <div className="grow"></div>
                                    <div className="flex justify-between sm-text-[14px] lg:text-[16px]">
                                        <p className="text-[12px] sm:text-[14px] opacity-75 text-black">{packageDetail?.createdBy.fullName}</p>
                                        <Link to={`/manageversion/${packageDetail?._id}`} className="mx-2 text-[12px] sm:text-[14px] opacity-80 truncate text-black">Version histories</Link>
                                    </div>
                                    <div className="grow"></div>
                                    <div className="flex mt-2">
                                        <div onClick={() => handleLike(isLike === true ? "unlike" : "like")} className="py-1.5 px-2 round flex items-center cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                            rounded-lg"><BiLike /><p className="text-[12px] sm:text-[12px] ml-1">{isLike === false ? "Like" : "Unlike"}</p> 
                                        </div>
                                    </div>
                                    <div className="grow"></div>
                                    <div className="flex mt-2">
                                        <div className="flex items-center mx-1 opacity-70 text-black"><BiLike /><p className="text-[14px] ml-[2px] ">{packageDetail?.likes.length}</p></div>
                                        <div className="flex items-center mx-1 opacity-70 text-black"><BiDownload /><p className="text-[14px] ml-[2px] ">{packageDetail?.downloads}</p></div>
                                    </div>
                                    <div className="sm:flex justify-between">
                                        <div className="w-full sm:block mr-8">
                                            {packageDetail?.version.downloadUrl &&
                                                <button onClick={onDownLoadPackage} className="w-full mt-4 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
                                                    px-6 py-2 rounded-lg items-center justify-center">
                                                    <a className="w-full flex items-center justify-center" href={versionParam === 'latest' ? packageDetail.downloadUrl : currentVersion?.downloadUrl}><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Download</p> <BsDownload />
                                                    </a>
                                                </button>
                                            }
                                        </div>
                                        <div className="w-full sm:block mr-8">
                                            {packageDetail?.version.downloadUrl &&
                                                <button className="w-full mt-4 round cursor-pointer hover:opacity-60 text-black-500 border border-black
                                                    px-6 py-2 rounded-lg items-center justify-center">
                                                    <a target="_blank" rel="noopener noreferrer" className="w-full text-black flex items-center justify-center" href={versionParam === 'latest' ? packageDetail.entryUrl : currentVersion?.entryUrl}><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Preview</p> <CiShare1 />
                                                    </a>
                                                </button>
                                            }
                                        </div>
                                        <div className="w-full sm:block">
                                            {packageDetail?.version.downloadUrl &&
                                                <button className="text-black w-full flex mt-4 round cursor-pointer hover:opacity-60 text-black-500 border border-black
                                                    px-6 py-2 rounded-lg items-center justify-center" onClick={() => onCopyUrl(versionParam === 'latest' ? packageDetail.entryUrl : currentVersion?.entryUrl)}>
                                                    <p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Copy URL</p> <GoCopy />
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="my-4 flex">
                                <div className="description text-black">
                                    <p className="text-xl font-bold">Description</p>
                                    <div dangerouslySetInnerHTML={{__html: packageDetail.fullDesc}}></div>
                                </div>
                            </div>
                            <Slideshow slideImages={packageDetail?.images}/>
                            <div className="col-span-full my-4">
                                <div className="flex mb-2">
                                    <p className="text-xl font-bold text-black">Dashboard config</p>
                                </div>
                                <Editor options={{readOnly: true}} height="300px" defaultLanguage="javascript" defaultValue="// some comment" value={packageDetail.dashboardConfig}/>;
                            </div>
                            <div className="comment-rating my-6 text-black">
                                <div className="flex justify-between">
                                    <div className="text-xl font-semibold">Reviews</div>
                                    <button onClick={onClickBtnCommentRating} className="text-sm outline-none hover:opacity-80 flex justify-center w-[30%] px-2 py-2 items-center cursor-pointer rounded border-2 border-black text-black"><AiOutlineComment /><p className="sm:block sm:ml-2 hidden ">Comment & rating</p></button>
                                </div>
                                <div className="w-full rounded-lg py-4">
                                    {isLoadingReview ? <p className="text-black">Loading...</p> : ''}
                                    {hasReviews === 1 ? <ReviewList currentUser={user && user} onDeleteReview={onDeleteReview} onUpdateReview={onUpdateReview} reviewsFilter={reviews}/> : 
                                        hasReviews === -1 ?
                                        <div className="no-comment text-center">
                                            <img className="mx-auto w-[10%]" src="https://th.bing.com/th/id/R.d398a2e0d6d36ace87869a3f786c6979?rik=K8zpST5cjAejww&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_322817.png&ehk=oW9Pr%2fAMVWdSPoyXmhAG8%2bvVqTYgD8Yt%2bneO2UjKTk4%3d&risl=&pid=ImgRaw&r=0" alt="no-comment" />
                                            <p className="mt-2 sm:text-[16px] text-[12px]">There is no comment here. Be the first one to comment on this package</p>
                                        
                                        </div>
                                        : hasReviews === 0 && user && ''
                                    }
                                    
                                    
                                </div>
                            </div>
                            <ModalCommentRating openModalLoading={() => setIsLoading(true)} onCloseModalLoading={() => setIsLoading(false)} isLoading={isLoading} reviewUpdate={reviewUpdate} refreshData={onRefreshData} packageId={packageDetail._id} createdBy={packageDetail.createdBy} versionId={currentVersion ? currentVersion._id : ''} open={openModalCommentRating} onCloseModal={onCloseModal}/>
                            <ModalConfirmDelete remove={deleteReview} handleClose={() => setOpenModalConfirmDelete(false)} open={openModalConfirmDelete}/>
                        </div>
                    </div>
                </div>
            </div>}
            <ToastContainer />
            {isLoading === false && !packageDetail && <NotFound/>}
        </div>
    )
}

export default DetailPackage;