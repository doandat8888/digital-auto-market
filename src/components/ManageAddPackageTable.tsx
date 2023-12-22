import { TiTickOutline } from "react-icons/ti";
import { TiCancel } from "react-icons/ti";
import { GoPencil } from "react-icons/go";
import { useNavigate } from "react-router";

interface IProps {
    packageList: IGetPackage[];
    handleChangeStatus: (packageId: string, state: string) => void;
}

const ManageAddPackageTable = ({ packageList, handleChangeStatus }: IProps) => {

    const navigate = useNavigate();

    return (
        <div>
            <table className="items-center mx-auto w-full border-collapse bg-white rounded shadow-lg">
                <thead>
                    <tr>
                        <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 
                        border-r-0 whitespace-nowrap font-semibold text-left">
                            No
                        </th>
                        <th className="w-[40%] px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle 
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
                    {packageList && packageList.length > 0 && packageList.map((packageItem: IGetPackage, index) => (
                        <tr>
                            <td className="text-ellipsis border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                {index}
                            </td>
                            <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                <p className="cursor-pointer" onClick={() => navigate(`/package/${packageItem._id}?version=latest`)}>{packageItem.name}</p>
                            </td>
                            <td className="sm:flex h-full items-center hidden border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                <div className={`w-[70%] overflow-hidden text-ellipsis ${packageItem.state === 'rejected' ? 'text-red-500' : packageItem.state === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>{packageItem.state}</div>
                            </td>
                            <td className="border-t-0 px-2 sm:px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                <div className="flex">
                                    {packageItem.state === 'approved' ?
                                        <button onClick={() => handleChangeStatus(packageItem._id, packageItem.state)}
                                            className="border-none outline-none flex justify-center mr-2 w-[50%] px-2 py-2 text-white items-center cursor-pointer rounded bg-red-500"><TiCancel /><p className="lg:block lg:ml-2 hidden">Reject</p></button>
                                        : packageItem.state === 'rejected' ?
                                            <button onClick={() => handleChangeStatus(packageItem._id, packageItem.state)}
                                                className="border-none outline-none flex justify-center mr-2 w-[50%] px-2 py-2 text-white items-center cursor-pointer rounded bg-green-500"><TiTickOutline /><p className="lg:block lg:ml-2 hidden">Approve</p></button>
                                            : <div className="flex w-full justify-between">
                                                <button onClick={() => handleChangeStatus(packageItem._id, "rejected")}
                                                    className="border-none outline-none flex justify-center w-[50%] py-2 text-white items-center cursor-pointer rounded bg-green-500"><TiTickOutline /><p className="lg:block lg:ml-2 hidden">Approve</p></button>
                                                <button onClick={() => handleChangeStatus(packageItem._id, "approved")}
                                                    className="border-none outline-none flex justify-center ml-2 w-[50%] py-2 text-white items-center cursor-pointer rounded bg-red-500"><TiCancel /><p className="lg:block lg:ml-2 hidden">Reject</p></button>
                                            </div>
                                    }
                                    <button onClick={() => navigate(`/updatepackage/${packageItem._id}`)}
                                        className="border-none outline-none flex justify-center ml-2 w-[50%] py-2 text-white items-center cursor-pointer rounded bg-yellow-500">
                                        <GoPencil /><p className="lg:block lg:ml-2 hidden">Edit</p>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ManageAddPackageTable;