import _constant from "../const";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GrMenu } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeToken } from "../redux/token/tokenSlice";
import UserInfo from "./UserInfo";

const Header = () => {
    const pageList: IPage[] = _constant.pageList;
    const pathName = useLocation().pathname;
    const indexActive = _constant.pageList.findIndex(pageItem => pageItem.path === pathName);
    const [showPageList, setShowPageList] = useState<boolean>(false);
    const [tokenUser, setTokenUser] = useState<string>("");
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement | null>(null);
    
    //User info
    const [user, setUser] = useState<IUser | null>();

    const [isLoading, setIsLoading] = useState(true);

    //navigate 
    const navigate = useNavigate();

    const [showMenuUser, setShowMenuUser] = useState(false);

    useEffect(() => {
        const localToken = localStorage.getItem('token') || ""
        setTokenUser(localToken);
    }, [])

    useEffect(() => {
        if(tokenUser === "") {
            setIsLoading(false);

        }else if(tokenUser !== "") {
            console.log("token header: ", tokenUser)
            getUserInfo();
        }
    }, [tokenUser])

    useEffect(() => {
        if(user) {
            setIsLoading(false);
        }
    }, [user]);

    const getUserInfo = async () => {
        try {
            const response = await userService.getUser();
            if (response && response.status === 200) {
                setUser(response.data);
                if(user) {
                    setIsLoading(false);
                }
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOnClick = () => {
        if(user) {
            setShowMenuUser(!showMenuUser);
        }else {
            navigate('/login');
        }
    }

    console.log(user);

    const onLogout = () => {
        setIsLoading(true);
        setUser(null);
        dispatch(removeToken());
        setIsLoading(false);
        setTokenUser("");
        navigate('/login');
    }

    const toggleBox = () => {
        setShowMenuUser(!showMenuUser);
    };

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <div className="h-12 px-2 border-b-2 flex items-center lg:text-lg sm:text-sm text-base ">
                <Link to={"/"} className="lg:text-2xl sm:text-sm text-base justify-start font-bold cursor-pointer select-none bg-gradient-to-r from-[#005072] to-[#a2b039] bg-clip-text text-transparent " >
                    digital store
                </Link>
                <div className="flex items-center mx-4 h-full">
                    {pageList && pageList.length > 0 && pageList.map((page: IPage, index: number) => (
                        <Link className={`hidden text-[16px] custom-link h-full md:flex items-center mx-2 px-2 cursor-pointer page-item ${indexActive === index ? ' border-b-2 border-b-black font-bold' : ''}`} to={page.path}>{page.name}</Link>
                    ))}
                </div>
                <div className="grow"></div>
                <Link to={user ? "/addpackage" : '/login'} className={`${!user ? 'hidden' : ''} sm:mr-2 mr-1 border-none outline-none text-blue-700 px-2 h-full flex items-center hover:opacity-80 cursor-pointer font-semibold`}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="mr-2 animate-bounce" height="26" width="26" xmlns="http://www.w3.org/2000/svg"><path d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z"></path></svg><span className="hidden md:block">Add new package</span></Link>
                <div ref={ref} onClick={handleOnClick} className="relative h-full flex items-center cursor-pointer hover:opacity-70 font-semibold text-[14px]">
                    <div className="flex items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="mr-2" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg></div>
                    {showMenuUser && user && <UserInfo user={user} triggerRef={ref.current} onClose={toggleBox} onLogout={onLogout}/>}
                </div>
                <div className="md:hidden cursor-pointer hover:opacity-70" onClick={() => setShowPageList(!showPageList)}><GrMenu /></div>
            </div>
            <div className={`${showPageList === false ? "hidden" : ""} md:hidden`}>
                {pageList && pageList.length > 0 && pageList.map((page: IPage) => (
                    page.name === "My package" ? 
                    <Link className={`${!user ? 'hidden' : ''} w-full flex px-2 custom-link h-full items-center py-3 cursor-pointer page-item border bg-white hover:opacity-70`} to={page.path}>{page.name}</Link>
                    : <Link className={`w-full flex px-2 custom-link h-full items-center py-3 cursor-pointer page-item border bg-white hover:opacity-70`} to={page.path}>{page.name}</Link>
                    ))}
            </div>
        </div>
    )
}

export default Header;