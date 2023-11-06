import { Link} from "react-router-dom";
import { useEffect, useState } from 'react';
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/token/tokenSlice";
import LoadingDialog from "../components/LoadingDialog";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showBtnSave, setShowBtnSave] = useState(false);

    useEffect(() => {
        if(email && password) {
            setShowBtnSave(true);
        }else {
            setShowBtnSave(false);
        }
    }, [email, password]);
    
    const onLogin = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, password: string) => {
        event.preventDefault();
        setIsLoading(true);
        if(email && password) {
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
            
        }else {
            alert("Missing email or password value"); 
            setIsLoading(false);
        }
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    return (
        <div className="login-page bg-white ">
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <section className="">
                <div className="bg-white text-black flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                        <div className="bg-white p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl text-center">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <div className="flex">
                                        <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                        <p className="text-red-500 ml-1">*</p>
                                    </div>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target?.value)} value={email} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required/>
                                </div>
                                <div>
                                    <div className="flex">
                                        <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                        <p className="text-red-500 ml-1">*</p>
                                    </div>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target?.value)} value={password} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                </div>
                                <button disabled={showBtnSave === true ? false : true} onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLogin(event, email, password)} type="submit" className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>Sign in</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to={'/register'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Login;