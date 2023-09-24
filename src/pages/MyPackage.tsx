import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import userService from "../services/userService";
import PackageList from "../components/PackageList";
import LoadingDialog from "../components/LoadingDialog";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const MyPackage = () => {

    const [myPackageList, setMyPackageList] = useState<IPackage[]>([]);
    const [user, setUser] = useState<IUser>();
    //Token
    const token = useSelector((state: RootState) => state.token.value);
    const [tokenUser, setTokenUser] = useState<string>("");
    const packages = useSelector((state: RootState) => state.packages.value);
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

    const getUserInfo = async () => {
        if (token !== "") {
            console.log("Token header: ", token);
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
            const packageList = packages.filter((packageItem) => packageItem.uid === user._id);
            setMyPackageList(packageList);
            setIsLoading(false);
        }
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const filterMyPackageList = searchValue && myPackageList.length > 0 ? 
    myPackageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.author?.toLowerCase().includes(searchValue.toLowerCase())) : myPackageList;

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)' onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
                {myPackageList && myPackageList.length > 0 ? 
                    <PackageList packages={filterMyPackageList}/>
                : <div className="flex justify-center">
                    <div>You dont have any packages. </div>
                    <Link to={'/addpackage'} className="text-blue-500">Submit your package</Link>
                </div>}
            </div>
        </div>
    )
}

export default MyPackage;