import { Box, Modal } from "@mui/material";
import TextArea from "./TextArea";
import { useState } from "react";
import Rating from "./Rating";
import reviewService from "../services/reviewService";

interface IProps {
    open: boolean,
    onCloseModal: () => void,
    packageId: string,
    versionId: string,
    createdBy: string,
    refreshData: () => void
}

const ModalCommentRating = (props: IProps) => {

    const { open, onCloseModal, packageId, versionId, createdBy, refreshData } = props;
    const [stars, setStars] = useState<number>(0);
    const starArr = [1, 2, 3, 4, 5];
    const [comment, setComment] = useState("");

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

    const reviewData = [stars, comment];

    const onSaveInfo = async() => {
        let review: IReview = {
            packageId: packageId,
            versionId: versionId,
            rating: stars,
            content: comment,
            createdBy: createdBy
        }
        let count = 0;
        for(let i = 0; i < reviewData.length; i++) {
            if(reviewData[i] === "") {
                count++;
            }
        }
        if(count > 0) {
            alert("Missing review info. Please try again!")
        }else {
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

    return (
        <Modal
            open={open}
            onClose={onCloseModalCommentRating}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <TextArea title="Comment" value={comment} handleTextAreaChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)} placeHolderStr="Write some sentences about this package"/>
                <div className="col-span-full">
                    <label htmlFor="about" className="block text-sm font-bold leading-6 text-gray-900">
                        Rating
                    </label>
                    <div className="mt-2">
                        <Rating starArr={starArr} stars={stars} onClickStar={(value: number) => setStars(value)}/>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={onSaveInfo}
                    >
                        Save
                    </button>
                </div>
            </Box>
        </Modal>
    )
}

export default ModalCommentRating;