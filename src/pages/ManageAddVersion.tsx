import { useState, useEffect, useCallback } from "react";
import LoadingModal from "../components/LoadingDialog";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import ModalConfirm from "../components/ModalConfirm";
import calcTotalPages from "../utils/calcTotalPages";
import SearchBar from "../components/SearchBar";
import _ from "lodash";
import versionService from "../services/versionService";
import ManageAddVersionTable from "../components/ManageAddVersionTable";

const ManageAddVersion = () => {

    const [versionList, setVersionList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const searchVal = localStorage.getItem('nameVersion');

    const [openModalConfirm, setOpenModalConfirm] = useState(false);

    //Status package
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentPackageId, setCurrentPackageId] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = window.screen.height > 900 ? 8 : window.screen.height > 1200 ? 8 : 4;

    const getTotalPage = useCallback(async () => {
        await versionService.getAllVersion(limit, currentPage).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setTotal(data.total);
            }
        })
    }, [currentPage, limit]);

    const getAllVersion = useCallback(async () => {
        try {
            await versionService.getAllVersion(limit, currentPage).then(({ data }) => {
                if (data && data.data && data.data.length > 0) {
                    setVersionList(data.data);
                    setTotalPage(calcTotalPages(data.total, limit));
                }
            })
        } catch (error) {
            toast.error("Fail to load packages");
        }
    }, [currentPage, limit])

    const getPackageByName = useCallback(async (versionName: string) => {
        await versionService.getVersionByName(limit, currentPage, versionName).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setVersionList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            } else {
                setVersionList([]);
                setTotalPage(0);
            }
        })
    }, [currentPage, limit]);

    const handleChangeStatus = (packageId: string, state: string) => {
        setOpenModalConfirm(true);
        setCurrentStatus(state);
        setCurrentPackageId(packageId);
    }

    const changeStatus = async () => {
        try {
            const response = await versionService.changeStatus(currentPackageId, currentStatus);
            if (response && response.status === 200) {
                setOpenModalConfirm(false);
                toast.success(response.data.msg);
                getAllVersion();
                setCurrentPackageId("");
                setCurrentStatus("");
            }
        } catch (error) {
            setOpenModalConfirm(false);
            toast.error("Fail to change status");
            setCurrentPackageId("");
            setCurrentStatus("");
        }
    }


    useEffect(() => {
        if (versionList.length > 0) {
            setIsLoading(false);
        }
    }, [versionList]);

    useEffect(() => {
        const searchVal = localStorage.getItem('nameVersion');
        if (searchVal) {
            getPackageByName(searchVal);
        } else {
            getTotalPage();
            getAllVersion();
        }
    }, [currentPage, getAllVersion, getPackageByName, getTotalPage]);

    useEffect(() => {
        if (searchVal) {
            getPackageByName(searchVal);
        }
    }, [currentPage, getPackageByName, searchVal])

    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    const onSearchHandler = (e: any) => {
        deb(e);
    }

    const deb = _.debounce((e) => {
        getPackageByName(e.target.value);
        localStorage.setItem('nameVersion', e.target.value);
    }, 1000
    );


    return (
        <div className={`${isLoading === true ? 'hidden' : ''} w-[100%] mx-auto text-black select-none pt-[46px]`}>
            <div className="sm:w-[90%] w-[100%] mx-auto">
                <LoadingModal open={isLoading} closeModal={() => setIsLoading(false)} />
                <div className="text-black title mt-10 my-5 text-center font-bold text-2xl">MANAGE VERSION STATUS</div>
                <div className="ml-6 search flex justify-start mb-6 text-black border-gray">
                    <SearchBar widthLg="40%" widthSm="100%" width="100%" placeHolder='Search version name...' onSearchHandler={onSearchHandler} />
                </div>
                <div className="body mx-6">
                    <ManageAddVersionTable versionList={versionList} handleChangeStatus={handleChangeStatus} />
                </div>
                <ModalConfirm content={`Do you want to ${currentStatus === 'approved' ? 'reject' : 'approve'} this version?`} action={changeStatus}
                    open={openModalConfirm} handleClose={() => setOpenModalConfirm(false)} />
            </div>
            <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total < limit ? 'hidden' : ''}`}
                count={totalPage} onChange={onChangePage} />
            <ToastContainer />
        </div>
    )
}

export default ManageAddVersion;