import { Box, Modal } from "@mui/material"
import TextInput from "./TextInput";
import { useEffect, useState } from "react";

interface IProps {
    open: boolean,
    onCloseModal: () => void,
    onSaveInfoVersion: ( _id: string, name: string, desc: string) => void,
    version: IGetVersion | undefined,
    handleChangeStatus: (versionId: string, state: string) => void
}

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
    width: "80%",
};

const ModalEditVersion = ({ open, onCloseModal, onSaveInfoVersion, version, handleChangeStatus }: IProps) => {

    const [versionName, setVersionName] = useState('');
    const [versionDesc, setVersionDesc] = useState('');
    const [versionState, setVersionState] = useState('');
    const [packageName, setPackageName] = useState('');
    const [showBtnSave, setShowBtnSave] = useState(false);

    const onCloseModalVersion = () => {
        setVersionName('');
        setVersionDesc('');
        setVersionState('');
        setPackageName('');
        onCloseModal();
    }

    useEffect(() => {
        if (version) {
            setVersionName(version.name);
            setVersionDesc(version.desc);
            setVersionState(version.state);
            setPackageName(version.package.name);
        }
    }, [version]);

    useEffect(() => {
        if(versionName !== '' && versionDesc !== '' && packageName !== '') {
            setShowBtnSave(true);
        }else {
            setShowBtnSave(false);
        }
    }, [versionName, versionDesc, packageName])

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="sm:w-[80%] lg:w-[60%] mx-auto"
            >
                <Box sx={style}>
                    <div className="fixed top-10 w-full">
                        <div className="flex">
                            <button
                                className={`disabled:opacity-50 rounded-md bg-gray-400 px-3 mr-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600`}
                                onClick={() => onCloseModalVersion()}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={showBtnSave === true ? false : true}
                                type="submit"
                                className={`disabled:opacity-50 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-3`}
                                onClick={() => onSaveInfoVersion(version?._id || '' ,versionName, versionDesc)}
                            >
                                Save
                            </button>
                            {versionState === 'approved' ?
                                <button onClick={() => handleChangeStatus(version?._id || '', versionState)}
                                    className="text-sm border-none outline-none flex justify-center mr-2 px-3 py-2 text-white items-center cursor-pointer rounded bg-red-500">
                                    <p className="lg:block hidden">Reject</p>
                                </button>
                                : versionState === 'rejected' ?
                                    <button onClick={() => handleChangeStatus(version?._id || '', versionState)}
                                        className="text-sm border-none outline-none flex justify-center mr-2 px-3 py-2 text-white items-center cursor-pointer rounded bg-green-500">
                                        <p className="lg:block hidden">Approve</p>
                                    </button>
                                    : <div className="flex justify-between">
                                        <button onClick={() => handleChangeStatus(version?._id || '', "rejected")}
                                            className="text-sm border-none outline-none flex justify-center px-3 py-2 text-white items-center cursor-pointer rounded bg-green-500">
                                            <p className="lg:block first:hidden">Approve</p>
                                        </button>
                                        <button onClick={() => handleChangeStatus(version?._id || '', "approved")}
                                            className="text-sm border-none outline-none flex justify-center ml-2 px-3 py-2 text-white items-center cursor-pointer rounded bg-red-500">
                                            <p className="lg:block hidden">Reject</p>
                                        </button>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className="info mt-[72px]">
                        <div className="flex">
                            <div className="sm:w-[50%] w-[100%]">
                                <TextInput
                                    disabled={true}
                                    title="Name"
                                    value={versionName}
                                    handleFileTextChange={(e) => setVersionName(e.target.value)}
                                    placeholderStr="Version name..."
                                />
                            </div>
                            <div className="sm:w-[50%] w-[100%] ml-4">
                                <TextInput
                                    disabled={true}
                                    title="Package name"
                                    value={packageName}
                                    handleFileTextChange={(e) => setVersionName(e.target.value)}
                                    placeholderStr="Version name..."
                                />
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ModalEditVersion
