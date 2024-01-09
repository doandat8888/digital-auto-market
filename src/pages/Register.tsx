import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/token/tokenSlice";
import LoadingDialog from "../components/LoadingDialog";
import isValidEmail from "../utils/validEmail";

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
    const [validEmail, setValidEmail] = useState(false);

    useEffect(() => {
        setShowBtnSave(email !== '' && password !== '' && passwordMatch && agree);
    }, [email, password, passwordMatch, agree]);

    const onLogin = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, password: string) => {
        event.preventDefault();
        setIsLoading(true);
        if (email && password) {
            try {
                await userService.register(email, password, fullName).then(async ({ status }) => {
                    if (status === 201) {
                        try {
                            await userService.login(email, password).then(({ status, data }) => {
                                if (status === 200) {
                                    if (data.token) {
                                        dispatch(addToken(data.token));
                                        setIsLoading(false);
                                        window.location.href = import.meta.env.VITE_APP_URL || "https://store.digitalauto.asia/";
                                    } else {
                                        alert("Token not found");
                                    }
                                }
                            })
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (error: any) {
                            alert(error.response.data.msg);
                            setIsLoading(false);
                        }
                    }
                })

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error);
                alert(error.response.data.errors[0].msg);
                setIsLoading(false);
            }
        } else {
            alert("Missing email or password value");
            setIsLoading(false);
        }
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    const onRetypePassword = (passwordStr: string) => {
        setPasswordRetype(passwordStr);
        setPasswordMatch(passwordStr === password);
    }

    return (
        <div className="text-black pt-[92px] pb-[46px]">
            <div className="w-full grid place-items-center">
                <div className="max-w-[400px] w-[94%] p-6 rounded shadow-sm bg-white text-black">
                    <LoadingDialog open={isLoading} closeModal={onCloseModal} />
                    <h1 className="text-xl text-center font-bold leading-tight tracking-tight md:text-2xl">
                        Sign up new account
                    </h1>
                    <form className="space-y-4 md:space-y-6 mt-4" action="#">
                        <div>
                            <div className="flex">
                                <label className="block mb-2 text-sm font-medium">Email</label>
                                <p className="text-red-500 ml-1">*</p>
                            </div>
                            <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setValidEmail(isValidEmail(email)); setEmail(event.target?.value)}} value={email} type="email" name="email" id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required />
                            <p className={`text-red-500 text-[12px] mt-2 ${!validEmail && email ? '' : 'hidden'}`}>Invalid email</p>
                        </div>
                        <div>
                            <div className="flex">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
                            </div>
                            <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target?.value)} value={fullName} type="text" name="fullName" id="fullName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Your full name" required />
                        </div>
                        <div>
                            <div className="flex">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <p className="text-red-500 ml-1">*</p>
                            </div>
                            <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target?.value)} value={password} type="password" name="password" id="password" placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                        </div>
                        <div>
                            <div className="flex">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                                <p className="text-red-500 ml-1">*</p>
                            </div>
                            <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => onRetypePassword(event.target.value)} value={passwordRetype} type="password" name="password" id="password" placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                            <p className={`text-red-500 text-[12px] mt-2 ${!passwordMatch && passwordRetype ? '' : 'hidden'}`}>Password does not match</p>
                        </div>
                        <div className="flex">
                            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                            <p className="ml-2 text-sm">I agree to the <a href="#">Terms and Conditions</a></p>
                        </div>
                        <button disabled={showBtnSave === true ? false : true} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLogin(event, email, password)} type="submit"
                            className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50`}>Sign up</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already had an account? <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                        </p>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default Register;