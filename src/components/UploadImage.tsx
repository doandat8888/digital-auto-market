import { PhotoIcon } from '@heroicons/react/24/solid'
import React from 'react'

interface IProps {
    onUploadImgAreaChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    multiple?: boolean,
    id: string,
    name: string
}

const UploadImage = ({ onUploadImgAreaChange, multiple, name, id }: IProps) => {
    return (
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
                <PhotoIcon className="mx-auto h-24 w-24 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600 text-center">
                    <label
                        htmlFor={name}
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 
                        focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                        <span>{multiple ? multiple === true ? 'Upload images' : 'Upload image' : 'Upload image'}</span>
                        <input
                            multiple={multiple ? multiple : false}
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUploadImgAreaChange(event)}
                            id={id}
                            name={name}
                            type="file"
                            className="sr-only" value=""
                        />
                    </label>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 2MB</p>
            </div>
        </div>
    )
}

export default UploadImage