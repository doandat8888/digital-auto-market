import { BiLike }  from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface IProps {
    packageItem: IGetPackage;
}

const PackageItem = (props: IProps) => {

    const { packageItem } = props; 
    
    return (
        <Link className="custom-link flex px-4 w-[98%] my-2 cursor-pointer py-[20px] bg-white rounded shadow-lg hover:opacity-75" to={`/package/${packageItem._id}`}>
            <div className="left w-[35%]">
                <img className="w-[100%] rounded" src={packageItem?.thumbnail} alt="" />
            </div>
            <div className="right mx-4 w-[65%] flex flex-col">
                <div className="flex text-[16px] justify-between">
                    <p>{packageItem.name}</p>
                </div>
                <div className="text-[12px] opacity-80">{packageItem?.authors[0]}</div>
                <div className="flex-grow"></div>
                <div className="flex">
                    <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">{packageItem?.likes}</p></div>
                    <div className='flex items-center'>
                        <div className="dot w-[12px] h-[14px] rounded-full mx-2 bg-[#92c253]"></div>
                        {packageItem?.visibility.toUpperCase()}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PackageItem