import { useState, useEffect } from "react";
import packageService from "../services/packageService";
import LoadingModal from "../components/LoadingDialog";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import ManageAddPackageTable from "../components/ManageAddPackageTable";
import ModalConfirm from "../components/ModalConfirm";
import calcTotalPages from "../utils/calcTotalPages";
import SearchBar from "../components/SearchBar";
import _ from "lodash";

const ManageAddPackage = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const searchVal = localStorage.getItem('namePackage');

    const [openModalConfirm, setOpenModalConfirm] = useState(false);

    //Status package
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentPackageId, setCurrentPackageId] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = window.screen.height > 900 ? 8 : window.screen.height > 1200 ? 8 : 4;

    const getTotalPage = async () => {
        await packageService.getAllPackageByPage(limit, currentPage).then(({ data }) => {
            if (data && data.data.length > 0) {
                setTotal(data.total);
            }
        })
    };

    const getAllPackage = async () => {
        try {
            await packageService.getAllPackageByPage(limit, currentPage).then(({ data }) => {
                if (data && data.data.length > 0) {
                    setPackageList(data.data);
                    setTotalPage(calcTotalPages(data.total, limit));
                }
            })
        } catch (error) {
            toast.error("Fail to load packages");
        }
    }

    const handleChangeStatus = (packageId: string, state: string) => {
        setOpenModalConfirm(true);
        setCurrentStatus(state);
        setCurrentPackageId(packageId);
    }

    const changeStatus = async () => {
        try {
            const response = await packageService.changeStatus(currentPackageId, currentStatus);
            if (response && response.status === 200) {
                setOpenModalConfirm(false);
                toast.success(response.data.msg);
                getAllPackage();
                setCurrentPackageId("");
                setCurrentStatus("");
            }
        } catch (error) {
            toast.error("Fail to change status");
            setCurrentPackageId("");
            setCurrentStatus("");
        }
    }

    useEffect(() => {
        if (packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList]);

    useEffect(() => {
        const searchVal = localStorage.getItem('namePackage');
        if (searchVal) {
            getPackageByName(searchVal);
        } else {
            getTotalPage();
            getAllPackage();
        }
    }, [currentPage]);

    useEffect(() => {
        if (searchVal) {
            getPackageByName(searchVal);
        }
    }, [currentPage])




    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    const onSearchHandler = (e: any) => {
        deb(e);
    }

    const deb = _.debounce((e) => {
        getPackageByName(e.target.value);
        setCurrentPage(1);
        localStorage.setItem('namePackage', e.target.value);
    }, 1000
    );

    const getPackageByName = async (packageName: string) => {
        await packageService.getPackageByName(limit, currentPage, packageName).then(({ data }) => {
            if (data && data.data.length > 0) {
                setPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            } else {
                setPackageList([]);
                setTotalPage(0);
            }
        })
    };

    return (
        <div className={`${isLoading === true ? 'hidden' : ''} w-[100%] mx-auto text-black select-none pt-[46px]`}>
            <div className="sm:w-[90%] w-[100%] mx-auto">
                <LoadingModal open={isLoading} closeModal={() => setIsLoading(false)} />
                <div className="text-black title my-10 text-center font-bold text-2xl">MANAGE PACKAGE STATUS</div>
                <div className="ml-6 search flex justify-start mb-6 text-black border-gray">
                    <SearchBar widthLg="40%" widthSm="100%" width="100%" placeHolder='Search package name...' onSearchHandler={onSearchHandler} />
                </div>
                <div className="body mx-6">
                    <ManageAddPackageTable packageList={packageList} handleChangeStatus={handleChangeStatus} />
                </div>
                <ModalConfirm content={`Do you want to ${currentStatus === 'approved' ? 'reject' : 'approve'} this package?`} action={changeStatus}
                    open={openModalConfirm} handleClose={() => setOpenModalConfirm(false)} />
            </div>
            <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total < limit ? 'hidden' : ''}`}
                count={totalPage} onChange={onChangePage} />
            <ToastContainer />
        </div>

    )
}

export default ManageAddPackage;