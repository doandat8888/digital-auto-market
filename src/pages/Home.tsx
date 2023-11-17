import { useEffect, useState } from 'react';
import PackageList from '../components/PackageList';
import LoadingDialog from '../components/LoadingDialog';
import packageService from '../services/packageService';
import NoPackage from '../components/NoPackage';
import { Pagination } from '@mui/material';
import _ from 'lodash';
import NotFound from '../components/404NotFound';

const Home = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    // const [packageListByPage, setPackageListByPage] = useState<IGetPackage[]>([]);
    // const [searchValue, setSearchValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    //User info
    const [user, setUser] = useState<IUser | null>();
    const searchVal = localStorage.getItem('name');

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = 8;

    const getTotalPage = async() => {
        const response = await packageService.getAllPackageByPage(limit, currentPage);
        if(response && response.data && response.data.data.length > 0) {
            setTotal(response.data.total);
        }
    };

    const getAllPackage = async () => {
        const response = await packageService.getAllPackageByPage(limit, currentPage);
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
            let totalPages = 0;
            if(response.data.total % limit === 0) {
                totalPages = Math.floor(response.data.total / limit);
            }else {
                totalPages = Math.floor(response.data.total / limit) + 1;
            }
            setTotalPage(totalPages);
        }
    }

    const onChangePage = (event: any , value: any) => {
        setCurrentPage(value);
    }

    const getPackageByName = async(packageName: string) => {
        const response = await packageService.getPackageByName(limit, currentPage, packageName);
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
            let totalPages = 0;
            if(response.data.total % limit === 0) {
                totalPages = Math.floor(response.data.total / limit);
            }else {
                totalPages = Math.floor(response.data.total / limit) + 1;
            }
            setTotalPage(totalPages);
        }else {
            setPackageList([]);
            setTotalPage(0);
        }
    };

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
        if(searchVal) {
            getPackageByName(searchVal);
        }else {
            getTotalPage();
            getAllPackage();
        }
    }, [currentPage]);

    useEffect(() => {
        console.log(currentPage);
        if(searchVal) {
            getPackageByName(searchVal);
        }
    }, [currentPage])

    useEffect(() => {
        if(packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList]);

    const onCloseModal= () => {
        setIsLoading(false);
    }


    return (
        <div>
            {packageList ? <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
                <div className="body px-6 py-4">
                    <div className="search flex justify-end mb-6 text-black border-gray">
                        <input className='bg-white text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search package name, authors,..' onChange={onSearchHandler}/>
                    </div>
                    {packageList.length > 0 ? <PackageList showMode={false} packages={packageList}/> : <NotFound />}
                    
                </div>
                <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total < limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage}/>
            </div> : <NoPackage content="There is no packages in the system"/>}
        </div>
    )
}

export default Home;