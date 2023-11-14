import { useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingDialog from "../components/LoadingDialog";
import TextInput from "./TextInput";
import { toast, ToastContainer } from 'react-toastify';
import { HiOutlineUserCircle } from "react-icons/hi";
import { useNavigate } from 'react-router';

const UserProfile = () => {
    const [fullName, setFullName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [showBtnSave, setShowBtnSave] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser>();
    const navigate = useNavigate();

    useEffect(() => {
        if(fullName) {
            setShowBtnSave(true);
        }else {
            setShowBtnSave(false);
        }
    }, [fullName]);
    
    const onUpdateUser = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, fullName: string) => {
        setIsLoading(true);
        event.preventDefault();
        try {
            const response = await userService.changeProfile(currentUser ? currentUser?._id : '', fullName);
            if(response && response.status == 200) {
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response.data.msg);
        }
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const getCurrentUser = async() => {
        const response = await userService.getCurrentUser();
        if(response && response.status == 200) {
            setFullName(response.data.fullName);
            setIsLoading(false);
            setCurrentUser(response.data);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div className="login-page bg-white ">
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <section className={`${isLoading == true ? 'hidden' : ''}`}>
                <div className="bg-white text-black flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="bg-white p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div className="profile-img flex justify-center text-[80px]">
                                <HiOutlineUserCircle />
                            </div>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <TextInput handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target?.value)} value={fullName} title="Full name" placeholderStr="Enter your full name" />
                                <button disabled={showBtnSave === true ? false : true} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onUpdateUser(event, fullName)} type="submit" className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    )
}
export default UserProfile;