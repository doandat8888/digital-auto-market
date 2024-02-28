import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { isArray } from "lodash";

interface IProps {
    slideImages: string[] | undefined,
}

const settingsFirst = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    swipeToSlide: true,
    edgeFriction: 0.15,
    responsive: [
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
            }
        },

        {
            breakpoint: 680,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const settingsSecond = {...settingsFirst};
settingsSecond.slidesToShow = 1;

const Slideshow = (props: IProps) => {

    const { slideImages } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [imgFull, setImgFull] = useState<string | undefined>("");
    const [activeIndex, setActiveIndex] = useState(0);

    const showFullImg = (slideImg: string, index: number) => {
        setOpen(true);
        setImgFull(slideImg);
        setActiveIndex(index);
    }
    const onCloseModal = () => {
        setOpen(false);
    }

    const handleSwitchSlice = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, type: string) => {
        event.stopPropagation();
        event.preventDefault();
        if(isArray(slideImages) && slideImages.length > 0) {
            if(type === "back") {
                setActiveIndex(activeIndex <= 0 ? slideImages.length - 1 : activeIndex - 1);
            }else {
                setActiveIndex(activeIndex >= slideImages.length - 1 ? 0 : activeIndex + 1);
            }
        }
    }

    useEffect(() => {
        if(isArray(slideImages) && slideImages.length > 0) {
            const imgShow = slideImages.find((slideImg, index) => index === activeIndex);
            setImgFull(imgShow);
        }
        
    }, [activeIndex, slideImages])

    return (
        <div>
            <Slider {...settingsFirst}>
                {slideImages && slideImages.length > 0 && slideImages.map((slideImage, index) => (
                    <div className="flex justify-center items-center mb-4" style={{display: 'flex !important'}}>
                        <img className="shadow-sm border-black bg-gray-100 mx-auto aspect-video px-6 py-6 rounded-[18px] w-[96%] object-contain cursor-pointer"
                            onClick={() => showFullImg(slideImage, index)} src={slideImage} alt="image" />
                    </div>
                ))}
            </Slider>
            <Modal
                open={open}
                onClose={onCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
            >
                <div onClick={onCloseModal} className="flex items-center justify-between sm:w-[95%] w-[90%] h-[80%] border-none outline-none">
                    <div onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleSwitchSlice(event, "back")} className="cursor-pointer sm:w-[60px] sm:h-[60px] w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center">
                        <IoIosArrowBack />
                    </div>
                    <div className="w-[90%] h-[100%] flex justify-center">
                        <img onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => event.stopPropagation()} src={imgFull} alt="imgFull" className="bg-white w-[90%] sm:h-[100%] h-[100%] object-contain" />
                    </div>
                    <div onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleSwitchSlice(event, "next")} className="cursor-pointer sm:w-[60px] sm:h-[60px] w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center">
                        <IoIosArrowForward />
                    </div>
                </div>
                
            </Modal>
        </div>

    )
}

export default Slideshow;