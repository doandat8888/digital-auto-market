import { useEffect, useRef, useState } from "react";
import { Rating } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReviewAction from "./ReviewAction";
import convertDateTime from "../utils/convertDateTime";

interface IProps {
    rating: number,
    comment: string,
    createdBy: {
        _id: string,
        fullName: string
    },
    // user: IUser,
    onUpdateReview: () => void,
    onDeleteReview: () => void,
    createdAt: string,
    currentUser: IUser
}

const ReviewItem = (props: IProps) => {

    const { rating, comment, createdBy, onUpdateReview, onDeleteReview, createdAt, currentUser } = props;
    const [canEdit, setCanEdit] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (currentUser) {
            if (currentUser._id === createdBy._id) {
                setCanEdit(true);
            }
        } else {
            setCanEdit(false);
        }

    }, [createdBy, currentUser, currentUser._id]);



    return (
        <div className="w-full p-4 rounded-lg shadow-md mb-4 bg-white">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <img className="mr-2 w-[30px] h-[30px] object-cover" src={"https://th.bing.com/th/id/OIP.x3vIJdIBRpMHXgckVd9uCQAAAA?pid=ImgDet&rs=1"} alt="" />
                    <div className="">
                        <p className="text-[12px]">{createdBy.fullName}</p>
                        <div className="text-[10px] opacity-80">{convertDateTime(createdAt)}</div>
                    </div>

                </div>
                {canEdit && <div ref={ref} className="cursor-pointer relative" onClick={() => setShowMenu(!showMenu)}><BsThreeDotsVertical />
                    {showMenu && <ReviewAction onDeleteReview={onDeleteReview} onUpdateReview={onUpdateReview} triggerRef={ref.current} onClose={() => setShowMenu(false)} />}
                </div>}
            </div>
            <div className="flex items-center mt-[10px]">
                <Rating readOnly size="small" value={rating} />
            </div>
            <div className="text-[14px] mt-[4px] opacity-80">{comment.length >= 300 ? comment.slice(0, 300) + "..." : comment}</div>
        </div>
    )
}

export default ReviewItem