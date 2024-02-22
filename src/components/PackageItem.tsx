import { BiDownload, BiLike } from 'react-icons/bi';
import { TiCancel, TiTickOutline } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import ModalConfirm from './ModalConfirm';
import { useState } from 'react';
import packageService from '../services/packageService';
import { ToastContainer, toast } from 'react-toastify';
import { AiOutlineDelete } from 'react-icons/ai';

interface IProps {
    packageItem: IGetPackage;
    showMode: boolean,
    userRole?: string,
    isAdminPage?: boolean;
}

const PackageItem = (props: IProps) => {

    const { packageItem, showMode, userRole, isAdminPage } = props;
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
    const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false);
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

    const deletePackage = async () => {
        try {
            const response = await packageService.removePackage(packageItem._id);
            if (response && response.status === 200) {
                alert("Deleted successfully!");
                window.location.reload();
            }
        } catch (error: any) {
            alert(error.response.data.msg);
        }
    }

    const handleChangeStatusPackage = (event: React.MouseEvent<HTMLButtonElement>, packageState: string) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModalConfirm(true);
        setCurrentState(packageState);
    }

    const handleDeletePackage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenModalConfirmDelete(true);
    }

    const onCloseModalConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOpenModalConfirm(false);
    }

    const onCloseModalConfirmDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOpenModalConfirmDelete(false);
    }

    return (
        <>
            {packageItem ? <Link to={`/package/${packageItem._id}?version=latest`} className='w-[90%] mx-auto py-4 my-4 bg-[#eff2ef] rounded-2xl hover:bg-[#e3e3e3] shadow-md'>
                <div className="left mx-auto">
                    <img className="w-[88%] mx-auto bg-white h-[140px] sm:h-[140px] lg:h-[140px] xl:h-[160px] rounded-2xl object-cover aspect-square" src={packageItem.thumbnail != 'abc' ? packageItem.thumbnail :
                        "https://media.istockphoto.com/vectors/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-vector-id1128826884?k=6&m=1128826884&s=170667a&w=0&h=F6kUwTcsLXUojmGFxN2wApEKgjx63zcIshCSOmnfEFs="} alt="" />
                </div>
                <div className="custom-link flex px-5 mt-4 cursor-pointer rounded">
                    <div className="right flex flex-col space-y-1 justify-between">
                        <div className="flex font-520 font-semibold items-center">
                            <p className='w-[100%] lg:text-[16px] sm:text-[16px] text-sm truncate'><div className='w-[200px] truncate'>{packageItem.name}</div></p>
                        </div>
                        <div className='text-[14px] opacity-80'><p className='w-[200px] truncate'>{packageItem?.shortDesc}</p></div>
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
                                        className="border-none outline-none flex justify-center mr-1 px-2 py-1 text-white items-center cursor-pointer rounded bg-red-400"><TiCancel />
                                        <p className="lg:block lg:ml-1 text-[10px] ">Reject</p>
                                    </button>
                                    : packageItem.state === 'rejected' ?
                                        <div className="flex">
                                            <button
                                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, packageItem.state)}
                                                className="border-none outline-none flex justify-center mr-2 px-2 py-1 text-white items-center cursor-pointer rounded bg-green-500"><TiTickOutline />
                                                <p className="lg:block lg:ml-1 text-[10px]">Approve
                                                </p>
                                            </button>
                                            <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDeletePackage(event)}
                                                className="outline-none border-none flex justify-center mr-1 px-2 py-1 items-center cursor-pointer rounded text-white bg-red-500">
                                                <AiOutlineDelete /><p className="lg:block lg:ml-1 text-[10px] ">Delete</p>
                                            </button>
                                        </div>

                                        : <div className="flex w-full">
                                            <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, "rejected")}
                                                className="border-none outline-none flex justify-center px-2 py-1 text-white items-center cursor-pointer rounded bg-green-500"><TiTickOutline />
                                                <p className="lg:block lg:ml-1 text-[10px]">Approve</p>
                                            </button>
                                            <button onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChangeStatusPackage(event, "approved")}
                                                className="border-none outline-none flex justify-center px-2 ml-2 py-1 text-white items-center cursor-pointer rounded bg-red-400"><TiCancel />
                                                <p className="lg:block lg:ml-1 text-[10px]">Reject</p>
                                            </button>
                                        </div>
                                }

                            </div>
                        }
                    </div>
                </div>

                <ModalConfirm content={`Do you want to ${currentState === 'approved' ? 'reject' : 'approve'} ${packageItem.name}?`}
                    action={changeStatus} open={openModalConfirm} handleClose={(event: React.MouseEvent<HTMLButtonElement>) => onCloseModalConfirm(event)} />
                <ToastContainer />
                <ModalConfirm content={`Do you want to delete ${packageItem.name}?`}
                    action={deletePackage} open={openModalConfirmDelete} handleClose={(event: React.MouseEvent<HTMLButtonElement>) => onCloseModalConfirmDelete(event)} />
            </Link> : 
                <Lazyloading />
            }
        </>

    )
}

export default PackageItem