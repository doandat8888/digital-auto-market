import { useCallback, useEffect, useState } from "react";
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
import calcTotalPages from "../utils/calcTotalPages";

const limit = window.screen.height > 900 ? 12 : 8;

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
    
    const getTotalPage = useCallback(async () => {
        await packageService.getMyPackageByPageAdmin(limit, currentPage, "").then(({ data }) => {
            if (data && data.data.length > 0) {
                setTotal(data.total);
            }
        })
    }, [currentPage]);

    const getMyPackageList = useCallback(async () => {
        await packageService.getPackageOfCurrentUserAdmin(limit, currentPage, "").then(({ data }) => {
            if (data && data.data.length > 0) {
                //const packages: IGetPackage[] = response.data.data.filter((packageItem: IGetPackage) => packageItem.deleted === false);
                setMyPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            }
            setIsLoading(false);
        })
    }, [currentPage]);

    const getMyPackageByName = useCallback(async (packageName: string) => {
        await packageService.getMyPackageByNameAdmin(limit, currentPage, packageName, "").then(({ data }) => {
            if (data.data.length > 0) {
                setMyPackageList(data.data);
                setTotalPage(calcTotalPages(data.total, limit));
            } else {
                setMyPackageList([]);
                setTotalPage(0);
            }
        })
    }, [currentPage]) 

    useEffect(() => {
        const localToken = localStorage.getItem('token') || "";
        setTokenUser(localToken);
    }, []);

    const getUserInfo = useCallback(async () => {
        if (token !== "") {
            try {
                await userService.getUser().then(({ status, data }) => {
                    if (status === 200) {
                        setUser(data);
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    }, [token]) 

    useEffect(() => {
        if (tokenUser !== "") {
            getUserInfo();
        }
    }, [getUserInfo, tokenUser]);

    useEffect(() => {
        if (user) {
            getMyPackageList();
        }
    }, [getMyPackageList, user]);

    useEffect(() => {
        if (token === "") {
            navigate('/login');
            setIsLoading(false);
        }
    }, [token, myPackageList, navigate]);


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
        if (searchVal) {
            getMyPackageByName(searchVal);
        } else {
            getTotalPage();
            getMyPackageList();
        }
    }, [currentPage, getMyPackageByName, getMyPackageList, getTotalPage]);


    const onChangePage = (event: any, value: any) => {
        setCurrentPage(value);
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div>
            {myPackageList ? <div className={`${isLoading === true ? 'hidden' : ''} pt-[46px]`}>
                <LoadingDialog open={isLoading} closeModal={onCloseModal} />
                <div className="body px-6 py-4">
                    <div className="search flex justify-end mb-6 text-black border-gray">
                        <input className='bg-white text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]'
                            type="text" placeholder='Search package name, authors,..' onChange={onSearchHandler} />
                    </div>
                    {myPackageList.length > 0 ? <PackageList showMode={false} packages={myPackageList} /> : localStorage.getItem('name') ? '' :
                        <NoPackage content="You don't have any packages" />}

                </div>
                <Pagination className={`w-full flex fixed bottom-0 py-2 bg-white text-white mx-auto justify-center ${total <= limit ? 'hidden' : ''}`} count={totalPage} onChange={onChangePage} />
            </div> : <NoPackage content="There is no packages in the system" />}
        </div>
    )
}

export default MyPackage;