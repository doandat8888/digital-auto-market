import { useState, useEffect, useCallback } from "react";
import ManageVersionTable from "../components/ManageVersionTable";
import { useNavigate, useParams } from "react-router";
import versionService from "../services/versionService";
import packageService from "../services/packageService";
import LoadingModal from "../components/LoadingDialog";
import userService from "../services/userService";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ModalPublishVersion from "../components/ModalPublishVersion";
import ModalConfirm from "../components/ModalConfirm";
import { Pagination } from "@mui/material";
import calcTotalPages from "../utils/calcTotalPages";

const ManageVersion = () => {
    const [versionList, setVersionList] = useState<IGetVersion[]>([]);
    const [versionDeleteId, setVersionDeleteId] = useState<string>("");
    const [canEdit, setCanEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { packageId } = useParams();
    const [packageDetail, setPackageDetail] = useState<IGetPackage>();
    //User info
    const [tokenUser, setTokenUser] = useState<string>("");
    const [user, setUser] = useState<IUser | null>();
    const limit = window.screen.height > 900 ? 8 : window.screen.height > 1200 ? 8 : 4;
    const [total, setTotal] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    //Open modal publish version
    const [openModalPublish, setOpenModalPublish] = useState<boolean>(false);
    const [openModalConfirmDelete, setopenModalConfirmDelete] = useState(false);

    //Get user info
    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        if (localToken !== "") {
            setIsLoading(true);
            setTokenUser(localToken);
        }
    }, []);

    //Update version
    const [versionUpdate, setVersionUpdate] = useState<IUpdateVersion | undefined>();

    const getUserInfo = async () => {
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

    const checkPackage = useCallback(() => {
        if (user) {
            const canEditVersion = packageDetail && packageDetail.createdBy._id === user?._id ? true : false;
            setCanEdit(canEditVersion);
            setIsLoading(false);
        }
    }, [packageDetail, user])

    const getVersionList = useCallback(async () => {
        if (packageId) {
            await versionService.getVersionByPackageId(packageId, limit, currentPage).then(({ status, data }) => {
                if (status === 200) {
                    setVersionList(data.data);
                    setTotalPage(calcTotalPages(data.total, limit));
                    setTotal(data.total);
                }
            })
        }
    }, [currentPage, limit, packageId])

    const getPackageInfo = useCallback(async () => {
        if (packageId) {
            await packageService.getPackageById(packageId).then(({ data }) => {
                setPackageDetail(data);
            })
        }
    }, [packageId])

    const onUpdateVersion = (version: IGetVersion) => {
        setVersionUpdate(version);
        setOpenModalPublish(true);
    }

    const onDeleteVersion = async (versionId: string) => {
        setopenModalConfirmDelete(true);
        setVersionDeleteId(versionId);
    }

    const removeVersion = async () => {
        if (versionDeleteId) {
            try {
                await versionService.deleteVersion(versionDeleteId).then(({ status }) => {
                    if (status === 200) {
                        alert("Delete version successfully!");
                        setopenModalConfirmDelete(false);
                        getVersionList();
                    }
                })
            } catch (error: any) {
                alert(error.response.data.msg);
                setopenModalConfirmDelete(false);
            }
        }
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleCloseModal = () => {
        setOpenModalPublish(false);
        setVersionUpdate(undefined);
    }

    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    useEffect(() => {
        getPackageInfo();
    }, [getPackageInfo])

    useEffect(() => {
        getVersionList();
    }, [currentPage, getVersionList]);

    useEffect(() => {
        if (tokenUser !== "") {
            getUserInfo();
        }
    }, [tokenUser]);

    useEffect(() => {
        if (user && packageDetail) {
            checkPackage();
        }
    }, [user, packageDetail, checkPackage]);

    return (
        <div className={`${isLoading === true ? 'hidden' : ''} w-[100%] mx-auto text-black pt-[46px]`}>
            <div className="sm:w-[80%] w-[100%] mx-auto">
                <LoadingModal open={isLoading} closeModal={onCloseModal} />
                <div className="title my-10 text-center font-bold text-2xl">RELEASE VERSIONS</div>
                <div className="body mx-6">
                    {canEdit &&
                        <button onClick={() => setOpenModalPublish(true)}
                            className=" my-4 border-none outline-none flex justify-center mr-2 px-4 py-2 text-white items-center cursor-pointer rounded bg-green-400">
                            <AiOutlineCloudUpload /><p className="lg:block text-[12px] lg:ml-2 ml-2">Publish new version</p>
                        </button>}
                    <ManageVersionTable onDeleteVersion={onDeleteVersion} canEdit={canEdit} versionList={versionList} onUpdateVersion={onUpdateVersion} />
                    <div className="h-[90vh]"> <ModalPublishVersion versionUpdate={versionUpdate} refreshData={getVersionList}
                        open={openModalPublish} handleClose={handleCloseModal} packageId={packageId ? packageId : ''} />
                    </div>
                    <ModalConfirm content="Do you want to delete?" action={removeVersion} open={openModalConfirmDelete} handleClose={() => setopenModalConfirmDelete(false)} />
                </div>
            </div>
            <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total < limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage} />
        </div>
    )
}

export default ManageVersion;