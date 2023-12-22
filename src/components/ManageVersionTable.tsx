import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import NoPackage from "./NoPackage";
import handleDate from "../utils/handleDate";
import { CiShare1 } from "react-icons/ci";

interface IProps {
    versionList: IGetVersion[],
    canEdit: boolean,
    onUpdateVersion: (version: IGetVersion) => void,
    onDeleteVersion: (versionId: string) => void
}

const ManageVersionTable = (props: IProps) => {

    const { versionList, canEdit, onUpdateVersion, onDeleteVersion } = props;

    return (
        <div>
            {versionList ?
                <table className="items-center mx-auto w-full border-collapse bg-white rounded shadow-lg">
                    <thead>
                        <tr>
                            <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Version
                            </th>
                            <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Release date
                            </th>
                            <th className="px-2 items-center sm:block hidden sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Description
                            </th>
                            <th className="px-2 items-center sm:px-6 w-[20%] bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Download url
                            </th>
                            {canEdit &&
                                <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Action
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {versionList && versionList.length > 0 && versionList.map((version) => (
                            <tr>
                                <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                    {version.name}
                                </td>
                                <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                    {handleDate.convertToDate(version.createdAt)}
                                </td>
                                <td className="sm:flex h-full items-center hidden border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                                    <div className="w-[70%] overflow-hidden text-ellipsis">{version.desc}</div>
                                </td>
                                <td className="items-center border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                    <a href={version.downloadUrl} className="py-2 flex text-white items-center justify-center cursor-pointer rounded bg-blue-400"><BiDownload /><p className="lg:block lg:ml-2 hidden">Download</p></a>
                                </td>
                                {canEdit &&
                                    <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                                        <div className="flex">
                                            <button onClick={() => onUpdateVersion(version)}
                                                className="border-none outline-none flex justify-center mr-2 w-[30%] px-2 py-2 text-white items-center cursor-pointer rounded bg-yellow-400">
                                                <AiOutlineEdit /><p className="lg:block lg:ml-2 hidden">Update</p>
                                            </button>
                                            <button onClick={() => onDeleteVersion(version._id)}
                                                className="border-none outline-none flex justify-center mx-2 w-[30%] px-2 py-2  text-white items-center cursor-pointer rounded bg-red-600">
                                                <AiOutlineDelete /><p className="lg:block lg:ml-2 hidden">Delete</p>
                                            </button>
                                            <button className="border-none outline-none flex justify-center mx-2 w-[30%] px-2 py-2  text-white items-center cursor-pointer rounded bg-blue-600">
                                                <a target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center" href={version.deploymentUrl}> <CiShare1 />
                                                    <p className="lg:block lg:ml-2 hidden mx-2">Preview</p>
                                                </a>
                                            </button>
                                        </div>
                                    </td>
                                }
                            </tr>
                        ))
                        }
                    </tbody>
                </table> : <NoPackage content="Package not found" />
            }

        </div>
    )
}

export default ManageVersionTable;