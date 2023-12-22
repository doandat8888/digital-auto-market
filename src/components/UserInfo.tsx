import { useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { GoPackage } from "react-icons/go";

interface IProps {
    onLogout: () => void,
    onClose: () => void,
    triggerRef: HTMLDivElement | null,
    user: IUser
}

const UserInfo = (props: IProps) => {

    const { onLogout, onClose, triggerRef, user } = props;

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
            <Link to={'/user-profile'} className="hover:bg-slate-400 px-2 pt-2 py-1 flex items-center border-black"><AiOutlineUser className="text-xl" />
                <p className="w-[120px] truncate mx-2 text-sm">User Profile</p>
            </Link>
            <div onClick={onLogout} className="hover:bg-slate-400 px-2 pt-2 py-1  flex items-center"><RiLogoutBoxLine className="text-xl" />
                <p className="mx-2 text-sm">Log out</p>
            </div>
            {user.role === 'admin' && <Link to={'/packageadmin'} className="hover:bg-slate-400 px-2 pt-2 py-1 flex items-center border-black"><GoPackage className="text-xl" />
                <p className="w-[120px] truncate mx-2 text-sm">Manage package</p>
            </Link>}
        </div>
    )
}

export default UserInfo;