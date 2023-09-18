import Header from "../components/Header";
import { useParams } from "react-router";
import { BiLike }  from 'react-icons/bi';
import { CiWarning } from 'react-icons/ci';
import { BsDownload } from 'react-icons/bs';
import _const from "../const";
import 'swiper/css';
import Slideshow from "../components/ImageSlider";

const DetailPackage = () => {

    const { slug } = useParams();

    let packageInfo = _const.packageListFake.find((packageItem) => packageItem.slug === slug);

    return (
        <div>
            <Header />
            <div className="w-full h-full pt-4 pb-2 px-2 md:px-4 flex justify-center">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-[960px] bg-slate-200 mt-2 px-2 md:px-6 py-2 md:py-4 rounded-lg">
                        <div className="w-full lg:flex md:flex bg-white rounded-lg py-4 pl-3 pr-1 flex max-h-[300px]">
                            <div className="w-1/3 grid lg:place-items-center sm:place-items-center md:place-items-center">
                                <img src={packageInfo?.img} alt="" className="w-[80%] max-h-[180px] rounded-lg max-w-[300px] object-cover"/>
                            </div>
                            <div className="w-2/3 px-6 flex flex-col">
                                <div className="lg:flex items-center sm:flex">
                                    <p className="lg:text-xl sm:text-lg text-[16px] font-bold">{packageInfo?.name}</p>
                                    <div className="grow"></div>
                                    <p className="text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] opacity-80">v {packageInfo?.version}</p>
                                </div>
                                <p className="text-[12px] sm-text-[14px] lg:text-[16px] opacity-75">{packageInfo?.author}</p>
                                <div className="grow"></div>
                                <div className="flex">
                                    <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">{packageInfo?.likeNumber}</p></div>
                                    <div className="flex items-center mx-1"><CiWarning /><p className="text-[14px] ml-[2px]">{packageInfo?.warningNumber}</p></div>
                                    <div className="flex items-center mx-1"><BsDownload /><p className="text-[14px] ml-[2px]">{packageInfo?.download}</p></div>
                                </div>
                                <div className="grow"></div>
                                <div className="lg:flex md:flex sm-flex">
                                    <div className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mr-2 round cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                        px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Like</p> <BiLike />
                                    </div>
                                    <div className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mx-4 round cursor-pointer hover:opacity-60 bg-yellow-500 text-white 
                                        px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Warning</p> <CiWarning />
                                    </div>
                                    <div className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:ml-2 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
                                        px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Download</p> <BsDownload />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="description my-4">
                            <p className="text-xl font-bold">Description</p>
                            <p>{packageInfo?.description}</p>
                        </div>
                        <Slideshow slideImages={packageInfo?.imgDetail}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPackage;