interface IProps {
    index: number,
    base64: string,
    onDeleteDetailImage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => void
}

const ImageDetailView = ({ index, base64, onDeleteDetailImage }: IProps) => {
    return (
        <div className="relative mx-2">
            <img
                className="pt-4 w-full h-[200px] object-cover"
                key={index}
                src={base64}
                alt={`Uploaded ${index} img`}
            />
            <button
                className="absolute top-6 right-2 rounded-full bg-white text-white px-3 py-1 z-40"
                onClick={(event) => onDeleteDetailImage(event, index)}
            >
                <p className='text-[16px] font-bold text-red-500'>x</p>
            </button>
        </div>
    )
}

export default ImageDetailView