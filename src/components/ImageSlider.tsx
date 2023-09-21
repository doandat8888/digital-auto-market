import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

interface IProps {
    slideImages: string[] | undefined
}

const Slideshow = (props: IProps) => {

    let {slideImages} = props;

    return (
      <div className="slide-container">
        <Slide>
         {slideImages && slideImages.length > 0 && slideImages.map((slideImage, index)=> (
            <div key={index}>
              <img className=" object-cover w-full h-full" src={slideImage} alt="" />
            </div>
          ))} 
        </Slide>
      </div>
    )
}

export default Slideshow;