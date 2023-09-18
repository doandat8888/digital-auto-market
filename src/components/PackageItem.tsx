import { BiLike }  from 'react-icons/bi';
import { CiWarning } from 'react-icons/ci';
import { BsDownload } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface IProps {
    packageItem: IPackage;
}

const PackageItem = (props: IProps) => {

    let { packageItem } = props; 
    
    return (
        <Link className="custom-link flex px-4 w-[98%] my-2 cursor-pointer py-[20px] bg-white rounded shadow-lg hover:opacity-75" to={`/package/${packageItem.slug}`}>
            <div className="left w-[35%]">
                <img className="w-[100%] rounded" src={packageItem?.img} alt="" />
            </div>
            <div className="right mx-4 w-[65%] flex flex-col">
                <div className="flex text-lg justify-between">
                    <p>{packageItem.name}</p>
                    <div className="version opacity-50 text-[14px]">{packageItem?.version}</div>
                </div>
                <div className="text-[12px] opacity-80">{packageItem?.author}</div>
                <div className="flex-grow"></div>
                <div className="flex">
                    <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">{packageItem?.likeNumber}</p></div>
                    <div className="flex items-center mx-1"><CiWarning /><p className="text-[14px] ml-[2px]">{packageItem?.warningNumber}</p></div>
                    <div className="flex items-center mx-1"><BsDownload /><p className="text-[14px] ml-[2px]">{packageItem?.download}</p></div>
                    <div className='flex items-center'>
                        <div className="dot w-[12px] h-[14px] rounded-full mx-2 bg-[#92c253]"></div>
                        {packageItem?.mode.toUpperCase()}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PackageItem