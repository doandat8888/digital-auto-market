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
            if (currentUser?._id === createdBy?._id) {
                setCanEdit(true);
            }
        } else {
            setCanEdit(false);
        }

    }, [createdBy, currentUser, currentUser?._id]);



    return (
        <div className="w-full p-4 rounded-lg shadow-md mb-4 bg-[#eff2ef] space-y-2">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <img className="mr-2 w-[30px] h-[30px] object-cover" src={"https://th.bing.com/th/id/OIP.x3vIJdIBRpMHXgckVd9uCQAAAA?pid=ImgDet&rs=1"} alt="" />
                    <div className="">
                        <div className="flex items-center space-x-2">
                            <p className="lg:text-md sm:text-sm md:text-md text-[14px]">{createdBy.fullName}</p>
                            <div className="flex items-center">
                                <Rating readOnly size="small" value={rating} />
                            </div>
                            <div className="lg:text-md sm:text-sm md:text-md text-[14px] opacity-60">{convertDateTime(createdAt)}</div>
                        </div>
                        <div className="text-[14px] mt-[4px] opacity-80">{comment.length >= 300 ? comment.slice(0, 300) + "..." : comment}</div>
                    </div>  
                </div>

                {canEdit && <div ref={ref} className="cursor-pointer relative" onClick={() => setShowMenu(!showMenu)}><BsThreeDotsVertical />
                    {showMenu && <ReviewAction onDeleteReview={onDeleteReview} onUpdateReview={onUpdateReview} triggerRef={ref.current} onClose={() => setShowMenu(false)} />}
                </div>}
            </div>

        </div>
    )
}

export default ReviewItem