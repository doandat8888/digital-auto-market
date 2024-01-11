import { TiTickOutline } from "react-icons/ti";
import { TiCancel } from "react-icons/ti";
import { useState } from "react";
import ModalEditVersion from "./ModalEditVersion";
import { CiShare1 } from "react-icons/ci";
import versionService from "../services/versionService";
import { ToastContainer, toast } from "react-toastify";

interface IProps {
    versionList: any[];
    handleChangeStatus: (versionId: string, state: string) => void;
}

const ManageAddVersionTable = ({ versionList, handleChangeStatus }: IProps) => {

    const [openModalEditVersion, setOpenModalEditVersion] = useState(false);
    const [versionItem, setVersionItem] = useState<IGetVersion>();

    const handleClickVersionItem = (versionItem: IGetVersion) => {
        setOpenModalEditVersion(true);
        setVersionItem(versionItem);
    }

    const onCloseModalEditVersion = () => {
        setOpenModalEditVersion(false);
        setVersionItem(undefined);
    }

    const handleSaveInfoVersion = async(_id: string, name: string, desc: string) => {
        try {
            await versionService.updateVersion({
                _id,
                name,
                desc
            }).then(({status}) => {
                if(status === 200) {
                    toast.success('Change version info successfully!');
                    setOpenModalEditVersion(false);
                }
            })
        } catch (error: any) {
            toast.error(error.response.data.msg);
            setOpenModalEditVersion(false);
        }
        
    }

    const handleChangeStateVersion = (_id: string, state: string) => {
        handleChangeStatus(_id, state);
        setOpenModalEditVersion(false);
    }

    return (
        <div>
            <table className="items-center mx-auto w-full border-collapse bg-white rounded shadow-lg">
                <thead>
                    <tr>
                        <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 
                        border-r-0 whitespace-nowrap font-semibold text-left">
                            No
                        </th>
                        <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle 
                        border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Version name
                        </th>
                        <th className="text-ellipsis px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle 
                        border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Package name
                        </th>
                        <th className="px-2 items-center sm:block hidden sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 
                        border-r-0 whitespace-nowrap font-semibold text-left">
                            Status
                        </th>
                        <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 
                        py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {versionList && versionList.length > 0 && versionList.map((versionItem: any, index) => (
                        <tr onClick={() => handleClickVersionItem(versionItem)}>
                            <td className="text-ellipsis border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                {index}
                            </td>
                            <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                <p className="max-w-[100px] overflow-hidden text-ellipsis cursor-pointer">{versionItem.name ? versionItem.name : ''}</p>
                            </td>
                            <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                <p className="max-w-[200px] w-[70%] overflow-hidden text-ellipsis cursor-pointer">{versionItem.package && versionItem.package.name ? versionItem.package.name : ''}</p>
                            </td>
                            <td className="sm:flex h-full items-center hidden border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                <div className={`w-[100px] overflow-hidden text-ellipsis ${versionItem.state === 'rejected' ? 'text-red-500' : versionItem.state === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>{versionItem.state}</div>
                            </td>
                            <td className="border-t-0 px-2 sm:px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                <div className="flex">
                                    {versionItem.state === 'approved' ?
                                        <button onClick={(e) => { e.stopPropagation(), handleChangeStatus(versionItem._id, versionItem.state) }}
                                            className="border-none outline-none flex justify-center mr-2 w-[50%] px-2 py-2 text-white items-center cursor-pointer rounded bg-red-500">
                                            <TiCancel />
                                            <p className="lg:block lg:ml-2 hidden">Reject</p>
                                        </button>
                                        : versionItem.state === 'rejected' ?
                                            <button onClick={(e) => { e.stopPropagation(), handleChangeStatus(versionItem._id, versionItem.state) }}
                                                className="border-none outline-none flex justify-center mr-2 w-[50%] px-2 py-2 text-white items-center cursor-pointer rounded bg-green-500">
                                                <TiTickOutline />
                                                <p className="lg:block lg:ml-2 hidden">Approve</p>
                                            </button>
                                            : <div className="flex w-full justify-between">
                                                <button onClick={(e) => { e.stopPropagation(), handleChangeStatus(versionItem._id, "rejected") }}
                                                    className="border-none outline-none flex justify-center w-[50%] py-2 text-white items-center cursor-pointer rounded bg-green-500">
                                                    <TiTickOutline />
                                                    <p className="lg:block lg:ml-2 hidden">Approve</p>
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleChangeStatus(versionItem._id, "approved") }}
                                                    className="border-none outline-none flex justify-center ml-2 w-[50%] py-2 text-white items-center cursor-pointer rounded bg-red-500">
                                                    <TiCancel />
                                                    <p className="lg:block lg:ml-2 hidden">Reject</p>
                                                </button>
                                            </div>
                                    }
                                    <button onClick={(e) => e.stopPropagation()} className="w-[50%] border-none outline-none flex justify-center mx-2 px-2 py-2  text-white items-center cursor-pointer rounded bg-blue-600">
                                        <a target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center" href={versionItem.entryUrl}> <CiShare1 />
                                            <p className="lg:block lg:ml-2 hidden mx-2">Preview</p>
                                        </a>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <ModalEditVersion
                version={versionItem}
                open={openModalEditVersion}
                onCloseModal={onCloseModalEditVersion}
                handleChangeStatus={handleChangeStateVersion}
                onSaveInfoVersion={handleSaveInfoVersion}
            />
            <ToastContainer />
        </div>
    )
}

export default ManageAddVersionTable;