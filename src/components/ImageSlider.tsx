import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface IProps {
    slideImages: string[] | undefined
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
      breakpoint: 1024,
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

    return (
        <Slider {...settings}>
         {slideImages && slideImages.length > 0 && slideImages.map((slideImage, index)=> (
              <img className="px-2 rounded-[20px] object-cover h-[200px]" src={slideImage} alt="image" />
          ))} 
        </Slider>
    )
}

export default Slideshow;