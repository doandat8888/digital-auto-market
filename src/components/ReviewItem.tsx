import { useEffect, useRef, useState } from "react";
import userService from "../services/userService";
import { Rating } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReviewAction from "./ReviewAction";

interface IProps {
    rating: number,
    comment: string,
    createdBy: string,
    user: IUser,
    onUpdateReview: () => void,
    onDeleteReview: () => void
}

const ReviewItem = (props: IProps) => {

    const { rating, comment, createdBy, user, onUpdateReview, onDeleteReview } = props;
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [canEdit, setCanEdit] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        getUserById(createdBy);
        console.log("Crated by review item: ", createdBy);
        if(user._id === createdBy) {
            setCanEdit(true);
        }
    }, [createdBy]);


    const getUserById = async(idUser: string) => {
        const response = await userService.getUserById(idUser);
        if(response && response.data) {
            setCurrentUser(response.data);
        }
    }

    return (
        <div className="w-full p-4 rounded-lg shadow-md mb-4 bg-white">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <img className="mr-2 w-[30px] h-[30px] object-cover" src={currentUser && currentUser.avt ? currentUser.avt : "https://th.bing.com/th/id/OIP.x3vIJdIBRpMHXgckVd9uCQAAAA?pid=ImgDet&rs=1"} alt="" />
                    {currentUser?.fullName}
                </div>
                {canEdit && <div ref={ref} className="cursor-pointer relative" onClick={() => setShowMenu(!showMenu)}><BsThreeDotsVertical />
                    {showMenu && <ReviewAction onDeleteReview={onDeleteReview} onUpdateReview={onUpdateReview} triggerRef={ref.current} onClose={() => setShowMenu(false)}/>}
                </div>}
            </div>
            <div className="flex">
                <Rating className="mt-[10px]" readOnly size="small" value={rating}/>
                
            </div>
            <div className="text-[14px] mt-[10px] opacity-80">{comment}</div>
        </div>
    )
}

export default ReviewItem