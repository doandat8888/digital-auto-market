import {Box, Modal, Typography} from "@mui/material"
import { useState } from "react";
import { BsFileZip } from "react-icons/bs";
import uploadService from "../services/uploadService";
import { BiDownload } from "react-icons/bi";

interface IProps {
    open: boolean,
    handleClose: () => void
}

const ModalPublishVersion = (props: IProps) => {

    const {open, handleClose} = props;

    //Zip file
    const [zipFile, setZipFile] = useState<string>("");
    const [deploymentUrl, setDeploymentUrl] = useState("");
    // const [zipBase64, setZipBase64] = useState<string>("");
    const [fileZipName, setFileZipName] = useState<string>("");

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: "80%"
    };

    const handleFileInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            let response = await uploadService.uploadFile(formData);
            if(response && response.status === 201) {
                let zipFileUrl = response.data.url;
                setZipFile(response.data.url);
                setDeploymentUrl(response.data.deploymentUrl);
                const zipFileName = zipFileUrl.replace("http://localhost:9006/data/store-be/", "");
                setFileZipName(zipFileName);
            }
        }
    };

    const onDeleteZipFile = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        let response = await uploadService.deleteFile(fileZipName);
        if(response && response.status === 200) {
            setZipFile("");
            setFileZipName("");
            setDeploymentUrl("");
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-bold leading-6 text-gray-900">
                            Source code
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <BsFileZip className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload zip file</span>
                                        <input accept=".zip" required id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileInputChange}/>
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">File up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="file-container py-[20px] col-span-full">
                        {zipFile && (
                            <div className=" relative w-1/2 sm:w-1/3 lg:w-1/5 px-2 py-2 border border-gray-400 rounded-lg">
                                <BsFileZip className="mx-auto h-14 w-14 text-gray-300" aria-hidden="true" />
                                <div className="grow"></div>
                                <div className="flex items-center mt-4 justify-between">
                                    <p className="text-sm opacity-80">{fileZipName ? fileZipName : 'source.zip'}</p>
                                    <a
                                        href={zipFile}
                                    >
                                        <BiDownload />
                                    </a>
                                    
                                </div>
                                <button className=" hover:opacity-80 absolute top-1 right-2 rounded-[50%] text-[10px] bg-slate-400 text-white px-[8px] py-[4px] z-40" onClick={onDeleteZipFile}>x</button>
                            </div>
                        )}
                        
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default ModalPublishVersion;