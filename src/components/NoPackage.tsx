import { Link } from "react-router-dom";

interface IProps {
    content: string
}

const NoPackage = (props: IProps) => {

    const {content} = props;

    return (
        <div className="text-center">
            <img className="mx-auto my-4 w-[20%]" src="https://th.bing.com/th/id/R.9153c597bf57132f3506e93d9cba5b6b?rik=g733CBa3Z8Jpjg&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_547086.png&ehk=qulzuCrqLFb20imvpzW2r%2fiMIA4HsJX1veyWxYu7r5A%3d&risl=&pid=ImgRaw&r=0" alt="" />
            <div>{content}</div>
            <Link to={'/addpackage'} className="text-blue-500">Submit your package</Link>
        </div>
    )
}

export default NoPackage;