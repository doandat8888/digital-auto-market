import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/token/tokenSlice";
import LoadingDialog from "../components/LoadingDialog";
import isValidEmail from "../utils/validEmail";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showBtnSave, setShowBtnSave] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    useEffect(() => {
        setShowBtnSave(!!(email && password));
    }, [email, password]);

    const onLogin = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, password: string) => {
        event.preventDefault();
        setIsLoading(true);

        if (email && password) {
            try {
                await userService.login(email, password).then(({ status, data }) => {
                    if (status === 200) {
                        if (data.token) {
                            dispatch(addToken(data.token));
                            setIsLoading(false);
                            window.location.href = '/' || "https://store.digitalauto.tech/";
                        } else {
                            alert("Token not found");
                        }
                    }
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                alert(error.response.data.msg);
            }
        } else {
            alert("Missing email or password value");
        }
        setIsLoading(false);
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="login-page text-black pt-[46px]">
            <div className="w-full h-[90vh] grid place-items-center">
                <div className="max-w-[400px] w-[94%] bg-white p-6 rounded shadow-sm">
                    <LoadingDialog open={isLoading} closeModal={onCloseModal} />
                    <h1 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl text-center text-gray-600">
                        Sign in
                    </h1>
                    <form className="space-y-4 md:space-y-6 mt-6" action="#">
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
                                value={password}
                                type="password"
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value) }}
                                placeholderStr="Enter password"
                                title="Password"
                            />
                        </div>
                        <CustomButton
                            type="submit"
                            title="Sign in"
                            disabled={showBtnSave === true ? false : true}
                            onClickBtn={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLogin(event, email, password)}
                        />
                        <div className="flex justify-between">
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet?
                                <Link to={'/register'} className="ml-1 font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Register</Link>
                            </p>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                <Link to={'/forgot-password'}
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Forgot password</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login;