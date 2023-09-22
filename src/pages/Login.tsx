import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import userService from "../services/userService";
import { useDispatch } from "react-redux";
import { addToken } from "../redux/token/tokenSlice";
import LoadingDialog from "../components/LoadingDialog";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const onLogin = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, password: string) => {
        event.preventDefault();
        setIsLoading(true);
        if(email && password) {
            try {
                // const response = await userService.login(email, password);
                const response = await axios.post('https://user-mgmt.digitalauto.tech/api/v1/user/login', {
                    email, password
                })
                //https://user-mgmt.digitalauto.tech/api/v1/user/login
                if(response && response.status === 200) {
                    if(response.data.token) {
                        console.log("Token login: ", response.data.token)
                        //navigate('/');
                        dispatch(addToken(response.data.token));
                        setIsLoading(false);
                        window.location.href = 'http://localhost:5173/';
                    }else {
                        alert("Token not found");
                    }
                    console.log("Token local storage: ", localStorage.getItem("token"));
                    console.log("Token response: ", response.data.token);
                }else if(response && response.status === 401) {
                    alert("Email or password is not correct. Please try again");
                }
            } catch (error) {
                console.log(error);
            }
            
        }else {
            alert("Email and password can't be empty");
        }
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    return (
        <div className="login-page">
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <Link to={"/"} className="lg:text-2xl sm:text-sm text-base flex justify-center font-bold cursor-pointer select-none bg-gradient-to-r from-[#005072] to-[#a2b039] bg-clip-text text-transparent " >
                            digital.auto market
                        </Link>
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target?.value)} value={email} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required/>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target?.value)} value={password} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                </div>
                                <button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLogin(event, email, password)} type="submit" className="w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
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