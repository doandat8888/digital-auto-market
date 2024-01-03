interface IProps {
    imgSrc?: string,
    content?: string
}

const NotFound = ({imgSrc, content}: IProps) => {
    return (
        <div className={`notfound items-center opacity-50`}>
            <img className="w-[12%] min-w-[100px] mx-auto mt-12 mb-4" src={imgSrc} alt="notfound" />
            <p className="text-black text-center">{content}</p>
        </div>
    )
}

export default NotFound;