import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import userService from "../services/userService";
import PackageList from "../components/PackageList";
import LoadingDialog from "../components/LoadingDialog";
import { useNavigate } from "react-router";
import packageService from "../services/packageService";
import NoPackage from "../components/NoPackage";

const MyPackage = () => {

    const [myPackageList, setMyPackageList] = useState<IPackage[]>([]);
    const [myPackageListByPage, setMyPackageListByPage] = useState<IGetPackage[]>([]);
    const [user, setUser] = useState<IUser>();
    //Token
    const token = useSelector((state: RootState) => state.token.value);
    const [tokenUser, setTokenUser] = useState<string>("");
    const [packages, setPackages] = useState<IListPackage>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const navigate = useNavigate();

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

    const getMyPackageList = useCallback(async() => {
        let response = await packageService.getPackageOfCurrentUser();
        if(response && response.data && response.data.data.length > 0) {
            let packages: IGetPackage[] = response.data.data.filter((packageItem: IGetPackage) => packageItem.deleted === false);
            setMyPackageList(packages);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        getMyPackageList();
    }, [limit]);

    useEffect(() => {
        if(myPackageList) {
            getMyPackageByPage();
        }
    }, [currentPage]);

    useEffect(() => {
        if(myPackageList) {
            let totalPages = 0;
            if(myPackageList.length === myPackageListByPage.length) {
                if(searchValue) {
                    totalPages = Math.floor(filterMyPackageList.length / limit) + 1;
                }else {
                    totalPages = Math.floor(myPackageList.length / limit) + 1;
                }
            }else {
                if(searchValue) {
                    totalPages = Math.floor(filterMyPackageList.length / limit) + 1;
                }else {
                    totalPages = Math.floor(myPackageList.length / limit) + 1;
                }
            }
            setTotalPage(totalPages);
        }
    }, [myPackageList, searchValue, myPackageListByPage]);

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


    const getMyPackageByPage = async() => {
        let response = await packageService.getMyPackageByPage(limit, currentPage);
        if(response && response.data && response.data.data.length > 0) {
            if(response && response.data && response.data.data.length > 0) {
                let packages: IGetPackage[] = response.data.data.filter((packageItem: IGetPackage) => packageItem.deleted === false);
                setMyPackageListByPage(packages);
            }
        }
    };

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const filterMyPackageList = searchValue && myPackageList.length > 0 ? 
    myPackageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.authors[0]?.toLowerCase().includes(searchValue.toLowerCase())) : myPackageListByPage;

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)' onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
                {myPackageList && myPackageList.length > 0 ? 
                    <PackageList showMode={true} packages={filterMyPackageList}/>
                : <NoPackage content="You don't have any packages"/>}
            </div>
        </div>
    )
}

export default MyPackage;