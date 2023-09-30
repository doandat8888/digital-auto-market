import { useEffect, useState } from "react";
import userService from "../services/userService";
import { Rating } from "@mui/material";

interface IProps {
    rating: number,
    comment: string,
    createdBy: string
}

const ReviewItem = (props: IProps) => {

    const { rating, comment, createdBy } = props;
    const [currentUser, setCurrentUser] = useState<IUser>();

    useEffect(() => {
        getUserById(createdBy);
    }, [createdBy]);

    const getUserById = async(idUser: string) => {
        const response = await userService.getUserById(idUser);
        if(response && response.data) {
            setCurrentUser(response.data);
        }
    }

    return (
        <div className="w-full mb-10">
            <div className="flex items-center">
                <img className="mr-2 w-[30px] h-[30px] object-cover" src={currentUser && currentUser.avt ? currentUser.avt : "https://th.bing.com/th/id/OIP.x3vIJdIBRpMHXgckVd9uCQAAAA?pid=ImgDet&rs=1"} alt="" />
                {currentUser?.fullName}
            </div>
            <Rating className="mt-[10px]" readOnly size="small" value={rating}/>
            <div>{comment}</div>
        </div>
    )
}

export default ReviewItem