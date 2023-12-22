import { Box, Modal } from "@mui/material";

interface IProps {
    open: boolean,
    handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
    action: (event: React.MouseEvent<HTMLButtonElement>) => void,
    content: string
}

const ModalConfirm = (props: IProps) => {

    const {open, handleClose, action, content} = props;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: "50%",
        height: "30%",
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="w-full h-full flex flex-col text-black">
                        <p>{content}</p>
                        <div className="grow"></div>
                        <div className="flex justify-end">
                            <button
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => action(event)}
                                type="submit"
                                className="mx-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline 
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Yes
                            </button>
                            <button
                                type="submit"
                                className="bg-gray-400 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline 
                                focus-visible:outline-2 focus-visible:outline-offset-2"
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClose(event)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ModalConfirm;