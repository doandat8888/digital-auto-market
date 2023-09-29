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
    const [user, setUser] = useState<IUser>();
    //Token
    const token = useSelector((state: RootState) => state.token.value);
    const [tokenUser, setTokenUser] = useState<string>("");
    const [packages, setPackages] = useState<IGetPackage[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

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

    const getAllPackage = useCallback(async() => {
        let response = await packageService.getAllPackage();
        if(response && response.data && response.data.data.length > 0) {
            setPackages(response.data.data);
        }
    }, []);

    useEffect(() => {
        getAllPackage();
    }, []);

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

    const getMyPackageList = () => {
        if(user) {
            const packageList = packages.filter((packageItem) => packageItem.createdBy === user._id);
            setMyPackageList(packageList);
            setIsLoading(false);
        }
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const filterMyPackageList = searchValue && myPackageList.length > 0 ? 
    myPackageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.authors[0]?.toLowerCase().includes(searchValue.toLowerCase())) : myPackageList;

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)' onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
                {myPackageList && myPackageList.length > 0 ? 
                    <PackageList packages={filterMyPackageList}/>
                : <NoPackage content="You don't have any packages"/>}
            </div>
        </div>
    )
}

export default MyPackage;