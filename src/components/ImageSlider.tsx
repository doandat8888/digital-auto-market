import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "@mui/material";
import { useState } from "react";

interface IProps {
    slideImages: string[] | undefined,
}

const settings = {
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

const Slideshow = (props: IProps) => {

    const { slideImages } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [imgFull, setImgFull] = useState("");

    const showFullImg = (slideImg: string) => {
        setOpen(true);
        setImgFull(slideImg);
    }
    const onCloseModal = () => {
        setOpen(false);
    }

    return (
        <div>
            <Slider {...settings}>
                {slideImages && slideImages.length > 0 && slideImages.map((slideImage) => (
                    <div className="flex justify-center items-center mb-4" style={{display: 'flex !important'}}>
                        <img className="bg-white mx-auto aspect-video px-4 py-4 rounded-[18px] w-[96%] object-contain cursor-pointer"
                            onClick={() => showFullImg(slideImage)} src={slideImage} alt="image" />
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
                <img src={imgFull} alt="imgFull" className="bg-white sm:w-[40%] sm:h-[80%] w-[90%] h-[80%] object-contain" />

            </Modal>
        </div>

    )
}

export default Slideshow;