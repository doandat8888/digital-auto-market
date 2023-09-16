import _constant from "../const";
import { Link, useLocation } from "react-router-dom";

const Header = () => {

    let pageList: Object[] = _constant.pageList;

    return (
        <div className="px-2 border-b-2 flex items-center lg:text-lg sm:text-sm text-base">
            <Link to={"/"} className="text-2xl py-4 justify-start font-bold cursor-pointer select-none bg-gradient-to-r from-[#AEBD38] to-[#005072] bg-clip-text text-transparent" >
                digital.auto market
            </Link>
            <div className="flex items-center mx-4">
                {pageList && pageList.length > 0 && pageList.map((page: any, index: Number) => (
                    <Link className="mx-2 px-2 cursor-pointer" to={page.path}>{page?.name}</Link>
                ))}
            </div>
        </div>
    )
}

export default Header;