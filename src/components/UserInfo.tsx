import { useEffect, useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";

interface IProps {
    onLogout: () => void,
    onClose: () => void,
    triggerRef: HTMLDivElement | null,
    user: IUser
}

const UserInfo = (props: IProps) => {

    let {onLogout, onClose, triggerRef, user} = props;

    useEffect(() => {

        //Alert if clicked on outside of element
        
        
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
        <div className={`text-black absolute sm:left-[-150px] rounded-[8px] left-[-150px] top-[100%] bg-white border  shadow-lg `}>
            <div className="hover:bg-slate-400 px-2 pt-2 py-1 flex items-center border-black"><AiOutlineUser className="text-xl"/> <p className="w-[120px] truncate mx-2 text-sm">{user?.fullName}</p></div>
            <div onClick={onLogout} className="hover:bg-slate-400 px-2 pt-2 py-1  flex items-center"><RiLogoutBoxLine className="text-xl"/> <p className="mx-2 text-sm">Log out</p></div>
        </div>
    )
}

export default UserInfo;