import React from 'react'

interface IProps {
    disabled: boolean,
    onClickBtn: (event: any) => void,
    type?: string,
    title: string
}

const CustomButton = ({disabled, onClickBtn, type, title}: IProps) => {
    return (
        <button
            disabled={disabled}
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClickBtn(event)}
            type={type ? type : 'button'}
            className={`w-full text-white bg-blue-500 hover:opacity-80 focus:ring-4 
                        focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                        dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50`}>
            {title}
        </button>
    )
}

export default CustomButton