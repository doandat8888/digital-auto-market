import { BiDownload, BiLike } from 'react-icons/bi';
import { TiCancel, TiTickOutline } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import ModalConfirm from './ModalConfirm';
import { useState } from 'react';
import packageService from '../services/packageService';
import { ToastContainer, toast } from 'react-toastify';

interface IProps {
    packageItem: IGetPackage;
    showMode: boolean,
    userRole?: string,
    isAdminPage?: boolean;
}

const PackageItem = (props: IProps) => {

    const { packageItem, showMode, userRole, isAdminPage } = props;
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
    const [currentState, setCurrentState] = useState("");

    const changeStatus = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        try {
            const response = await packageService.changeStatus(packageItem._id, packageItem.state);
            if (response && response.status === 200) {
                setOpenModalConfirm(false);
                toast.success(response.data.msg);
                window.location.reload();
            }
        } catch (error) {
            toast.error("Fail to change status");
        }
    }

    const handleChangeStatusPackage = (event: React.MouseEvent<HTMLButtonElement>, packageState: string) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModalConfirm(true);
        setCurrentState(packageState);
    }

    const onCloseModalConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOpenModalConfirm(false);
    }

    return (
        <Link className="custom-link flex p-4 w-[96%] my-2 cursor-pointer bg-white rounded shadow-sm hover:opacity-75" to={`/package/${packageItem._id}?version=latest`}>
            <div className="left sm:w-[20%] lg:w-[40%] w-[40%] xl:w-[30%] min-w-[100px]">
                <img className="w-[100%] aspect-square rounded object-contain" src={packageItem.thumbnail != 'abc' ? packageItem.thumbnail :
                    "https://media.istockphoto.com/vectors/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-vector-id1128826884?k=6&m=1128826884&s=170667a&w=0&h=F6kUwTcsLXUojmGFxN2wApEKgjx63zcIshCSOmnfEFs="} alt="" />
            </div>
            <div className="right mx-4 w-[60%] sm:w-[70%] lg:w-[60%] xl:w-[70%] flex flex-col justify-between">
                <div className="flex font-520 font-semibold">
                    <p className='w-[100%] sm:text-[13px] text-[12px] lg:text[13px] xl:text-[16px] truncate'><div className='w-[80%] truncate'>{packageItem.name}</div></p>
                </div>
                <div className='text-[12px] opacity-80'><p className='w-[80%] truncate'>{packageItem?.shortDesc}</p></div>
                <div className="flex items-center">
                    <div className="flex">
                        <div className="flex items-center mx-0.5 opacity-70"><BiLike /><p className="text-[12px] ml-[2px] ">{packageItem?.likes.length}</p></div>
                        <div className="flex items-center mx-0.5 opacity-70"><BiDownload /><p className="text-[12px] ml-[2px] ">{packageItem?.downloads}</p></div>
                    </div>
                    {showMode === true &&
                        <div className='flex items-center'>
                            <div className={`rounded-[40%] w-[14px] h-[14px] ${packageItem.visibility === "public" ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className='text-[12px] ml-1 opacity-80 md:w-[20px] xl:w-[40px] truncate'><p className='max-w-[100px]'>{packageItem.visibility}</p></div>
                        </div>
                    }
                    {userRole === "admin" && isAdminPage && <div className={`text-[12px] text-ellipsis ml-2 min-w-[100px] ${packageItem.state === 'rejected' ? 'text-red-500' : packageItem.state === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>{packageItem.state}</div>}
                </div>
                {userRole === "admin" && isAdminPage &&
                    <div className="flex">
                        {packageItem.state === 'approved' ?
                            <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, packageItem.state)}
                                className="border-none outline-none flex justify-center mr-1 px-2 py-1 text-white items-center cursor-pointer rounded bg-red-500"><TiCancel />
                                <p className="lg:block lg:ml-1 text-[10px] ">Reject</p>
                            </button>
                            : packageItem.state === 'rejected' ? <button
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, packageItem.state)}
                                className="border-none outline-none flex justify-center mr-2 px-2 py-1 text-white items-center cursor-pointer rounded bg-green-500"><TiTickOutline />
                                <p className="lg:block lg:ml-1 text-[10px]">Approve
                                </p></button>
                                : <div className="flex w-full">
                                    <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, "rejected")}
                                        className="border-none outline-none flex justify-center px-2 py-1 text-white items-center cursor-pointer rounded bg-green-500"><TiTickOutline />
                                        <p className="lg:block lg:ml-1 text-[10px]">Approve</p>
                                    </button>
                                    <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, "approved")}
                                        className="border-none outline-none flex justify-center px-2 ml-2 py-1 text-white items-center cursor-pointer rounded bg-red-500"><TiCancel />
                                        <p className="lg:block lg:ml-1 text-[10px]">Reject</p>
                                    </button>
                                </div>
                        }
                    </div>
                }
            </div>
            <ModalConfirm content={`Do you want to ${currentState === 'approved' ? 'reject' : 'approve'} this package?`}
                action={changeStatus} open={openModalConfirm} handleClose={(event: React.MouseEvent<HTMLButtonElement>) => onCloseModalConfirm(event)} />
            <ToastContainer />
        </Link>
    )
}

export default PackageItem