import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "@mui/material";
import { useState } from "react";

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
    const [imgFull, setImgFull] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const showFullImg = (slideImg: string, index: number) => {
        setOpen(true);
        setImgFull(slideImg);
        setActiveIndex(index);
    }
    const onCloseModal = () => {
        setOpen(false);
    }

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
                <img src={imgFull} alt="imgFull" className="bg-white sm:w-[80%] sm:h-[80%] w-[90%] h-[80%] object-contain" />
            </Modal>
        </div>

    )
}

export default Slideshow;