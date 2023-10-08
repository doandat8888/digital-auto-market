import { Box, Modal } from "@mui/material";
import TextArea from "./TextArea";
import { useEffect, useState } from "react";
import Rating from "./Rating";
import reviewService from "../services/reviewService";
import LoadingModal from "./LoadingDialog";

interface IProps {
    open: boolean,
    onCloseModal: () => void,
    packageId: string,
    versionId: string,
    createdBy: any,
    refreshData: () => void,
    reviewUpdate: IUpdateReview | undefined,
    isLoading: boolean,
    onCloseModalLoading: () => void,
    openModalLoading: () => void
}

const ModalCommentRating = (props: IProps) => {

    const { open, onCloseModal, packageId, versionId, createdBy, refreshData, reviewUpdate, isLoading, onCloseModalLoading, openModalLoading } = props;
    const [stars, setStars] = useState<number>(0);
    const starArr = [1, 2, 3, 4, 5];
    const [comment, setComment] = useState("");
    const [disabled, setDisabled] = useState(false);

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
        overflow: "scroll",
    };

    console.log("created by modal comment: ", createdBy)

    const reviewData = [stars, comment];

    const onSaveInfo = async() => {
        let count = 0;
        for(let i = 0; i < reviewData.length; i++) {
            if(reviewData[i] === "") {
                count++;
            }
        }
        if(count > 0) {
            alert("Missing review info. Please try again!")
        }else {
            openModalLoading();
            onCloseModalCommentRating();
            if(!reviewUpdate) {
                const review: IReview = {
                    packageId: packageId,
                    versionId: versionId,
                    rating: stars,
                    content: comment,
                    createdBy: createdBy
                }
                try {
                    const response = await reviewService.addReview(review);
                    if(response && response.status === 201) {
                        alert("Sucessfully!");
                        refreshData();
                        onCloseModal();
                        emptyData();
                    }
                } catch (error: any) {
                    alert(error.response.data.msg);
                }
            }else {
                const review: IReview = {
                    packageId: packageId,
                    versionId: versionId,
                    rating: stars,
                    content: comment,
                    createdBy: createdBy
                }
                try {
                    const response = await reviewService.updateReview(reviewUpdate._id, review);
                    if(response && response.status === 200) {
                        refreshData();
                        onCloseModal();
                        emptyData();
                    }
                } catch (error: any) {
                    alert(error.response.data.msg);
                }
            }
        }
       
    }

    const emptyData = () => {
        setComment("");
        setStars(0);
    }

    const onCloseModalCommentRating = () => {
        emptyData();
        onCloseModal();
    }

    useEffect(() => {
        if(reviewUpdate) {
            setComment(reviewUpdate.content);
            setStars(reviewUpdate.rating);
        }
    }, [reviewUpdate]);

    useEffect(() => {
        if(!comment || stars === 0) {
            setDisabled(true);
        }else {
            setDisabled(false);
        }
    }, [comment, stars]);

    return (
        <div>
            <LoadingModal open={isLoading} closeModal={onCloseModalLoading}/>
            <Modal
            open={open}
                onClose={onCloseModalCommentRating}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TextArea title="Comment" value={comment} handleTextAreaChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)} placeHolderStr="Write some sentences about this package"/>
                    <div className="col-span-full">
                        <div className="flex">
                            <label htmlFor="about" className="block text-sm font-bold leading-6 text-gray-900">
                                Rating
                            </label>
                            <p className="required text-red-500 ml-1">*</p>
                        </div>
                        <div className="mt-2">
                            <Rating starArr={starArr} stars={stars} onClickStar={(value: number) => setStars(value)}/>
                        </div>
                    </div>
                    <div className="w-full flex justify-end">
                        <button
                            type="submit"
                            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${disabled ? 'hidden' : ''}`}
                            onClick={onSaveInfo}
                           
                        >
                            Save
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-400 rounded-md px-3 py-2 ml-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={onCloseModalCommentRating}
                        >
                            Cancel
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
        
    )
}

export default ModalCommentRating;