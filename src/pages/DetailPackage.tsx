import { useNavigate, useParams } from "react-router";
import { BiDownload, BiLike } from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import 'swiper/css';
import Slideshow from "../components/ImageSlider";
import { useDispatch } from "react-redux";
import React, { useState, useEffect } from 'react';
import userService from "../services/userService";
import LoadingModal from "../components/LoadingDialog";
import packageService from "../services/packageService";
import { AiOutlineComment, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import NotFound from "../components/404NotFound";
import ModalCommentRating from "../components/ModalCommentRating";
import reviewService from "../services/reviewService";
import ReviewList from "../components/ReviewList";
import { removeToken } from "../redux/token/tokenSlice";
import ModalConfirm from "../components/ModalConfirm";
import { CiShare1 } from "react-icons/ci";
import { GoCopy } from "react-icons/go";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from "@monaco-editor/react";
import { Pagination } from "@mui/material";
import { TiCancel, TiTickOutline } from "react-icons/ti";

const DetailPackage = () => {

    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<IGetVersion>();
    const [openModalCommentRating, setOpenModalCommentRating] = useState<boolean>(false);
    const [isLike, setIsLike] = useState(false);
    const [downloads, setDownloads] = useState<number>(0);
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
    const [totalReview, setTotalReview] = useState(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = 5;

    //Modal confirm delete
    const [openModalConfirmDeleteReview, setOpenModalConfirmDeleteReview] = useState(false);
    const [openModalConfirmDeletePackage, setOpenModalConfirmDeletePackage] = useState(false);
    const [openModalConfirmChangeStatus, setOpenModalConfirmChangeStatus] = useState(false);

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const versionParam = params.get("version");
    const versionIdParam = params.get("versionId") ? params.get("versionId") : '';
    //Get user info

    //Current status
    const [currentStatus, setCurrentStatus] = useState("");

    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        setTokenUser(localToken);
    }, [id]);

    useEffect(() => {
        if (tokenUser !== "") {
            getUserInfo();
        }
    }, [tokenUser, id]);

    useEffect(() => {
        if (packageDetail && versionParam === "latest") {
            setCurrentVersion(packageDetail.version);
        } else {
            findVersionById(versionIdParam ? versionIdParam : '');
        }
    }, [packageDetail]);

    const getPackageInfo = async () => {
        if (id) {
            try {
                await packageService.getPackageById(id).then(({ data }) => {
                    if (data) {
                        setPackageDetail(data);
                        setIsLike(data.userLike);
                        setIsLoading(false);
                    }
                })
            } catch (error) {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        if (packageDetail) {
            checkPackage();
            setDownloads(packageDetail.downloads);
        }
    }, [packageDetail])

    useEffect(() => {
        getPackageInfo();
        findVersionById(versionIdParam ? versionIdParam : '');
    }, [user, id, isLike, downloads]);


    const getUserInfo = async () => {
        try {
            await userService.getUser().then(({ status, data }) => {
                if (status === 200) {
                    setUser(data);
                }
            });
        } catch (error: any) {
            if (error.response.status === 403) {
                dispatch(removeToken());
                // navigate(`/package/${packageDetail?._id}`)
            }
        }
    }

    const onCloseModal = () => {
        setOpenModalCommentRating(false);
        setIsLoading(false);
        setReviewUpdate(undefined);
    }

    const checkPackage = () => {
        if (user && packageDetail) {
            const canEdit = packageDetail && packageDetail.createdBy?._id === user?._id || user.role === "admin" ? true : false;
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
        if (packageDetail && packageDetail.versions) {
            const version: IGetVersion | undefined = packageDetail.versions.find((version) => version?._id === versionId);
            const params = new URLSearchParams(url.search);
            if (version) {
                params.set("version", version.name);
                params.set("versionId", version?._id);
            }
            url.search = params.toString();
            window.location.href = url.href
        }
    }

    const findVersionById = (versionId: string) => {
        if (packageDetail && packageDetail.versions) {
            const version: IGetVersion | undefined = packageDetail.versions.find((version) => version?._id === versionId);
            setCurrentVersion(version);
        }
    }

    useEffect(() => {
        getReviewByPackageId();
    }, [packageDetail])

    const getReviewByPackageId = async () => {
        if (packageDetail) {
            try {
                await reviewService.getReviewByPackageIdPaginate(packageDetail?._id, limit, currentPage).then(({ data }) => {
                    if (data && data.data) {
                        if (data.data.length > 0) {
                            setIsLoadingReview(false);
                            setHasReviews(1);
                            setReviews(data.data);

                        } else if (data.data.length === 0) {
                            setIsLoadingReview(false);
                            setHasReviews(-1);
                        } else {
                            setIsLoadingReview(true);
                            setHasReviews(0);
                        }
                    } else {
                        setIsLoadingReview(false);
                    }
                })

            } catch (error: any) {
                console.log(error.data.response.msg);
            }

        }
    }

    const getTotalReview = async () => {
        if (packageDetail) {
            try {
                await reviewService.getReviewByPackageId(packageDetail?._id).then(({ data }) => {
                    if (data && data.data && data.data.length > 0) {
                        setTotalReview(data.data.length);
                        let totalPagesReview = 0;
                        if (data.data.length % limit === 0) {
                            totalPagesReview = Math.floor(data.data.length / limit);
                        } else {
                            totalPagesReview = Math.floor(data.data.length / limit) + 1;
                        }
                        setTotalPage(totalPagesReview);
                    }
                })
            } catch (error: any) {
                console.log(error.data.response.msg);
            }
        }
    };

    useEffect(() => {
        getReviewByPackageId();
    }, [currentPage])

    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    useEffect(() => {
        getTotalReview();
    }, [reviews]);

    const onUpdateReview = (review: IUpdateReview) => {
        setOpenModalCommentRating(true);
        setReviewUpdate(review);
    }

    const onDeleteReview = (reviewId: string) => {
        setOpenModalConfirmDeleteReview(true);
        setReviewDeleteId(reviewId);
    }

    const deleteReview = async () => {
        if (reviewDeleteId) {
            try {
                await reviewService.deleteReview(reviewDeleteId).then(({ status }) => {
                    if (status === 200) {
                        alert("Delete successfully!");
                        onRefreshData();
                        setReviewDeleteId("");
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onClickBtnCommentRating = () => {
        if (!tokenUser) {
            navigate('/login');
        } else {
            setOpenModalCommentRating(true);
        }
    }

    const onRefreshData = () => {
        getReviewByPackageId();
        window.location.href = `/package/${packageDetail?._id}?version=${currentVersion?.name}&versionId=${currentVersion?._id}`;
    }

    const handleLike = async (status: string) => {
        if (user) {
            try {
                await packageService.toggleLikePackage(packageDetail ? packageDetail._id : '', status);
            } catch (error: any) {
                console.log(error.response.data.msg);
            }
            setIsLike(!isLike);

        } else {
            navigate('/login');
        }
    }

    const onDownLoadPackage = async () => {
        if (!user) {
            navigate('/login');
        } else {
            try {
                await packageService.updateDownLoad(packageDetail ? packageDetail._id : '');
                setDownloads(packageDetail?.downloads ? packageDetail.downloads + 1 : 0);
            } catch (error: any) {
                alert(error.response.data.msg);
            }
        }
    }

    const onCopyUrl = (link: string | undefined) => {
        if (!user) {
            navigate('/login');
        } else {
            const el = document.createElement("input");
            if (link) {
                el.value = link;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
                toast.success("Copied to clipboard");
            }
        }

    }

    const onRemovePackage = () => {
        setOpenModalConfirmDeletePackage(true);
    }

    const removePackage = async () => {
        if (packageDetail) {
            try {
                const response = await packageService.removePackage(packageDetail?._id);
                if (response && response.status === 200) {
                    alert("Deleted successfully!");
                    navigate('/');
                }
            } catch (error: any) {
                alert(error.response.data.msg);
            }
        }
    }

    //Change status
    const handleChangeStatus = (packageState?: string) => {
        setOpenModalConfirmChangeStatus(true);
        if (packageState) {
            setCurrentStatus(packageState);
        }
    }

    const changeStatus = async () => {
        try {
            if (packageDetail) {
                await packageService.changeStatus(packageDetail?._id, currentStatus !== "" ? currentStatus : packageDetail.state).then(({ data, status }) => {
                    if (status === 200) {
                        setOpenModalConfirmChangeStatus(false);
                        toast.success(data.msg);
                        setCurrentStatus("");
                        window.location.reload();
                    }
                })
            }

        } catch (error) {
            toast.error("Fail to change status");
            setCurrentStatus("");
        }
    }

    return (
        <div>
            {/* <button onClick={() => onRemovePackage(packageDetail?._id ? packageDetail._id : "")}>Remove this package</button> */}
            <LoadingModal open={isLoading} closeModal={onCloseModal} />
            {packageDetail &&
                <div className={`${isLoading === true ? 'hidden' : ''} pt-[46px]`}>
                    <div className="w-full h-full pt-4 pb-2 px-2 md:px-4 flex justify-center">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="sm:w-[80%] lg:w-[80%] xl:w-[70%] w-[100%] bg-slate-200 mt-2 px-2 md:px-6 sm:py-6 py-2 rounded-lg">
                                <div className="w-full sm:flex bg-white rounded-lg sm:p-6 p-2 flex max-h-[400px]">
                                    <div className="sm:w-[20%] flex aspect-square w-[30%] min-w-[120px]">
                                        <img src={packageDetail.thumbnail && packageDetail.thumbnail === "abc" ? 'https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png' : packageDetail.thumbnail} alt=""
                                            className="min-w-[100px] h-[50%] sm:h-[100%] rounded-lg object-contain aspect-square" />
                                    </div>
                                    <div className="sm:w-[80%] w-[65%] sm:pl-3 pl-1 flex flex-col sm:ml-4 ml-2">
                                        <div className="items-center sm:flex">
                                            <div className="flex justify-between">
                                                <p className="lg:text-xl truncate w-[200px] sm:text-lg text-[14px] font-bold text-black select-none">{packageDetail?.name}</p>
                                                <div className="flex">
                                                    {canEdit &&
                                                        <div onClick={() => updatePackage(packageDetail)} className="bg-yellow-500 ml-2 py-1 px-1.5 round flex items-center cursor-pointer hover:opacity-60 text-white select-none
                                                        rounded-lg">
                                                            <AiOutlineEdit />
                                                            <p className="text-[8px] hidden lg:block sm:text-[10px] ml-1">Update</p>
                                                        </div>
                                                    }
                                                    {canEdit &&
                                                        <div onClick={() => onRemovePackage()} className="bg-red-500 ml-2 py-1 px-1.5 round flex items-center cursor-pointer hover:opacity-60 text-white select-none
                                                        rounded-lg">
                                                            <AiOutlineDelete />
                                                            <p className="text-[8px] hidden lg:block sm:text-[10px] ml-1">Delete</p>
                                                        </div>
                                                    }
                                                    {user?.role == "admin" && packageDetail.state === 'rejected' ?
                                                        <div onClick={() => handleChangeStatus()} className="bg-green-400 ml-2 py-1 px-1.5 round flex items-center cursor-pointer hover:opacity-60 text-white select-none
                                                        rounded-lg">
                                                            <TiTickOutline />
                                                            <p className="text-[8px] hidden lg:block sm:text-[10px] ml-1">Approve</p>
                                                        </div>
                                                        : user?.role == "admin" && packageDetail.state == 'approved' ?
                                                            <div onClick={() => handleChangeStatus()} className="bg-red-400 ml-2 py-1 px-1.5 round flex items-center cursor-pointer hover:opacity-60 text-white select-none
                                                        rounded-lg">
                                                            <TiCancel />
                                                            <p className="text-[8px] hidden lg:block sm:text-[10px] ml-1">Reject</p>
                                                            </div> : user?.role == "admin" &&
                                                            <div className="flex">
                                                                <div onClick={() => handleChangeStatus("rejected")} className="bg-green-400 ml-2 py-1 px-1 round flex items-center cursor-pointer hover:opacity-60 text-white select-none
                                                            rounded-lg">
                                                                <TiTickOutline />
                                                                <p className="text-[8px] hidden sm:block sm:text-[10px] ml-1">Approve</p>
                                                                </div>
                                                                <div onClick={() => handleChangeStatus("approved")} className="bg-red-400 ml-2 py-1 px-1 round flex items-center cursor-pointer hover:opacity-60 text-white select-none
                                                            rounded-lg">
                                                                <TiCancel />
                                                                <p className="text-[8px] hidden sm:block sm:text-[10px] ml-1">Reject</p>
                                                                </div>
                                                            </div>
                                                    }

                                                </div>

                                            </div>
                                            <div className="grow"></div>
                                            <Link to={`/manageversion/${packageDetail?._id}`} className=" text-[12px] sm:text-[14px] opacity-80 truncate text-black select-none">Version history</Link>
                                        </div>
                                        <div className="grow"></div>
                                        <div className="flex justify-between sm-text-[14px] lg:text-[16px]">
                                            <p className="text-[12px] sm:text-[14px] opacity-75 text-black select-none">{packageDetail?.createdBy.fullName}</p>
                                            <select onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleChangeVersion(event.target.value)}
                                                className="block sm:ml-2 sm:text-sm text-[10px] border px-2 py-1 border-gray-500 rounded bg-white text-black select-none">
                                                {packageDetail && packageDetail.versions && packageDetail.versions.map((version) => (
                                                    <option selected={version.name === versionParam} value={version?._id}>{version?.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grow"></div>
                                        <div className={`flex mt-2 ${!user ? 'hidden' : ''}`}>
                                            <div onClick={() => handleLike(isLike === true ? "unlike" : "like")} className="py-1.5 px-2 round flex items-center cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                            rounded-lg"><BiLike />
                                                <p className="text-[12px] sm:text-[12px] ml-1 select-none">{isLike === false ? "Like" : "Unlike"}</p>
                                            </div>
                                        </div>
                                        <div className={`grow ${!user ? 'hidden' : ''}`}></div>
                                        <div className="sm:flex">

                                        </div>
                                        <div className="flex mt-2">
                                            <div className="flex items-center mx-1 opacity-70 text-black select-none"><BiLike />
                                                <p className="text-[14px] ml-[2px] ">{packageDetail?.likes.length}</p>
                                            </div>
                                            <div className="flex items-center mx-1 opacity-70 text-black select-none"><BiDownload />
                                                <p className="text-[14px] ml-[2px] ">{packageDetail?.downloads}</p>
                                            </div>
                                        </div>
                                        <div className="lg:flex lg:w-[80%] w-[100%]">
                                            <div className="w-[20%] min-w-[180px] sm:block mr-8">
                                                {packageDetail?.version?.downloadUrl &&
                                                    <button onClick={onDownLoadPackage} className="w-full mt-4 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
                                                    px-4 py-2 rounded-lg items-center justify-center">
                                                        <a className="w-full flex items-center justify-center" href={!user ? '/login' || "https://store-be.digitalauto.asia/login" : currentVersion?.downloadUrl}>
                                                            <p className="text-[12px] sm:text-[12px] lg:text-[14px] mx-2 select-none">Download</p> <BsDownload />
                                                        </a>
                                                    </button>
                                                }
                                            </div>
                                            <div className="w-[20%] min-w-[180px] sm:block mr-8">
                                                {packageDetail?.version?.downloadUrl &&
                                                    <button className="w-full mt-4 round cursor-pointer hover:opacity-60 text-black select-none-500 border border-black
                                                    px-6 py-2 rounded-lg items-center justify-center">
                                                        <a target="_blank" rel="noopener noreferrer" className="w-full text-black select-none flex items-center justify-center"
                                                            href={!user ?  '/login' || "https://store-be.digitalauto.asia/login" : currentVersion?.entryUrl}>
                                                            <p className="text-[12px] sm:text-[12px] lg:text-[14px] mx-2">Preview</p> <CiShare1 />
                                                        </a>
                                                    </button>
                                                }
                                            </div>
                                            <div className="w-[20%] min-w-[180px] sm:block">
                                                {packageDetail?.version?.downloadUrl &&
                                                    <button className="select-none w-full flex mt-4 round cursor-pointer hover:opacity-60 text-black select-none-500 border border-black
                                                py-2 rounded-lg items-center justify-center" onClick={() => onCopyUrl(currentVersion?.entryUrl)}>
                                                        <p className="text-[12px] sm:text-[12px] lg:text-[14px] mx-2 truncate">Copy URL</p> <GoCopy />
                                                    </button>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="my-4 flex">
                                    <div className="description text-black select-none">
                                        <p className="lg:text-xl md:text-lg text-sm font-bold">Description</p>
                                        <div className="whitespace-pre-line lg:text-[16px] md:text-[14px] text-sm">{packageDetail.fullDesc}</div>
                                    </div>
                                </div>
                                <Slideshow slideImages={packageDetail?.images} />
                                {canEdit && packageDetail && packageDetail.source &&
                                    <div className="my-4 flex">
                                        <div className="source text-black select-none">
                                            <p className="lg:text-xl md:text-lg text-sm font-bold">Source</p>
                                            <a target="blank" href={packageDetail.source} className="whitespace-pre-line lg:text-[16px] md:text-[14px] text-sm">{packageDetail.source}</a>
                                        </div>
                                    </div>
                                }
                                
                                <div className="col-span-full my-4">
                                    <div className="flex mb-2">
                                        <p className="text-xl font-bold text-black select-none">Dashboard config</p>
                                    </div>
                                    <div className="h-[200px] overflow-hidden">
                                        <Editor className="overflow-hidden" height="100%" options={{ readOnly: true, minimap: {enabled: false} }} defaultLanguage="javascript" defaultValue="// some comment" value={packageDetail.dashboardConfig} />
                                    </div>

                                </div>
                                <div className="comment-rating my-6 text-black select-none">
                                    <div className="flex justify-between">
                                        <div className="text-xl font-semibold">Reviews</div>
                                        <button onClick={onClickBtnCommentRating}
                                            className="text-sm outline-none hover:opacity-80 flex justify-center w-[30%] px-2 py-2 items-center cursor-pointer rounded border-2 border-black text-black select-none text-[18px]">
                                            <div className="text-[18px]"><AiOutlineComment /></div>
                                            <p className="sm:block sm:ml-2 hidden text-[14px]">Comment & rating</p>
                                        </button>
                                    </div>
                                    <div className="w-full rounded-lg py-4">
                                        {isLoadingReview ? <p className="text-black select-none">Loading...</p> : ''}
                                        {hasReviews === 1 ? <ReviewList currentUser={user ? user : undefined} onDeleteReview={onDeleteReview} onUpdateReview={onUpdateReview} reviewsFilter={reviews} /> :
                                            hasReviews === -1 ?
                                                <div className="no-comment text-center">
                                                    <img className="mx-auto w-[10%] opacity-30"
                                                        src="https://th.bing.com/th/id/R.d398a2e0d6d36ace87869a3f786c6979?rik=K8zpST5cjAejww&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_322817.png&ehk=oW9Pr%2fAMVWdSPoyXmhAG8%2bvVqTYgD8Yt%2bneO2UjKTk4%3d&risl=&pid=ImgRaw&r=0" alt="no-comment" />
                                                    <p className="mt-2 sm:text-[16px] text-[12px]">There is no comment here. Be the first one to comment on this package</p>

                                                </div>
                                                : hasReviews === 0 && user && ''
                                        }
                                    </div>
                                </div>
                                <Pagination
                                    className={`w-full flex text-black mx-auto justify-center ${totalReview <= limit ? 'hidden' : ''}`}
                                    count={totalPage}
                                    onChange={onChangePage}
                                />
                                <ModalCommentRating
                                    openModalLoading={() => setIsLoading(true)}
                                    onCloseModalLoading={() => setIsLoading(false)}
                                    isLoading={isLoading} reviewUpdate={reviewUpdate}
                                    refreshData={onRefreshData} packageId={packageDetail?._id}
                                    createdBy={packageDetail.createdBy} versionId={currentVersion ? currentVersion?._id : ''}
                                    open={openModalCommentRating}
                                    onCloseModal={onCloseModal}
                                />
                                <ModalConfirm
                                    content="Do you want to delete?"
                                    action={removePackage}
                                    handleClose={() => setOpenModalConfirmDeletePackage(false)}
                                    open={openModalConfirmDeletePackage}
                                />
                                <ModalConfirm
                                    content="Do you want to delete?"
                                    action={deleteReview}
                                    handleClose={() => setOpenModalConfirmDeleteReview(false)}
                                    open={openModalConfirmDeleteReview}
                                />
                                <ModalConfirm
                                    content={`Do you want to ${packageDetail.state === 'approved' ? 'reject' : packageDetail.state === 'rejected' ? 'approve' : currentStatus === 'rejected' ? 'approve' : 'reject'} this package?`}
                                    action={changeStatus}
                                    open={openModalConfirmChangeStatus}
                                    handleClose={() => setOpenModalConfirmChangeStatus(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>}
            <ToastContainer />
            {isLoading === false && !packageDetail && <NotFound />}
        </div>
    )
}

export default DetailPackage;