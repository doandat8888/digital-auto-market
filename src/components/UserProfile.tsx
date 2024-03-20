import { useCallback, useEffect, useState } from 'react'
import userService from '../services/userService'
import LoadingDialog from '../components/LoadingDialog'
import TextInput from './TextInput'
import { toast, ToastContainer } from 'react-toastify'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { GoPencil } from 'react-icons/go'
import uploadService from '../services/uploadService'
import convertDateTime from '../utils/convertDateTime'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { IUser } from '../interfaces/IUser'

const UserProfile = () => {
    const [fullName, setFullName] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [showBtnSave, setShowBtnSave] = useState(false)
    const [createdAt, setCreatedAt] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [imageCover, setimageCover] = useState<string>('')
    const navigate = useNavigate()

    const user = useSelector<RootState>((state) => state.user.user) as IUser | undefined

    useEffect(() => {
        setFullName(user?.fullName || '')
        setCreatedAt(user?.createdAt || '')
        setEmail(user?.email || '')
        setimageCover(user?.avt || '')
    }, [user])

    useEffect(() => {
        if (fullName) {
            setShowBtnSave(true)
        } else {
            setShowBtnSave(false)
        }
    }, [fullName])

    const onUpdateUser = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, fullName: string) => {
        setIsLoading(true)
        event.preventDefault()
        try {
            await userService.changeProfile(fullName, imageCover).then(({ status }) => {
                if (status == 200) {
                    alert('Change user info successfully')
                    navigate('/')
                }
            })
        } catch (error: any) {
            toast.error(error.response.data.msg)
        } finally {
            setIsLoading(false)
        }
    }

    const onCloseModal = useCallback(() => {
        setIsLoading(false)
    }, [])

    const handleInputImgCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0]
        const formData = new FormData()
        if (file) {
            formData.append('file', file)
            try {
                await uploadService.uploadFile(formData).then(({ data, status }) => {
                    if (status === 201) {
                        setimageCover(data.url)
                    }
                })
            } catch (error: any) {
                alert(error.response.data.msg)
            }
        }
    }

    return (
        <div className='user-profile py-[46px]'>
            <LoadingDialog open={isLoading} closeModal={onCloseModal} />
            <section className={`${isLoading == true ? 'hidden' : ''} flex items-center justify-center mt-10`}>
                <div className='max-w-[400px] w-[94%] p-6 rounded shadow-md bg-gray-100 text-black'>
                    <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                        <div className='profile-img flex justify-center text-[80px]'>
                            {imageCover == '' ? (
                                <HiOutlineUserCircle />
                            ) : (
                                <img className='w-[80px] h-[80px] rounded-[50%] object-contain' src={imageCover} />
                            )}
                        </div>
                        <label
                            htmlFor='user-img-upload'
                            className='flex w-[30%] mx-auto justify-center items-center relative cursor-pointer rounded-md font-semibol focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2'
                        >
                            <GoPencil />
                            <p className='ml-1'>Change</p>
                            <input
                                required
                                onChange={handleInputImgCoverChange}
                                id='user-img-upload'
                                name='cover-img-upload'
                                type='file'
                                className='sr-only outline-none'
                                value=''
                            />
                        </label>
                        <form className='space-y-4 md:space-y-6' action='#'>
                            <TextInput
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setFullName(event.target?.value)
                                }
                                value={fullName}
                                title='Full name'
                                placeholderStr='Enter your full name'
                            />
                            <TextInput
                                disabled={true}
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setCreatedAt(event.target?.value)
                                }
                                value={email}
                                title='Email'
                                placeholderStr="Enter your account's email"
                            />
                            <TextInput
                                disabled={true}
                                handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setCreatedAt(event.target?.value)
                                }
                                value={convertDateTime(createdAt)}
                                title='Created at'
                                placeholderStr='Enter your account create day'
                            />
                            <div className='flex justify-end text-sm'>
                                <Link to={'/change-password'}>Change password</Link>
                            </div>
                            <button
                                disabled={showBtnSave === true ? false : true}
                                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                                    onUpdateUser(event, fullName)
                                }
                                type='submit'
                                className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg 
                                text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}
                            >
                                Save
                            </button>

                            <button
                                disabled={showBtnSave === true ? false : true}
                                onClick={() => navigate('/')}
                                type='submit'
                                className={`w-full text-white bg-gray-400 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg 
                                text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    )
}
export default UserProfile
