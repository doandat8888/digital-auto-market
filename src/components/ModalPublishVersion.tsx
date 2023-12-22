import { Box, Modal } from "@mui/material"
import { useEffect, useState } from "react";
import uploadService from "../services/uploadService";
import UploadFile from "./UploadFile";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import versionService from "../services/versionService";
import LoadingModal from "./LoadingDialog";

interface IProps {
    open: boolean,
    handleClose: () => void,
    packageId: string,
    refreshData: () => void,
    versionUpdate: IUpdateVersion | undefined
}

const ModalPublishVersion = (props: IProps) => {

    const { open, handleClose, packageId, refreshData, versionUpdate } = props;
    //Version info
    const [versionName, setVersionName] = useState("");
    const [versionDesc, setVersionDesc] = useState<string | undefined>("");

    //Zip file
    const [zipFile, setZipFile] = useState<string>("");
    const [file, setFile] = useState<File | undefined>();
    const [deploymentUrl, setDeploymentUrl] = useState("");
    // const [zipBase64, setZipBase64] = useState<string>("");
    const [fileZipName, setFileZipName] = useState<string>("");
    //Disable save btn
    const [disabled, setDisabled] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingZipFile, setIsLoadingZipFile] = useState(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        padding: "0 20px",
        borderRadius: 2,
        width: "80%",
        height: "auto",
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingZipFile(true);
        const file = event.target?.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setFile(file);
            await uploadService.uploadFile(formData).then(({ data, status }) => {
                if (status === 201) {
                    const zipFileUrl = data.url;
                    setZipFile(data.url);
                    setDeploymentUrl(data.deploymentUrl);
                    const zipFileName = zipFileUrl.replace(import.meta.env.VITE_APP_DATA_STORAGE_URL, "");
                    setFileZipName(zipFileName);
                    setIsLoadingZipFile(false);
                }
            })
        }
    };

    const onDeleteZipFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const fileDeleteName = zipFile.replace(`${import.meta.env.VITE_APP_UPLOAD_URL}data`, "");
        await uploadService.deleteFile(fileDeleteName).then(({ status }) => {
            if (status === 200) {
                setZipFile("");
                setFileZipName("");
                setDeploymentUrl("");
            }
        })
    }

    const emptyData = () => {
        setVersionName("");
        setVersionDesc("");
        setZipFile("");
        setFileZipName("");
        setDeploymentUrl("");
    }

    const onSaveInfoVersion = async () => {

        setIsLoading(true);
        handleClose();
        if (!versionUpdate) {
            if (!versionName || !zipFile || !deploymentUrl || !versionDesc || !packageId) {
                alert("Missing version info. Please try again!");
            } else {
                const versionAdd: IAddVersion = {
                    packageId: packageId,
                    name: versionName,
                    desc: versionDesc,
                    file: file,
                }
                try {
                    await versionService.addVersion(versionAdd).then(({ status }) => {
                        if (status === 201) {
                            alert("Add new version successfully!");
                            emptyData();
                            refreshData();
                            setIsLoading(false);
                        }
                    })
                } catch (error: any) {
                    alert(error.response.data.msg);
                    setIsLoading(false);
                }
            }
        } else {
            if (!versionDesc) {
                alert("Missing version info. Please try again!");
                setIsLoading(false);
            } else {
                const versionEdit: IUpdateVersion = {
                    _id: versionUpdate._id,
                    desc: versionDesc,
                }
                try {
                    await versionService.updateVersion(versionEdit).then(({ status }) => {
                        if (status === 200) {
                            alert("Update version successfully!");
                            emptyData();
                            refreshData();
                            setIsLoading(false);
                        }
                    })
                } catch (error: any) {
                    alert(error.response.data.msg);
                    setIsLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        if (versionUpdate) {
            setVersionDesc(versionUpdate.desc);
        }
    }, [versionUpdate])

    const onCloseModal = () => {
        emptyData();
        handleClose();
    }

    useEffect(() => {
        if (!versionUpdate) {
            if (versionName && versionDesc && zipFile) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        } else {
            if (versionDesc) {
                setDisabled(false);
            }
        }
    }, [versionName, versionDesc, zipFile])

    return (
        <div className="h-auto my-auto overflow-scroll">
            <LoadingModal open={isLoading} closeModal={() => setIsLoading(false)} />
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="h-auto my-auto overflow-scroll"
            >
                <Box sx={style}>
                    {!versionUpdate && <TextInput title="Version name" value={versionName} placeholderStr="Enter your version name"
                        handleFileTextChange={(event: React.ChangeEvent<HTMLInputElement>) => setVersionName(event.target.value)} />}
                    <TextArea title="Description" value={versionDesc ? versionDesc : ''}
                        handleTextAreaChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setVersionDesc(event.target.value)} placeHolderStr="Write some sentences about your version" />
                    {!versionUpdate && <UploadFile zipFile={zipFile} fileZipName={fileZipName} handleFileInputChange={handleFileInputChange} onDeleteZipFile={onDeleteZipFile} />}
                    {isLoadingZipFile == true ? <p className="text-black">Loading...</p> : ''}
                    <div className="w-full flex justify-end">
                        <button
                            type="submit"
                            disabled={disabled}
                            className={`disabled:opacity-50 rounded-md bg-blue-500 px-3 py-2 mb-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                            onClick={onSaveInfoVersion}
                        >
                            Save
                        </button>
                        <button

                            type="submit"
                            className="bg-gray-400 rounded-md px-3 py-2 ml-2 mb-4 text-sm font-semibold text-white shadow-sm 
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={onCloseModal}
                        >
                            Cancel
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default ModalPublishVersion;