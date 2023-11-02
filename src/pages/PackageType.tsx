import { useEffect, useState } from "react";
import packageService from "../services/packageService";
import LoadingDialog from "../components/LoadingDialog";
import PackageList from "../components/PackageList";
import { Pagination } from "@mui/material";
import NoPackage from "../components/NoPackage";
import { useParams } from "react-router";
import _ from "lodash";

const PackageType = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = 8;
    //params
    const { type } = useParams();

    const getAllPackage = async () => {
        const response = await packageService.getPackageByCategory(limit, currentPage, type ? type : '');
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
            let totalPages = 0;
            setTotal(response.data.total);
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

    const getPackageByCategoryAndName = async(packageName: string) => {
        const response = await packageService.getPackageByCategoryAndName(limit, currentPage, packageName, type ? type : '');
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
            let totalPages = 0;
            setTotal(response.data.total);
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
    }

    useEffect(() => {
        const searchVal = localStorage.getItem('name');
        if(searchVal) {
            getPackageByCategoryAndName(searchVal);
        }else {
            getAllPackage();
        }
    }, [currentPage, type]);

    useEffect(() => {
        setCurrentPage(1);
    }, [type]);

    useEffect(() => {
        if(packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList, type]);

    const deb = _.debounce((e) => {
        getPackageByCategoryAndName(e.target.value);
        setCurrentPage(1);
        localStorage.setItem('name', e.target.value);
        }, 1000
    );

    const onSearchHandler = (e: any) => {
        deb(e);
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    return (
        <div>
            {packageList ? <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
                <div className="body px-6 py-4">
                    <div className="search flex justify-end mb-6">
                        <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search package name, authors,..' onChange={onSearchHandler}/>
                    </div>
                    <PackageList showMode={false} packages={packageList}/>
                </div>
                <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total < limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage}/>
            </div> : <NoPackage content="There is no packages in the system"/>}
        </div>
    )
}

export default PackageType;