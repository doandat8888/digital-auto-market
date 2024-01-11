import { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import LoadingDialog from "../components/LoadingDialog";
import TextInput from "./TextInput";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showBtnSave, setShowBtnSave] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setShowBtnSave(email !== '');
    }, [email]);

    const onResetPassword = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string) => {
        event.preventDefault();
        setIsLoading(true);
        if (email) {
            try {
                await userService.resetPassword(email).then(({ status }) => {
                    if (status === 200) {
                        toast.success("Please check your email");
                        setIsLoading(false);
                    }
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error.response.data.msg);
                setIsLoading(false);
            }

        } else {
            toast.error("Missing email or password value");
            setIsLoading(false);
        }
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="login-page bg-white ">
            <LoadingDialog open={isLoading} closeModal={onCloseModal} />
            <section className="">
                <div className="bg-white text-black flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="bg-white p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl text-center">
                                Reset password
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <TextInput handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target?.value)}
                                    value={email} title="Email" placeholderStr="Enter your email" />
                                <button disabled={showBtnSave === true ? false : true}
                                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onResetPassword(event, email)} type="submit"
                                    className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 
                                font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>
                                    Reset
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
export default ForgotPassword;