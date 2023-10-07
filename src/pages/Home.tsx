import { useEffect, useState } from 'react';
import PackageList from '../components/PackageList';
import LoadingDialog from '../components/LoadingDialog';
import packageService from '../services/packageService';
import NoPackage from '../components/NoPackage';
import { Pagination } from '@mui/material';

const Home = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    const [packageListByPage, setPackageListByPage] = useState<IGetPackage[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    //User info
    const [user, setUser] = useState<IUser | null>();

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = 6;

    const getAllPackageByPage = async() => {
        let response = await packageService.getAllPackageByPage(limit, currentPage);
        if(response && response.data && response.data.data.length > 0) {
            setPackageListByPage(response.data.data);
        }
    };

    const getAllPackage = async () => {
        let response = await packageService.getAllPackage();
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
        }
    }

    const onChangePage = (event: any , value: any) => {
        setCurrentPage(value);
    }

    const filterPackageList = searchValue && packageList.length > 0 ? 
    packageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.authors[0]?.toLowerCase().includes(searchValue.toLowerCase())) : packageListByPage;

    useEffect(() => {
        getAllPackage();
    }, [limit])

    useEffect(() => {
        if(packageList) {
            getAllPackageByPage();
        }
    }, [currentPage]);


    useEffect(() => {
        if(packageList) {
            const totalPages = Math.floor(filterPackageList.length / limit) + 1;
            setTotalPage(totalPages);
        }
    }, [packageList, searchValue]);

    useEffect(() => {
        if(packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList])

    const onCloseModal= () => {
        setIsLoading(false);
    }

    return (
        <div>
            {packageList ? <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
                <div className="body px-6 py-4">
                    <div className="search flex justify-end mb-6">
                        <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search package name, authors,..' onChange={(e) => setSearchValue(e.target.value)}/>
                    </div>
                    <PackageList packages={filterPackageList}/>
                </div>
                <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${packageList.length < limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage}/>
            </div> : <NoPackage content="There is no packages in the system"/>}
        </div>
        
    )
}

export default Home;