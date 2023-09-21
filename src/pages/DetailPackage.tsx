import { useParams } from "react-router";
import { BiLike }  from 'react-icons/bi';
import { BsDownload } from 'react-icons/bs';
import 'swiper/css';
import Slideshow from "../components/ImageSlider";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState, useEffect } from 'react';

const DetailPackage = () => {

    const { id } = useParams();
    const packages = useSelector((state: RootState) => state.packages.value);
    let zipFile: Blob | null = null;

    const [packageDetail, setPackageDetail] = useState<IPackage>();

    function base64ToBlob(base64: string) {
        const base64Data = base64.replace(/^data:.*;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'application/zip' });
        return blob;
    }
    if(packageDetail?.source) {
        const sourceZip: string = packageDetail?.source;
        zipFile = base64ToBlob(sourceZip);
        base64ToBlob(sourceZip);
    }

    
    useEffect(() => {
        const packageInfo = packages.find((packageItem) => packageItem.id === id);
        if(packageInfo) {
            setPackageDetail(packageInfo);
        }
    }, [])

    const downloadZipFile = () => {
        if (zipFile) {
            const url = URL.createObjectURL(zipFile);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'sources.zip';
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        }
        console.log(packageDetail)
    }

    return (
        <div>
            <div className="w-full h-full pt-4 pb-2 px-2 md:px-4 flex justify-center">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full max-w-[960px] bg-slate-200 mt-2 px-2 md:px-6 py-2 md:py-4 rounded-lg">
                        <div className="w-full lg:flex md:flex bg-white rounded-lg py-4 pl-3 pr-1 flex max-h-[300px]">
                            <div className="w-1/3 grid lg:place-items-center sm:place-items-center md:place-items-center">
                                <img src={packageDetail?.imgCover} alt="" className="w-[80%] max-h-[180px] rounded-lg max-w-[300px] object-cover"/>
                            </div>
                            <div className="w-2/3 px-6 flex flex-col">
                                <div className="lg:flex items-center sm:flex">
                                    <p className="lg:text-xl sm:text-lg text-[16px] font-bold">{packageDetail?.name}</p>
                                    <div className="grow"></div>
                                    <p className="text-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] opacity-80">v {packageDetail?.version}</p>
                                </div>
                                <p className="text-[12px] sm-text-[14px] lg:text-[16px] opacity-75">{packageDetail?.author}</p>
                                <div className="grow"></div>
                                <div className="flex">
                                    <div className="flex items-center mx-1"><BiLike /><p className="text-[14px] ml-[2px]">{packageDetail?.likeNumber??0}</p></div>
                                    <div className="flex items-center mx-1"><BsDownload /><p className="text-[14px] ml-[2px]">{packageDetail?.download??0}</p></div>
                                </div>
                                <div className="grow"></div>
                                <div className="lg:flex md:flex sm-flex">
                                    <div className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:mr-2 round cursor-pointer hover:opacity-60 bg-blue-500 text-white 
                                        px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Like</p> <BiLike />
                                    </div>
                                    {zipFile &&
                                        
                                        <div onClick={downloadZipFile} className="w-full lg:w-1/3 sm:w-1/3 my-4 lg:ml-2 round cursor-pointer hover:opacity-60 bg-emerald-500 text-white 
                                            px-6 py-2 rounded-lg flex items-center justify-center"><p className="text-[14px] sm:text-[14px] lg:text-[16px] mx-2">Download</p> <BsDownload />
                                        </div>
                                        
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="description my-4">
                            <p className="text-xl font-bold">Description</p>
                            <p>{packageDetail?.description}</p>
                        </div>
                        <Slideshow slideImages={packageDetail?.imgDetails}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPackage;