import { useEffect, useState } from "react";
import loggingService from "../services/loggingService";
import { BiDownload } from "react-icons/bi";


const Logging = () => {

    const [loggingList, setLoogingList] = useState<ILogging[]>();

    useEffect(() => {
        getAllLogging();
    });

    const getAllLogging = async () => {
        try {
            await loggingService.getAllLoggingService().then(({ data }) => {
                if (data) {
                    setLoogingList(data.data);
                }
            })
        } catch (error: any) {
            alert(error.response.data.msg)
        }
    }

    return (
        <table className="items-center mx-auto w-full border-collapse bg-white rounded shadow-lg pt-[46px]">
            <thead>
                <tr>
                    <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs 
                    uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Name
                    </th>
                    <th className="px-2 sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs 
                    uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Ref type
                    </th>
                    <th className="px-2 items-center sm:block hidden sm:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs 
                    uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Ref id
                    </th>
                    <th className="px-2 items-center sm:px-6 w-[20%] bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs 
                    uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Time stamp
                    </th>
                </tr>
            </thead>
            <tbody>
                {loggingList && loggingList.length > 0 && loggingList.map((logging) => (
                    <tr>
                        <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                            {logging.name}
                        </td>
                        <td className="border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                            {logging.refType}
                        </td>
                        <td className="sm:flex h-full items-center hidden border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 sm:p-4 text-left text-blueGray-700 ">
                            <div className="w-[70%] overflow-hidden text-ellipsis">{logging.refId}</div>
                        </td>
                        <td className="items-center border-t-0 px-2 sm:px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap sm:p-4 py-2">
                            <a href={logging.timestamp} className="py-2 flex text-white items-center justify-center cursor-pointer rounded bg-blue-400"><BiDownload />
                                <p className="lg:block lg:ml-2 hidden">Download</p>
                            </a>
                        </td>
                    </tr>
                ))
                }
            </tbody>
        </table>
    )
}

export default Logging;