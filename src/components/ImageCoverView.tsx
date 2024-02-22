import React from 'react'

interface IProps {
    imageCover: string,
    onDeleteCoverImage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageCover: string) => void
}

const ImageCoverView = ({imageCover, onDeleteCoverImage}: IProps) => {
    return (
        <div className="image-container sm:w-1/2 sm:mx-auto w-full relative my-4">
            <img
                src={imageCover}
                alt="Uploaded"
                className="w-full object-cover"
            />
            <button className="absolute top-2 right-2 rounded-full bg-white text-white px-3 py-1 z-40"
                onClick={(event) => onDeleteCoverImage(event, imageCover)}>
                <p className='text-[16px] font-bold text-red-500'>x</p>
            </button>
        </div>
    )
}

export default ImageCoverView