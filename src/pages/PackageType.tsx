import { useEffect, useState } from "react";
import packageService from "../services/packageService";
import LoadingDialog from "../components/LoadingDialog";
import PackageList from "../components/PackageList";
import { Pagination } from "@mui/material";
import NoPackage from "../components/NoPackage";
import { useParams } from "react-router";

const PackageType = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    const [packageListByPage, setPackageListByPage] = useState<IGetPackage[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = 8;
    //params
    const { type } = useParams();

    const getAllPackageByPage = async() => {
        try {
            let response = await packageService.getPackageTypeByPage(type ? type : '', limit, currentPage);
            if(response && response.data && response.data.data.length > 0) {
                setPackageListByPage(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
        
    };

    const getAllPackage = async () => {
        let response = await packageService.getPackageByCategory(type ? type : '');
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
            console.log(response.data.data);
        }
    }

    const onChangePage = (event: any , value: any) => {
        setCurrentPage(value);
    }

    const filterPackageList = searchValue && packageList.length > 0 ? 
    packageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.authors[0]?.toLowerCase().includes(searchValue.toLowerCase())) : packageListByPage;

    useEffect(() => {
        getAllPackage();
    }, [limit, type])

    useEffect(() => {
        if(packageList) {
            getAllPackageByPage();
        }
    }, [currentPage, type]);


    useEffect(() => {
        if(packageList) {
            let totalPages = 0;
            if(filterPackageList.length === packageListByPage.length) {
                if(searchValue) {
                    totalPages = Math.floor(filterPackageList.length / limit) + 1;
                    
                }else {
                    totalPages = Math.floor(packageList.length / limit) + 1;
                }
            }else {
                if(searchValue) {
                    totalPages = Math.floor(filterPackageList.length / limit) + 1;
                }else {
                    totalPages = Math.floor(packageList.length / limit) + 1;
                }
            }
            setTotalPage(totalPages);
        }
    }, [packageList, searchValue, packageListByPage, type]);

    useEffect(() => {
        if(packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList, type])

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
                    <PackageList showMode={false} packages={filterPackageList}/>
                </div>
                <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${packageList.length < limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage}/>
            </div> : <NoPackage content="There is no packages in the system"/>}
        </div>
    )
}

export default PackageType;