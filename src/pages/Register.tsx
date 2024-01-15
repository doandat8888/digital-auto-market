import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/token/tokenSlice";
import LoadingDialog from "../components/LoadingDialog";
import isValidEmail from "../utils/validEmail";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";

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

    const handleRegister = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, password: string) => {
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
                                        window.location.href = '/' || "https://store.digitalauto.asia/";
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
                            <TextInput
                                value={email} type="email"
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => { setValidEmail(isValidEmail(email)); setEmail(event.target?.value) }}
                                placeholderStr="Enter your email"
                                title="Email"
                            />
                            <p className={`text-red-500 text-[12px] mt-2 ${!validEmail && email ? '' : 'hidden'}`}>Invalid email</p>
                        </div>
                        <div>
                            <TextInput
                                value={fullName}
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => { setFullName(event.target.value) }}
                                placeholderStr="Enter your full name"
                                title="Full name"
                                required={false}
                            />
                        </div>
                        <div>
                            <TextInput
                                value={password}
                                type="password"
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value) }}
                                placeholderStr="Enter password"
                                title="Password"
                            />
                        </div>
                        <div>
                            <TextInput
                                title="Confirm password"
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => onRetypePassword(event.target.value)}
                                placeholderStr="Retype your password"
                                value={passwordRetype}
                                type="password"
                            />
                            <p className={`text-red-500 text-[12px] mt-2 ${!passwordMatch && passwordRetype ? '' : 'hidden'}`}>Password does not match</p>
                        </div>
                        <div className="flex">
                            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                            <p className="ml-2 text-sm">I agree to the <a href="#">Terms and Conditions</a></p>
                        </div>
                        <CustomButton
                            type="submit"
                            title="Sign up"
                            disabled={showBtnSave === true ? false : true}
                            onClickBtn={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleRegister(event, email, password)}
                        />
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