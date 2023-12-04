import { BiDownload, BiLike }  from 'react-icons/bi';
import { Link } from 'react-router-dom';

interface IProps {
    packageItem: IGetPackage;
    showMode: boolean
}

const PackageItem = (props: IProps) => {

    const { packageItem, showMode } = props; 
    
    return (
        <Link className="custom-link flex p-4 w-[96%] my-2 cursor-pointer bg-white rounded shadow-sm hover:opacity-75" to={`/package/${packageItem._id}?version=latest`}>
            <div className="left sm:w-[20%] lg:w-[40%] w-[40%] xl:w-[30%] min-w-[100px]">
                <img className="w-[100%] aspect-square rounded object-contain" src={packageItem.thumbnail != 'abc' ? packageItem.thumbnail : "https://media.istockphoto.com/vectors/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-vector-id1128826884?k=6&m=1128826884&s=170667a&w=0&h=F6kUwTcsLXUojmGFxN2wApEKgjx63zcIshCSOmnfEFs="} alt="" />
            </div>
            <div className="right mx-4 w-[60%] sm:w-[70%] lg:w-[60%] xl:w-[70%] flex flex-col justify-between">
                <div className="flex font-520 font-semibold">
                    <p className='w-[100%] sm:text-[13px] text-[12px] lg:text[13px] xl:text-[16px] truncate'><div className='w-[80%] truncate'>{packageItem.name}</div></p>
                </div>
                <div className='text-[12px] opacity-80'><p className='w-[80%] truncate'>{packageItem?.shortDesc}</p></div>
                <div className="autofill">
                    <div className="flex">
                        <div className="flex items-center mx-0.5 opacity-70"><BiLike /><p className="text-[12px] ml-[2px] ">{packageItem?.likes.length}</p></div>
                        <div className="flex items-center mx-0.5 opacity-70"><BiDownload /><p className="text-[12px] ml-[2px] ">{packageItem?.downloads}</p></div>
                    </div>
                    {showMode === true &&
                        <div className='flex items-center'>
                            <div className={`rounded-[40%] w-[14px] h-[14px] ${packageItem.visibility === "public" ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className='text-[12px] ml-1 opacity-80 md:w-[20px] xl:w-[40px] truncate'><p className='max-w-[100px]'>{packageItem.visibility}</p></div>
                        </div>
                    }
                </div>
            </div>
        </Link>
    )
}

export default PackageItem