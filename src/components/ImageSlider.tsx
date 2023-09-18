import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}


interface IProps {
    slideImages: ISlider[] | undefined
}

const Slideshow = (props: IProps) => {

    let {slideImages} = props;

    return (
      <div className="slide-container">
        <Slide>
         {slideImages && slideImages.length > 0 && slideImages.map((slideImage, index)=> (
            <div key={index}>
              {/* <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
              </div> */}
              <img className=" object-cover w-full h-full" src={slideImage.url} alt="" />
            </div>
          ))} 
        </Slide>
      </div>
    )
}

export default Slideshow;