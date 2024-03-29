import { useCallback, useEffect, useState } from 'react';
import PackageList from '../components/PackageList';
import LoadingDialog from '../components/LoadingDialog';
import packageService from '../services/packageService';
import NoPackage from '../components/NoPackage';
import { Pagination } from '@mui/material';
import _ from 'lodash';
import NotFound from '../components/404NotFound';
import calcTotalPages from '../utils/calcTotalPages';
import SearchBar from '../components/SearchBar';
import userService from '../services/userService';
import StatusSelect from '../components/StatusSelect';
import _const from '../const';

const limit = window.screen.height > 900 ? 12 : 8;

const PackageAdmin = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    // const [packageListByPage, setPackageListByPage] = useState<IGetPackage[]>([]);
    // const [searchValue, setSearchValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    //User info
    const [userRole, setUserRole] = useState<string>();
    const searchVal = localStorage.getItem('name');
    const [currentStatus, setCurrentStatus] = useState<string>("");

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);

    const getTotalPage = useCallback(async () => {
        await packageService.getAllPackageByPageAdmin(limit, currentPage, currentStatus).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setTotal(data.total);
            }
        })
    }, [currentPage, currentStatus]);

    const getAllPackage = useCallback(async () => {
        await packageService.getAllPackageByPageAdmin(limit, currentPage, currentStatus).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            }
        })
    }, [currentPage, currentStatus])

    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    const getPackageByName = useCallback(async (packageName: string) => {
        await packageService.getPackageByNameAdmin(limit, currentPage, packageName, currentStatus).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            } else {
                setPackageList([]);
                setTotalPage(0);
            }
        })
    }, [currentPage, currentStatus]);

    const deb = _.debounce((e) => {
        getPackageByName(e.target.value);
        setCurrentPage(1);
        localStorage.setItem('name', e.target.value);
    }, 1000
    );

    const onSearchHandler = (e: any) => {
        deb(e);
    }

    useEffect(() => {
        const searchVal = localStorage.getItem('name');
        if (searchVal) {
            getPackageByName(searchVal);
        } else {
            getTotalPage();
            getAllPackage();
        }
    }, [currentPage, currentStatus, getAllPackage, getPackageByName, getTotalPage]);

    useEffect(() => {
        if (searchVal) {
            getPackageByName(searchVal);
        }
    }, [currentPage, currentStatus, getPackageByName, searchVal])

    useEffect(() => {
        if (packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList]);

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        getCurrentUser();
    }, [])

    useEffect(() => {
        getAllPackage();
    }, [currentStatus, getAllPackage])


    const getCurrentUser = async () => {
        await userService.getCurrentUser().then(({ status, data }) => {
            if (status === 200) {
                setUserRole(data.role);
            }
        })
    }

    const handleChangeStatus = (status: string) => {
        setCurrentStatus(status);
        setCurrentPage(1);
    }

    return (
        <div>
            {packageList ? <div className={`${isLoading === true ? 'hidden' : ''} pt-[46px]`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal} />
                <div className="body py-4 xl:px-40 lg:px-20 sm:px-10 px-5">
                    <div className="search sm:flex justify-between mb-6 text-black border-gray">
                        <StatusSelect listStatus={_const.statusFake} handleChangeStatus={handleChangeStatus} />
                        <SearchBar widthLg='30%' widthSm='50%' width='100%' placeHolder='Search package name, authors,...' onSearchHandler={onSearchHandler} />
                    </div>
                    {packageList.length > 0 ? <PackageList isAdminPage={true} userRole={userRole} showMode={false} packages={packageList} /> : <NotFound />}
                </div>
                <Pagination className={`w-full flex py-2 bg-white text-white mx-auto justify-center 
                ${total <= limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage} />
            </div> : <NoPackage content="There is no packages in the system" />}
        </div>
    )
}

export default PackageAdmin;