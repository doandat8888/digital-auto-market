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

const limit = window.screen.height > 900 ? 12 : 8;

const Home = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    //User info
    const [userRole, setUserRole] = useState<string>();
    const searchVal = localStorage.getItem('name');

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);

    const getTotalPage = useCallback(async () => {
        await packageService.getAllPackageByPage(limit, currentPage).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setTotal(data.total);
            }
        })
    }, [currentPage])

    const getAllPackage = useCallback(async () => {
        await packageService.getAllPackageByPage(limit, currentPage).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            }
        })
    }, [currentPage])

    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    const getPackageByName = useCallback(async (packageName: string) => {
        await packageService.getPackageByName(limit, currentPage, packageName).then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            } else {
                setPackageList([]);
                setTotalPage(0);
            }
        })
    }, [currentPage]);

    const deb = _.debounce((e) => {
        getPackageByName(e.target.value);
        setCurrentPage(1);
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
    }, [currentPage, getAllPackage, getPackageByName, getTotalPage]);

    useEffect(() => {
        if (searchVal) {
            getPackageByName(searchVal);
        }
    }, [currentPage, getPackageByName, searchVal]);

    useEffect(() => {
        if (packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList]);

    const onCloseModal = () => {
        setIsLoading(false);
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    const getCurrentUser = async () => {
        await userService.getCurrentUser().then(({ status, data }) => {
            if (status === 200) {
                setUserRole(data.role);
            }
        })
    }

    return (
        <div>
            {packageList ? <div className={`${isLoading === true ? 'hidden' : ''} pt-[46px]`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal} />
                <div className="body px-6 py-4">
                    <div className="search flex justify-end mb-6 text-black border-gray">
                        <SearchBar
                            widthLg='30%' widthSm='100%' width='100%'
                            placeHolder='Search package name, authors,...'
                            onSearchHandler={onSearchHandler}
                        />
                    </div>
                    {packageList.length > 0 ? <PackageList userRole={userRole} showMode={false} packages={packageList} />
                        : <NotFound
                            imgSrc='https://cdn1.iconfinder.com/data/icons/logistic-and-delivery-outline/512/package_delivery_fail_mistake_wrong_problems_logistic_shipping_box_business_cross-512.png'
                            content={`There's no package with name "${searchVal}" found in our system`}
                        />
                    }
                </div>
                <Pagination
                    className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total <= limit ? 'hidden' : ''}`}
                    count={totalPage} onChange={onChangePage} 
                />
            </div> : <NoPackage content="There is no packages in the system" />}
        </div>
    )
}

export default Home;