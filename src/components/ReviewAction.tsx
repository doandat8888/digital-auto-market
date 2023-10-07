import { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

interface IProps {
    triggerRef: HTMLDivElement | null,
    onClose: () => void,
    onUpdateReview: () => void,
    onDeleteReview: () => void
}

const ReviewAction = (props: IProps) => {

    const {triggerRef, onClose, onUpdateReview, onDeleteReview} = props;

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (triggerRef && !triggerRef.contains(event.target as Node)) {
                onClose();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={`absolute left-[-94px] top-[80%] bg-white border border-black rounded-lg`}>
            {/* <div onClick={onUpdateReview} className="hover:bg-slate-400 px-2 pt-2 py-1 flex items-center"><AiOutlineEdit className="text-xl"/> <p className="mx-2 text-sm">Edit</p></div> */}
            <div onClick={onDeleteReview} className="hover:bg-slate-400 px-2 pt-2 py-1  flex items-center"><AiOutlineDelete className="text-xl"/> <p className="mx-2 text-sm">Remove</p></div>
        </div>
    )
}

export default ReviewAction;