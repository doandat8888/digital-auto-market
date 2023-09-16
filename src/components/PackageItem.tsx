import { BiLike }  from 'react-icons/bi';
import { CiWarning } from 'react-icons/ci';
import { BsDownload } from 'react-icons/bs';

const PackageItem = () => {
    return (
        <div className="package-item flex px-4 w-[98%] my-2 cursor-pointer py-[20px] bg-white rounded shadow-lg hover:opacity-75">
            <div className="left w-[35%]">
                <img className="w-[100%] rounded" src="https://th.bing.com/th/id/R.05b0f67bc783659ebf8d9c9d32f14100?rik=54ppBeT8IxipbQ&riu=http%3a%2f%2fi.huffpost.com%2fgen%2f1241183%2fimages%2fo-SLEEP-DRIVING-facebook.jpg&ehk=tkAzRgqRmfWOLvTNFumkveKG1hpVgKJcJMHtQKfGY4w%3d&risl=&pid=ImgRaw&r=0" alt="" />
            </div>
            <div className="right mx-4 w-[65%] flex flex-col">
                <div className="flex text-lg justify-between">
                    <p>Sleep when driving</p>
                    <div className="version opacity-50 text-[14px]">v 1.0.0</div>
                </div>
                <div className="text-[12px] opacity-80">by Dat Doan</div>
                <div className="flex-grow"></div>
                <div className="flex">
                    <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">52</p></div>
                    <div className="flex items-center mx-1"><CiWarning /><p className="text-[14px] ml-[2px]">10</p></div>
                    <div className="flex items-center mx-1"><BsDownload /><p className="text-[14px] ml-[2px]">120</p></div>
                    <div className='flex items-center'>
                        <div className="dot w-[12px] h-[14px] rounded-full mx-2 bg-[#92c253]"></div>
                        <div>Public</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PackageItem