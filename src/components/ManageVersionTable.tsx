import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";

interface IProps {
    versionList: IGetVersion[],
    canEdit: boolean
}

const ManageVersionTable = (props: IProps) => {

    const { versionList, canEdit } = props;

    return (
        <div>
            <table className="items-center mx-auto w-full border-collapse bg-white rounded shadow-lg">
                <thead>
                <tr>
                    <th className="sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Name
                    </th>
                    <th className="sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Description
                    </th>
                    <th className="sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Download url
                    </th>
                    {canEdit &&  
                        <th className="sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Action
                        </th>
                    }
                   
                </tr>
                </thead>
                <tbody>
                    {versionList && versionList.length > 0 && versionList.map((version) => (
                        <tr>
                            <td className="border-t-0 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                {version.name}
                            </td>
                            <td className="border-t-0 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                {version.desc}
                            </td>
                            <td className="border-t-0 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                <a href={version.downloadUrl} className="w-[40%] px-2 py-2 flex text-white items-center justify-center cursor-pointer rounded bg-blue-400"><BiDownload /><p className="lg:block lg:ml-2 hidden">Download</p></a> 
                            </td>
                            {canEdit && 
                                <td className="border-t-0 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                    <div className="flex">
                                        <button className="border-none outline-none flex justify-center mr-2 w-[30%] px-2 py-2 text-white items-center cursor-pointer rounded bg-yellow-400"><AiOutlineEdit /><p className="lg:block lg:ml-2 hidden">Update</p></button>
                                        <button className="border-none outline-none flex justify-center mx-2 w-[30%] px-2 py-2  text-white items-center cursor-pointer rounded bg-red-600"><AiOutlineDelete /><p className="lg:block lg:ml-2 hidden">Delete</p></button>  
                                    </div>
                                </td>
                            }
                            
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ManageVersionTable;