import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import userService from "../services/userService";
import PackageList from "../components/PackageList";
import LoadingDialog from "../components/LoadingDialog";
import { useNavigate } from "react-router";
import packageService from "../services/packageService";
import NoPackage from "../components/NoPackage";
import _ from "lodash";
import { Pagination } from "@mui/material";

const MyPackage = () => {

    const [myPackageList, setMyPackageList] = useState<IPackage[]>([]);
    
    const [user, setUser] = useState<IUser>();
    //Token
    const token = useSelector((state: RootState) => state.token.value);
    const [tokenUser, setTokenUser] = useState<string>("");
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const limit = 8;

    useEffect(() => {
        const localToken = localStorage.getItem('token') || ""
        setTokenUser(localToken);
    }, [])

    useEffect(() => {
        if(tokenUser !== "") {
            getUserInfo();
        }
    }, [tokenUser]);

    useEffect(() => {
        if(user) {
            getMyPackageList();
        }
    }, [user]);

    useEffect(() => {
        if(token === "") {
            navigate('/login');
            setIsLoading(false);
        }
    }, [token, myPackageList]);

    const getTotalPage = async() => {
        const response = await packageService.getMyPackageByPage(limit, currentPage);
        if(response && response.data && response.data.data.length > 0) {
            setTotal(response.data.total);
            console.log("Total my package: ", response.data.total);
        }
    };

    const getMyPackageList = async() => {
        const response = await packageService.getPackageOfCurrentUser(limit, currentPage);
        if(response && response.data && response.data.data.length > 0) {
            const packages: IGetPackage[] = response.data.data.filter((packageItem: IGetPackage) => packageItem.deleted === false);
            setMyPackageList(response.data.data);
            let totalPages = 0;
            if(response.data.total % limit === 0) {
                totalPages = Math.floor(response.data.total / limit);
            }else {
                totalPages = Math.floor(response.data.total / limit) + 1;
            }
            setTotalPage(totalPages);
        }
        setIsLoading(false);
    };
    
    console.log("My packge list: ", myPackageList);

    const getMyPackageByName = async(packageName: string) => {
        const response = await packageService.getMyPackageByName(limit, currentPage, packageName);
        if(response && response.data && response.data.data.length > 0) {
            setMyPackageList(response.data.data);
            let totalPages = 0;
            if(response.data.total % limit === 0) {
                totalPages = Math.floor(response.data.total / limit);
            }else {
                totalPages = Math.floor(response.data.total / limit) + 1;
            }
            setTotalPage(totalPages);
        }
    }

    const deb = _.debounce((e) => {
        getMyPackageByName(e.target.value);
        setCurrentPage(1);
        localStorage.setItem('name', e.target.value);
        }, 1000
    );

    const onSearchHandler = (e: any) => {
        deb(e);
    }

    useEffect(() => {
        const searchVal = localStorage.getItem('name');
        console.log(searchVal);
        if(searchVal) {
            getMyPackageByName(searchVal);
        }else {
            getTotalPage();
            getMyPackageList();
        }
    }, [currentPage]);

    const getUserInfo = async () => {
        if (token !== "") {
            try {
                const response = await userService.getUser();
                if (response && response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onChangePage = (event: any , value: any) => {
        setCurrentPage(value);
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    return (
        <div>
            {myPackageList ? <div className={`${isLoading === true ? 'hidden' : ''}`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
                <div className="body px-6 py-4">
                    <div className="search flex justify-end mb-6">
                        <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search package name, authors,..' onChange={onSearchHandler}/>
                    </div>
                    <PackageList showMode={true} packages={myPackageList}/>
                </div>
                <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total < limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage}/>
            </div> : <NoPackage content="There is no packages in the system"/>}
        </div>
    )
}

export default MyPackage;