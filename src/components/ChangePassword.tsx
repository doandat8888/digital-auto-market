import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import LoadingDialog from './LoadingDialog';
import TextInput from './TextInput';
import { ToastContainer, toast } from 'react-toastify';
import userService from '../services/userService';

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showBtnSave, setShowBtnSave] = useState(false);
    const navigate = useNavigate();

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setShowBtnSave(oldPassword !== '' && newPassword !== '');
    }, [oldPassword, newPassword]);

    const onChangePassword = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, oldPassword: string, newPassword: string) => {
        event.preventDefault();
        setIsLoading(true);
        if(oldPassword && newPassword) {
            try {
                await userService.changePassword(oldPassword, newPassword).then(({ status }) => {
                    if(status === 200) {
                        toast.success("Change password success");
                        setIsLoading(false);
                        navigate('/user-profile');
                    }
                })
            } catch (error: any) {
                toast.error(error.response.data.msg);
                setIsLoading(false);
            }
        } else {
            toast.error("Missing email or password value");
            setIsLoading(false);
        }
        
    }

    return (
        <div className="change-password bg-white ">
            <LoadingDialog open={isLoading} closeModal={onCloseModal} />
            <section className="">
                <div className="bg-white text-black flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="bg-white p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl text-center">
                                Reset password
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <TextInput type='password' handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setOldPassword(event.target?.value)}
                                    value={oldPassword} title="Old password" placeholderStr="Enter your old password" />
                                <TextInput type='password' handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPassword(event.target?.value)}
                                    value={newPassword} title="Old password" placeholderStr="Enter your old password" />
                                <button disabled={showBtnSave === true ? false : true}
                                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onChangePassword(event, oldPassword, newPassword)} type="submit"
                                    className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 
                                font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>
                                    Change
                                </button>
                                <button onClick={() => navigate('/login')}
                                    type="submit" className={`w-full text-white bg-gray-400 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg 
                                text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}
                                >
                                    Back
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    )
}

export default ChangePassword
