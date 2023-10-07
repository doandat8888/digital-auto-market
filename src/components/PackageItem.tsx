import { BiDownload, BiLike }  from 'react-icons/bi';
import { Link } from 'react-router-dom';

interface IProps {
    packageItem: IGetPackage;
}

const PackageItem = (props: IProps) => {

    const { packageItem } = props; 
    
    return (
        <Link className="custom-link flex p-4 w-[96%] my-2 cursor-pointer bg-white rounded shadow-sm hover:opacity-75" to={`/package/${packageItem._id}`}>
            <div className="left">
                <img className="w-[100px] h-[100px] rounded object-cover" src={packageItem?.thumbnail} alt="" />
            </div>
            <div className="right mx-4 w-[65%] flex flex-col justify-between">
                <div className="flex text-[110%] justify-between font-520 font-semibold">
                    <p>{packageItem.name}</p>
                </div>
                <div className="text-[12px] opacity-80">{packageItem?.authors[0]}</div>
                
                <div className='text-[13px] opacity-80'>{packageItem?.shortDesc}</div>
                
                <div className="flex">
                    <div className="flex items-center mx-1 opacity-70"><BiLike /><p className="text-[14px] ml-[2px] ">{packageItem?.likes.length}</p></div>
                    <div className="flex items-center mx-1 opacity-70"><BiDownload /><p className="text-[14px] ml-[2px] ">{packageItem?.downloads}</p></div>
                </div>
            </div>
        </Link>
    )
}

export default PackageItem