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
        slidesToShow: 3,
        slidesToScroll: 3,
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

    const {slideImages} = props;
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
              {slideImages && slideImages.length > 0 && slideImages.map((slideImage, index)=> (
                  <img className="px-2 rounded-[18px] w-[50%] md:h-[80vh] lg:h-[80vh] xl:h-[60vh] object-contain cursor-pointer" onClick={() => showFullImg(slideImage)} src={slideImage} alt="image" />
              ))} 
            </Slider>
            <Modal
                open={open}
                onClose={onCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
            >
                <img src={imgFull} alt="imgFull" className="sm:w-[60%] sm:h-[50%] w-[90%] h-[60%] object-contain"/>
                
            </Modal>
      </div>
        
    )
}

export default Slideshow;