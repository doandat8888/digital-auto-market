import { Link} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/token/tokenSlice";
import LoadingDialog from "../components/LoadingDialog";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showBtnSave, setShowBtnSave] = useState(false);
    const [passwordRetype, setPasswordRetype] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [fullName, setFullName] = useState("");
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        if(email && password && passwordMatch === true && agree == true) {
            setShowBtnSave(true);
        }else {
            setShowBtnSave(false);
        }
    }, [email, password, passwordMatch, agree]);
    
    const onLogin = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, password: string) => {
        event.preventDefault();
        setIsLoading(true);
        if(email && password) {
            try {
                const response = await userService.register(email, password, fullName);
                if(response && response.status === 201) {
                    try {
                        const response = await userService.login(email, password);
                        if(response && response.status === 200) {
                            if(response.data.token) {
                                dispatch(addToken(response.data.token));
                                setIsLoading(false);
                                window.location.href = import.meta.env.VITE_APP_URL;
                            }else {
                                alert("Token not found");
                            }
                        }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        alert(error.response.data.msg);
                        setIsLoading(false);
                    }
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error);
                alert(error.response.data.errors[0].msg);
                setIsLoading(false);
            }
            
        }else {
            alert("Missing email or password value"); 
            setIsLoading(false);
        }
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const onRetypePassword = (passwordStr: string) => {
        setPasswordRetype(passwordStr);
        if(passwordStr === password) {
            setPasswordMatch(true);
        }else {
            setPasswordMatch(false);
        }
    }

    return (
        <div className="login-page">
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <section className="bg-gray-50 dark:bg-gray-900 ">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white shadow-lg rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign up new account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <div className="flex">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <p className="text-red-500 ml-1">*</p>
                                    </div>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target?.value)} value={email} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required/>
                                </div>
                                <div>
                                    <div className="flex">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full name</label>
                                    </div>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target?.value)} value={fullName} type="text" name="fullName" id="fullName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your full name" required/>
                                </div>
                                <div>
                                    <div className="flex">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <p className="text-red-500 ml-1">*</p>
                                    </div>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target?.value)} value={password} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div>
                                    <div className="flex">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                        <p className="text-red-500 ml-1">*</p>
                                    </div>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => onRetypePassword(event.target.value)} value={passwordRetype} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                    <p className={`text-red-500 text-[12px] mt-2 ${!passwordMatch && passwordRetype ? '' : 'hidden'}`}>Password does not match</p>
                                </div>
                                <div className="flex">
                                    <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)}/>
                                    <p className="ml-2 text-sm">I agree to the <a href="#">Terms and Conditions</a></p>
                                </div>
                                <button disabled={showBtnSave === true ? false : true} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLogin(event, email, password)} type="submit" className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>Sign up</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already had an account? <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register;